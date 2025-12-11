export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    const body = await readBody(event)
    const prisma = await import('../../prisma').then((r) => r.default)

    if (!body.title || !body.content || !body.language) {
        throw createError({
            statusCode: 400,
            message: 'Title, content, and language are required',
        })
    }

    const snippet = await prisma.snippet.create({
        data: {
            userId: session.user.id,
            title: body.title,
            content: body.content,
            language: body.language,
            description: body.description,
            tags: body.tags ? (Array.isArray(body.tags) ? JSON.stringify(body.tags) : body.tags) : null,
        },
    })

    return snippet
})
