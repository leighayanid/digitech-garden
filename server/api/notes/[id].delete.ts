import prisma from '../../prisma'

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
        where: { id, userId: session.user.id },
    })

    if (!note) {
        throw createError({
            statusCode: 404,
            message: 'Note not found',
        })
    }

    await prisma.note.delete({
        where: { id },
    })

    return { success: true }
})
