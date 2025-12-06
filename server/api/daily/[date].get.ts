import prisma from '#lib/prisma'

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event)

    if (!session?.user?.id) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const dateStr = getRouterParam(event, 'date')
    const date = new Date(dateStr + 'T00:00:00.000Z')

    const dailyNote = await prisma.dailyNote.findFirst({
        where: {
            userId: session.user.id,
            date,
        },
    })

    if (!dailyNote) {
        return {
            id: null,
            date: date.toISOString(),
            content: '',
        }
    }

    return {
        id: dailyNote.id,
        date: dailyNote.date.toISOString(),
        content: dailyNote.content,
    }
})
