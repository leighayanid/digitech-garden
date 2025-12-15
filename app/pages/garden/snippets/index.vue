<script setup lang="ts">
definePageMeta({
    layout: 'garden',
    middleware: 'auth',
})

interface Snippet {
    id: string
    title: string
    language: string
    content: string
    tags: string | null
    updatedAt: string
}

const { data: snippets } = await useFetch<Snippet[]>('/api/snippets')

const languageColor = (lang: string) => {
    const colors: Record<string, string> = {
        typescript: 'bg-blue-100 text-blue-700',
        javascript: 'bg-yellow-100 text-yellow-700',
        vue: 'bg-green-100 text-green-700',
        python: 'bg-blue-100 text-blue-800',
        css: 'bg-pink-100 text-pink-700',
        html: 'bg-orange-100 text-orange-700',
        bash: 'bg-stone-200 text-stone-700',
    }
    return colors[lang.toLowerCase()] || 'bg-stone-100 text-stone-600'
}

const parseTags = (tags: string | null) => {
    if (!tags) return []
    try {
        return JSON.parse(tags)
    } catch {
        return tags.split(',').map(t => t.trim())
    }
}
</script>

<template>
    <div class="max-w-4xl mx-auto">
        <div class="flex items-end justify-between mb-8 border-b border-soft pb-4">
            <div>
                <h1 class="text-3xl font-serif text-main">
                    Code Snippets
                </h1>
                <p class="text-muted font-light mt-1">
                    Reusable blocks of code
                </p>
            </div>
            <UButton to="/garden/snippets/new" size="md" color="neutral">
                + New Snippet
            </UButton>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
            <NuxtLink v-for="snippet in snippets" :key="snippet.id" :to="`/garden/snippets/${snippet.id}`"
                class="block p-5 rounded-2xl border border-transparent bg-card hover:border-soft hover:shadow-sm transition-all group h-full flex flex-col">
                <div class="flex items-start justify-between mb-3">
                    <span class="text-xs px-2 py-1 rounded-md font-mono uppercase tracking-wide"
                        :class="languageColor(snippet.language)">
                        {{ snippet.language }}
                    </span>
                    <span class="text-xs text-muted font-light">
                        {{ new Date(snippet.updatedAt).toLocaleDateString() }}
                    </span>
                </div>

                <h2
                    class="text-xl font-serif font-medium text-main mb-2 group-hover:underline decoration-DEFAULT decoration-1 underline-offset-4">
                    {{ snippet.title }}
                </h2>

                <div class="flex-1 bg-hover rounded-lg p-3 mb-3 border border-soft overflow-hidden relative">
                    <div class="absolute inset-0 bg-gradient-to-b from-transparent to-body/90" />
                    <pre class="text-xs text-muted font-mono">{{ snippet.content.slice(0, 100) }}</pre>
                </div>

                <div class="flex flex-wrap gap-2 mt-auto">
                    <span v-for="tag in parseTags(snippet.tags).slice(0, 3)" :key="tag"
                        class="text-xs text-subtle bg-hover px-2 py-0.5 rounded-full border border-soft">
                        #{{ tag }}
                    </span>
                </div>
            </NuxtLink>

            <div v-if="!snippets?.length"
                class="col-span-full text-center py-16 border-2 border-dashed border-DEFAULT rounded-2xl bg-hover/50">
                <p class="text-muted mb-2 font-serif text-lg">Your snippet library is empty.</p>
                <NuxtLink to="/garden/snippets/new" class="text-main hover:underline font-medium">Create your first
                    snippet</NuxtLink>
            </div>
        </div>
    </div>
</template>
