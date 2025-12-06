import prisma from '#lib/prisma'

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event)

    if (!session?.user?.id) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const id = getRouterParam(event, 'id')

    const note = await prisma.note.findFirst({
        where: {
            id,
            userId: session.user.id,
        },
        include: {
            tags: {
                include: { tag: true }
            },
            linksFrom: {
                include: {
                    toNote: {
                        select: { id: true, title: true, slug: true, growthStage: true }
                    }
                }
            },
            linksTo: {
                include: {
                    fromNote: {
                        select: { id: true, title: true, slug: true, growthStage: true }
                    }
                }
            },
        }
    })

    if (!note) {
        throw createError({
            statusCode: 404,
            message: 'Note not found',
        })
    }

    return {
        id: note.id,
        title: note.title,
        content: note.content,
        slug: note.slug,
        growthStage: note.growthStage,
        isPublic: note.isPublic,
        createdAt: note.createdAt.toISOString(),
        updatedAt: note.updatedAt.toISOString(),
        tags: note.tags.map(t => ({ id: t.tag.id, name: t.tag.name, color: t.tag.color })),
        linksTo: note.linksFrom.map(l => l.toNote),
        backlinks: note.linksTo.map(l => l.fromNote),
    }
})
