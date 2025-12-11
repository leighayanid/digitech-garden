import prisma from '../../prisma'

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event)

    if (!session?.user?.id) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const userId = session.user.id

    const [totalNotes, seedlings, budding, evergreen, totalTags] = await Promise.all([
        prisma.note.count({ where: { userId } }),
        prisma.note.count({ where: { userId, growthStage: 'SEEDLING' } }),
        prisma.note.count({ where: { userId, growthStage: 'BUDDING' } }),
        prisma.note.count({ where: { userId, growthStage: 'EVERGREEN' } }),
        prisma.tag.count({ where: { userId } }),
    ])

    return {
        totalNotes,
        seedlings,
        budding,
        evergreen,
        totalTags,
    }
})
