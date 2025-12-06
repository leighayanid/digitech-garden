import prisma from '#lib/prisma'

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event)

    if (!session?.user?.id) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const body = await readBody(event)

    if (!body.url) {
        throw createError({
            statusCode: 400,
            message: 'URL is required',
        })
    }

    return await prisma.readingItem.create({
        data: {
            userId: session.user.id,
            url: body.url,
            title: body.title || body.url,
            note: body.note,
        },
    })
})
