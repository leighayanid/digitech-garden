import { hash } from 'ohash'
import prisma from '../../prisma'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (!body.email || !body.password) {
        throw createError({
            statusCode: 400,
            message: 'Email and password are required',
        })
    }

    // Find user
    const user = await prisma.user.findUnique({
        where: { email: body.email },
    })

    if (!user) {
        throw createError({
            statusCode: 401,
            message: 'Invalid credentials',
        })
    }

    // Verify password
    const passwordHash = hash(body.password)
    if (passwordHash !== user.passwordHash) {
        throw createError({
            statusCode: 401,
            message: 'Invalid credentials',
        })
    }

    // Set session
    await setUserSession(event, {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
    })

    return { success: true }
})
