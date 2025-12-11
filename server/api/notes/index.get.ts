import prisma from '../../prisma'

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event)

    if (!session?.user?.id) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const query = getQuery(event)
    const limit = parseInt(query.limit as string) || 20
    const orderBy = (query.orderBy as string) || 'updatedAt'
    const growthStage = query.growthStage as string | undefined
    const tagId = query.tagId as string | undefined

    const where: any = { userId: session.user.id }

    if (growthStage && ['SEEDLING', 'BUDDING', 'EVERGREEN'].includes(growthStage)) {
        where.growthStage = growthStage
    }

    if (tagId) {
        where.tags = { some: { tagId } }
    }

    const notes = await prisma.note.findMany({
        where,
        orderBy: { [orderBy]: 'desc' },
        take: limit,
        include: {
            tags: {
                include: { tag: true }
            },
            _count: {
                select: { linksFrom: true, linksTo: true }
            }
        }
    })

    return notes.map(note => ({
        id: note.id,
        title: note.title,
        slug: note.slug,
        growthStage: note.growthStage,
        isPublic: note.isPublic,
        createdAt: note.createdAt.toISOString(),
        updatedAt: note.updatedAt.toISOString(),
        tags: note.tags.map(t => ({ id: t.tag.id, name: t.tag.name, color: t.tag.color })),
        linkCount: note._count.linksFrom + note._count.linksTo,
    }))
})
