import prisma from '../../prisma'

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event)

    if (!session?.user?.id) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const body = await readBody(event)

    await prisma.user.update({
        where: { id: session.user.id },
        data: { name: body.name || null },
    })

    // Update session
    await setUserSession(event, {
        user: {
            ...session.user,
            name: body.name || null,
        },
    })

    return { success: true }
})
