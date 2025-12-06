<script setup lang="ts">
definePageMeta({
    layout: 'garden',
    middleware: 'auth',
})

const query = ref('')

interface SearchResult {
    id: string
    title: string
    growthStage: string
    snippet: string
}

const { data: results, pending } = await useFetch<SearchResult[]>('/api/search', {
    query: computed(() => ({ q: query.value })),
    watch: [query],
    immediate: false,
})

const growthIcon = (stage: string) => {
    switch (stage) {
        case 'SEEDLING': return '🌱'
        case 'BUDDING': return '🌿'
        case 'EVERGREEN': return '🌳'
        default: return '🌱'
    }
}
</script>

<template>
    <div class="max-w-2xl mx-auto">
        <div class="mb-8 border-b border-soft pb-4">
            <h1 class="text-3xl font-serif text-main">Search</h1>
            <p class="text-muted font-light mt-1">Find thoughts in your garden</p>
        </div>

        <div class="mb-8">
            <input v-model="query" type="text" placeholder="Type to search..." autofocus
                class="w-full text-xl bg-white border border-soft rounded-2xl px-5 py-4 outline-none focus:border-stone-400 focus:shadow-sm transition-all text-main placeholder-stone-400" />
        </div>

        <div class="space-y-4">
            <div v-if="pending" class="text-sm text-muted animate-pulse">Searching...</div>

            <NuxtLink v-for="result in results" :key="result.id" :to="`/garden/notes/${result.id}`"
                class="block p-5 rounded-2xl border border-transparent bg-white hover:border-soft hover:shadow-sm transition-all group">
                <div class="flex items-center gap-2 mb-1">
                    <span class="text-lg">{{ growthIcon(result.growthStage) }}</span>
                    <span
                        class="text-lg font-serif font-medium text-main group-hover:underline decoration-stone-300 decoration-1 underline-offset-4">
                        {{ result.title }}
                    </span>
                </div>
                <div class="text-sm text-muted leading-relaxed pl-7">
                    ...{{ result.snippet }}...
                </div>
            </NuxtLink>

            <div v-if="query && !pending && !results?.length"
                class="text-center py-12 border-2 border-dashed border-stone-100 rounded-2xl">
                <p class="text-muted">No results found for "{{ query }}"</p>
            </div>
        </div>
    </div>
</template>
