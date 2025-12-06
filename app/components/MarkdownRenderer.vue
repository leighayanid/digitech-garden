<script setup lang="ts">
import { useMarkdown } from '~/composables/useMarkdown'

const props = defineProps<{
    content: string
}>()

const { render, renderSync, highlighter } = useMarkdown()
const renderedContent = ref('')

// Watch for content changes and highlighter readiness
watchEffect(async () => {
    // Initial sync render for fast load
    if (!renderedContent.value) {
        renderedContent.value = renderSync(props.content)
    }

    // Async render with highlight when ready
    if (highlighter.value) {
        renderedContent.value = await render(props.content)
    }
})

// Handle Wiki-link clicks
const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.classList.contains('wiki-link') || target.classList.contains('wiki-link-placeholder')) {
        const title = target.getAttribute('data-link') || target.innerText
        // Simple navigation - in real app would resolve ID
        // For now just navigate to search or let parent handle
    }
}
</script>

<template>
    <div class="prose prose-stone prose-lg max-w-none dark:prose-invert 
               prose-code:font-mono prose-code:bg-stone-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-stone-800 prose-code:before:content-none prose-code:after:content-none
               prose-headings:font-serif prose-headings:font-normal" v-html="renderedContent" @click="handleClick" />
</template>
