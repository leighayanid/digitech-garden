import prisma from '#lib/prisma'

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event)

    if (!session?.user?.id) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const query = getQuery(event)
    const q = (query.q as string || '').trim()

    if (!q) {
        return []
    }

    const notes = await prisma.note.findMany({
        where: {
            userId: session.user.id,
            OR: [
                { title: { contains: q } },
                { content: { contains: q } },
            ],
        },
        take: 20,
        orderBy: { updatedAt: 'desc' },
    })

    return notes.map(note => {
        // Create snippet from content
        let snippet = ''
        const lowerContent = note.content.toLowerCase()
        const lowerQuery = q.toLowerCase()
        const index = lowerContent.indexOf(lowerQuery)

        if (index !== -1) {
            const start = Math.max(0, index - 30)
            const end = Math.min(note.content.length, index + q.length + 50)
            snippet = (start > 0 ? '...' : '') + note.content.slice(start, end) + (end < note.content.length ? '...' : '')
        } else {
            snippet = note.content.slice(0, 80) + (note.content.length > 80 ? '...' : '')
        }

        return {
            id: note.id,
            title: note.title,
            growthStage: note.growthStage,
            snippet,
        }
    })
})
