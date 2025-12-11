import prisma from '../../prisma'

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

    const body = await readBody(event)

    if (!body.title) {
        throw createError({
            statusCode: 400,
            message: 'Title is required',
        })
    }

    // Generate unique slug
    let slug = generateSlug(body.title)
    let slugExists = await prisma.note.findUnique({ where: { slug } })
    let counter = 1
    while (slugExists) {
        slug = `${generateSlug(body.title)}-${counter}`
        slugExists = await prisma.note.findUnique({ where: { slug } })
        counter++
    }

    const note = await prisma.note.create({
        data: {
            title: body.title,
            content: body.content || '',
            slug,
            growthStage: body.growthStage || 'SEEDLING',
            isPublic: body.isPublic || false,
            userId: session.user.id,
        },
    })

    // Process wiki links [[Note Title]]
    const wikiLinkRegex = /\[\[([^\]]+)\]\]/g
    const matches = body.content?.matchAll(wikiLinkRegex) || []

    for (const match of matches) {
        const linkedTitle = match[1]
        // Find or create the linked note
        let linkedNote = await prisma.note.findFirst({
            where: {
                userId: session.user.id,
                OR: [
                    { title: linkedTitle },
                    { slug: generateSlug(linkedTitle) }
                ]
            }
        })

        if (!linkedNote) {
            // Create placeholder note
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

        // Create link
        await prisma.noteLink.upsert({
            where: {
                fromNoteId_toNoteId: {
                    fromNoteId: note.id,
                    toNoteId: linkedNote.id,
                }
            },
            create: {
                fromNoteId: note.id,
                toNoteId: linkedNote.id,
            },
            update: {}
        })
    }

    // Handle tags
    if (body.tags && Array.isArray(body.tags)) {
        for (const tagName of body.tags) {
            // Find or create tag
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
                    noteId: note.id,
                    tagId: tag.id,
                }
            })
        }
    }

    return note
})
