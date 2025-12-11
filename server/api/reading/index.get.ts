import prisma from '../../prisma'

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event)

    if (!session?.user?.id) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    return await prisma.readingItem.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
    })
})
