export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const prisma = await import('#lib/prisma').then((r) => r.default)

    const snippet = await prisma.snippet.findFirst({
        where: { id, userId: session.user.id },
    })

    if (!snippet) {
        throw createError({ statusCode: 404, message: 'Snippet not found' })
    }

    const updated = await prisma.snippet.update({
        where: { id },
        data: {
            title: body.title,
            content: body.content,
            language: body.language,
            description: body.description,
            tags: body.tags ? (Array.isArray(body.tags) ? JSON.stringify(body.tags) : body.tags) : undefined,
        },
    })

    return updated
})
