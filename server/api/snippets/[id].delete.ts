export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    const id = getRouterParam(event, 'id')
    const prisma = await import('#lib/prisma').then((r) => r.default)

    const snippet = await prisma.snippet.findFirst({
        where: { id, userId: session.user.id },
    })

    if (!snippet) {
        throw createError({ statusCode: 404, message: 'Snippet not found' })
    }

    await prisma.snippet.delete({
        where: { id },
    })

    return { success: true }
})
