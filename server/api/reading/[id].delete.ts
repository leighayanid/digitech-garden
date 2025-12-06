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

    return await prisma.readingItem.delete({
        where: {
            id,
            userId: session.user.id,
        },
    })
})
