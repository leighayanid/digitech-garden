import prisma from '#lib/prisma'

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event)

    if (!session?.user?.id) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const tagName = decodeURIComponent(getRouterParam(event, 'tag') || '')

    const tag = await prisma.tag.findUnique({
        where: {
            userId_name: {
                userId: session.user.id,
                name: tagName,
            }
        },
        include: {
            notes: {
                include: {
                    note: {
                        select: {
                            id: true,
                            title: true,
                            growthStage: true,
                            updatedAt: true,
                        }
                    }
                }
            }
        }
    })

    if (!tag) {
        return []
    }

    return tag.notes.map(nt => ({
        id: nt.note.id,
        title: nt.note.title,
        growthStage: nt.note.growthStage,
        updatedAt: nt.note.updatedAt.toISOString(),
    }))
})
