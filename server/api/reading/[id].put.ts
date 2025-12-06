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
    const body = await readBody(event)

    return await prisma.readingItem.update({
        where: {
            id,
            userId: session.user.id,
        },
        data: {
            read: body.read,
            title: body.title,
            note: body.note,
        },
    })
})
