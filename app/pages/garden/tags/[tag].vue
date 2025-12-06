<script setup lang="ts">
definePageMeta({
    layout: 'garden',
    middleware: 'auth',
})

const route = useRoute()
const tag = route.params.tag as string

interface Note {
    id: string
    title: string
    growthStage: string
    updatedAt: string
}

const { data: notes } = await useFetch<Note[]>('/api/tags/' + encodeURIComponent(tag) + '/notes')

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
    <div class="max-w-3xl mx-auto">
        <div class="mb-8">
            <NuxtLink to="/garden/tags" class="text-sm text-muted hover:text-main transition-colors font-medium">
                ← All tags
            </NuxtLink>
        </div>

        <div class="mb-8 border-b border-soft pb-4 flex items-center gap-3">
            <h1 class="text-3xl font-serif text-main">
                #{{ tag }}
            </h1>
            <span class="px-3 py-1 bg-stone-100 rounded-full text-sm text-muted">
                {{ notes?.length || 0 }} notes
            </span>
        </div>

        <div class="grid gap-3">
            <NuxtLink v-for="note in notes" :key="note.id" :to="`/garden/notes/${note.id}`"
                class="flex items-center gap-4 p-4 rounded-xl border border-transparent bg-white hover:border-soft hover:shadow-sm transition-all group">
                <span class="text-xl">{{ growthIcon(note.growthStage) }}</span>
                <span
                    class="text-lg font-serif font-medium text-main group-hover:underline decoration-stone-300 decoration-1 underline-offset-4">{{
                    note.title }}</span>
            </NuxtLink>

            <div v-if="!notes?.length" class="text-center py-16 border-2 border-dashed border-stone-100 rounded-2xl">
                <p class="text-muted font-serif text-lg">No notes found with this tag.</p>
            </div>
        </div>
    </div>
</template>
