import prisma from '../../prisma'

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event)

    if (!session?.user?.id) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const count = await prisma.note.count({
        where: { userId: session.user.id },
    })

    if (count === 0) {
        return { id: null }
    }

    const skip = Math.floor(Math.random() * count)

    const note = await prisma.note.findFirst({
        where: { userId: session.user.id },
        skip,
        select: { id: true },
    })

    return { id: note?.id || null }
})
