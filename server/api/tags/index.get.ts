import prisma from '#lib/prisma'

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event)

    if (!session?.user?.id) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const tags = await prisma.tag.findMany({
        where: { userId: session.user.id },
        include: {
            _count: { select: { notes: true } }
        },
        orderBy: { name: 'asc' },
    })

    return tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        color: tag.color,
        noteCount: tag._count.notes,
    }))
})
