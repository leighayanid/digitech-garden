import prisma from '../prisma'

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event)

    if (!session?.user?.id) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const notes = await prisma.note.findMany({
        where: { userId: session.user.id },
        include: {
            linksFrom: true,
            linksTo: true,
        },
    })

    const nodes = notes.map(note => ({
        id: note.id,
        title: note.title,
        growthStage: note.growthStage,
        linkCount: note.linksFrom.length + note.linksTo.length,
    }))

    const links: { source: string; target: string }[] = []

    for (const note of notes) {
        for (const link of note.linksFrom) {
            links.push({
                source: note.id,
                target: link.toNoteId,
            })
        }
    }

    return { nodes, links }
})
