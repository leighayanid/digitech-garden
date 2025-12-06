import { streamText } from 'ai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createOpenAI } from '@ai-sdk/openai'

export default defineEventHandler(async (event) => {
    const { messages } = await readBody(event)

    // Initialize providers efficiently
    const anthropic = createAnthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
    })

    const openai = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })

    // Determine model based on available keys
    let model
    if (process.env.ANTHROPIC_API_KEY) {
        model = anthropic('claude-3-5-sonnet-latest')
    } else if (process.env.OPENAI_API_KEY) {
        model = openai('gpt-4o')
    } else {
        throw createError({
            statusCode: 500,
            statusMessage: 'Missing AI API keys',
            message: 'Please configure ANTHROPIC_API_KEY or OPENAI_API_KEY in your environment.'
        })
    }

    const result = streamText({
        model,
        messages,
    })

    return result.toDataStreamResponse()
})
