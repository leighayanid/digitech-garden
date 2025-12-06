<script setup lang="ts">

import { format } from 'date-fns'

definePageMeta({
  layout: 'garden',
  middleware: 'auth',
})

const { messages, input, handleSubmit, isLoading } = useChat({
  api: '/api/ai/chat',
  initialMessages: [
    { id: 'welcome', role: 'assistant', content: 'Hello! I am your AI assistant. How can I help you cultivate your digital garden today?' }
  ]
})

const chatContainer = ref<HTMLElement | null>(null)
const savingSeed = ref<number | null>(null)

// Auto-scroll to bottom when messages change
watch(messages, () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}, { deep: true })

// Manual submit wrapper for the textarea enter key
const onEnter = (e: KeyboardEvent) => {
  if (e.isComposing) return
  // Prevent default new line, submit the form
  handleSubmit(e)
}

const toast = useToast()

const saveToSeeds = async (content: string, index: number) => {
    if (savingSeed.value !== null) return
    savingSeed.value = index

    try {
        const title = `AI Chat Insight - ${format(new Date(), 'MMM d, h:mm a')}`
        await $fetch('/api/notes', {
            method: 'POST',
            body: {
                title,
                content,
                growthStage: 'SEEDLING'
            }
        })
        toast.add({
            title: 'Planted as Seed',
            description: 'This insight has been saved to your garden seeds.',
            icon: 'i-heroicons-check-circle',
            color: 'success'
        })
    } catch (e) {
        toast.add({
            title: 'Failed to plant',
            description: 'Could not save this message.',
            icon: 'i-heroicons-exclamation-circle',
            color: 'error'
        })
    } finally {
        savingSeed.value = null
    }
}
</script>

<template>
  <div class="flex flex-col h-[calc(100vh-4rem)] -mt-4 -mx-4 md:-mx-8">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-DEFAULT bg-card/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
      <div class="flex items-center gap-3">
        <div class="p-2 rounded-lg bg-hover text-muted">
          <UIcon name="i-heroicons-sparkles" class="w-5 h-5" />
        </div>
        <div>
          <h1 class="font-serif text-lg text-main">Garden Assistant</h1>
          <p class="text-xs text-subtle">Powered by Digitech Garden AI</p>
        </div>
      </div>
    </div>

    <!-- Chat Area -->
    <div ref="chatContainer" class="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
      <div v-for="(msg, idx) in messages" :key="msg.id" 
           :class="['flex gap-4 max-w-3xl mx-auto group', msg.role === 'user' ? 'justify-end' : 'justify-start']">
        
        <!-- AI Avatar -->
        <div v-if="msg.role === 'assistant'" class="flex-shrink-0 w-8 h-8 rounded-full bg-hover flex items-center justify-center border border-DEFAULT">
          <UIcon name="i-heroicons-cpu-chip" class="w-4 h-4 text-muted" />
        </div>

        <!-- Message Bubble -->
        <div class="relative max-w-[80%]">
             <div :class="[
            'px-5 py-3 rounded-2xl shadow-sm text-sm leading-relaxed',
            msg.role === 'user'
                ? 'bg-accent text-white rounded-tr-none'
                : 'bg-card border border-DEFAULT text-main rounded-tl-none'
            ]">
            <p class="whitespace-pre-wrap">{{ msg.content }}</p>
            </div>

            <!-- Action Buttons for AI Messages -->
            <div v-if="msg.role === 'assistant'" class="absolute -bottom-6 left-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 pt-1">
                <UButton
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    icon="i-heroicons-bookmark"
                    class="hover:bg-hover text-subtle hover:text-muted"
                    :loading="savingSeed === idx"
                    @click="saveToSeeds(msg.content, idx)"
                >
                    Plant as Seed
                </UButton>
            </div>
        </div>

        <!-- User Avatar -->
        <div v-if="msg.role === 'user'" class="flex-shrink-0 w-8 h-8 rounded-full bg-hover flex items-center justify-center border border-DEFAULT">
          <UIcon name="i-heroicons-user" class="w-4 h-4 text-muted" />
        </div>
      </div>

      <!-- Loading Indicator -->
      <div v-if="isLoading && messages[messages.length - 1]?.role === 'user'" class="flex gap-4 max-w-3xl mx-auto justify-start">
        <div class="flex-shrink-0 w-8 h-8 rounded-full bg-hover flex items-center justify-center border border-DEFAULT">
          <UIcon name="i-heroicons-cpu-chip" class="w-4 h-4 text-muted" />
        </div>
        <div class="px-5 py-3 rounded-2xl bg-card border border-DEFAULT rounded-tl-none shadow-sm flex items-center gap-1">
          <div class="w-2 h-2 bg-subtle rounded-full animate-bounce" style="animation-delay: 0ms"></div>
          <div class="w-2 h-2 bg-subtle rounded-full animate-bounce" style="animation-delay: 150ms"></div>
          <div class="w-2 h-2 bg-subtle rounded-full animate-bounce" style="animation-delay: 300ms"></div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="p-4 border-t border-DEFAULT bg-card/80 backdrop-blur-md">
      <form @submit="handleSubmit" class="max-w-3xl mx-auto relative">
        <textarea
          v-model="input"
          @keydown.enter.prevent="onEnter"
          placeholder="Ask me anything about your garden..."
          class="w-full pl-4 pr-12 py-3 bg-card border border-DEFAULT rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-strong resize-none shadow-sm text-sm text-main placeholder:text-subtle"
          rows="1"
          style="min-height: 48px; max-height: 120px;"
        ></textarea>
        <button
          type="submit"
          :disabled="!input.trim() || isLoading"
          class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-subtle hover:text-muted hover:bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <UIcon name="i-heroicons-paper-airplane" class="w-5 h-5" />
        </button>
      </form>
      <div class="text-center mt-2">
        <p class="text-[10px] text-subtle">AI can make mistakes. Please verify important information.</p>
      </div>
    </div>
  </div>
</template>
