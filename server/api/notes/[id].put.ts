import prisma from '#lib/prisma'

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
}

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event)

    if (!session?.user?.id) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    // Verify ownership
    const existing = await prisma.note.findFirst({
        where: { id, userId: session.user.id },
    })

    if (!existing) {
        throw createError({
            statusCode: 404,
            message: 'Note not found',
        })
    }

    // Update slug if title changed
    let slug = existing.slug
    if (body.title && body.title !== existing.title) {
        slug = generateSlug(body.title)
        let slugExists = await prisma.note.findFirst({
            where: { slug, id: { not: id } }
        })
        let counter = 1
        while (slugExists) {
            slug = `${generateSlug(body.title)}-${counter}`
            slugExists = await prisma.note.findFirst({
                where: { slug, id: { not: id } }
            })
            counter++
        }
    }

    const note = await prisma.note.update({
        where: { id },
        data: {
            title: body.title ?? existing.title,
            content: body.content ?? existing.content,
            slug,
            growthStage: body.growthStage ?? existing.growthStage,
            isPublic: body.isPublic ?? existing.isPublic,
        },
    })

    // Update wiki links
    if (body.content !== undefined) {
        // Remove old links
        await prisma.noteLink.deleteMany({
            where: { fromNoteId: id }
        })

        // Process new wiki links
        const wikiLinkRegex = /\[\[([^\]]+)\]\]/g
        const matches = body.content.matchAll(wikiLinkRegex)

        for (const match of matches) {
            const linkedTitle = match[1]
            let linkedNote = await prisma.note.findFirst({
                where: {
                    userId: session.user.id,
                    OR: [
                        { title: linkedTitle },
                        { slug: generateSlug(linkedTitle) }
                    ]
                }
            })

            if (!linkedNote && linkedTitle !== body.title) {
                const linkedSlug = generateSlug(linkedTitle)
                linkedNote = await prisma.note.create({
                    data: {
                        title: linkedTitle,
                        content: '',
                        slug: linkedSlug,
                        userId: session.user.id,
                    }
                })
            }

            if (linkedNote && linkedNote.id !== id) {
                await prisma.noteLink.upsert({
                    where: {
                        fromNoteId_toNoteId: {
                            fromNoteId: id,
                            toNoteId: linkedNote.id,
                        }
                    },
                    create: {
                        fromNoteId: id,
                        toNoteId: linkedNote.id,
                    },
                    update: {}
                })
            }
        }
    }

    // Update tags
    if (body.tags !== undefined) {
        await prisma.noteTag.deleteMany({ where: { noteId: id } })

        for (const tagName of body.tags) {
            let tag = await prisma.tag.findUnique({
                where: {
                    userId_name: {
                        userId: session.user.id,
                        name: tagName,
                    }
                }
            })

            if (!tag) {
                tag = await prisma.tag.create({
                    data: {
                        name: tagName,
                        userId: session.user.id,
                    }
                })
            }

            await prisma.noteTag.create({
                data: {
                    noteId: id,
                    tagId: tag.id,
                }
            })
        }
    }

    return note
})
