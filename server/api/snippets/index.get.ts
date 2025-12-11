export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)
    const query = getQuery(event)
    const prisma = await import('../../prisma').then((r) => r.default)

    const snippets = await prisma.snippet.findMany({
        where: { userId: session.user.id },
        orderBy: { updatedAt: 'desc' },
    })

    return snippets
})
