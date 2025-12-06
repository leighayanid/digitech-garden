export interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
}

export interface UseChatOptions {
    api?: string
    initialMessages?: Message[]
}

export function useChat(options: UseChatOptions = {}) {
    const api = options.api || '/api/chat'
    const messages = ref<Message[]>(options.initialMessages || [])
    const input = ref('')
    const isLoading = ref(false)
    const error = ref<Error | null>(null)

    const handleSubmit = async (e?: Event) => {
        if (e) e.preventDefault()
        if (!input.value.trim() || isLoading.value) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.value.trim()
        }

        messages.value.push(userMessage)
        input.value = ''
        isLoading.value = true
        error.value = null

        try {
            const response = await fetch(api, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: messages.value })
            })

            if (!response.ok) throw new Error('Failed to send message')

            if (!response.body) return

            const reader = response.body.getReader()
            const decoder = new TextDecoder()

            // Create a placeholder for the assistant's message
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: ''
            }
            messages.value.push(assistantMessage)

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value, { stream: true })
                // Append chunk to the last message (which is the assistant's)
                messages.value[messages.value.length - 1].content += chunk
            }
        } catch (err: any) {
            error.value = err
            console.error('Chat error:', err)
        } finally {
            isLoading.value = false
        }
    }

    return {
        messages,
        input,
        handleSubmit,
        isLoading,
        error,
        handleInputChange: (e: Event) => {
            const target = e.target as HTMLInputElement
            input.value = target.value
        }
    }
}
