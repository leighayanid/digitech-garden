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

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: body.email },
    })

    if (existingUser) {
        throw createError({
            statusCode: 400,
            message: 'Email already registered',
        })
    }

    // Hash password
    const passwordHash = hash(body.password)

    // Create user
    const user = await prisma.user.create({
        data: {
            email: body.email,
            passwordHash,
            name: body.name || null,
        },
    })

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
