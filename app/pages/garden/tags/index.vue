<script setup lang="ts">
definePageMeta({
    layout: 'garden',
    middleware: 'auth',
})

interface Tag {
    id: string
    name: string
    color: string
    noteCount: number
}

const { data: tags } = await useFetch<Tag[]>('/api/tags')
</script>

<template>
    <div class="max-w-4xl mx-auto">
        <div class="mb-8 border-b border-soft pb-4">
            <h1 class="text-3xl font-serif text-main">Tags</h1>
            <p class="text-muted font-light mt-1">Organize your thoughts by topic</p>
        </div>

        <div class="flex flex-wrap gap-3">
            <NuxtLink v-for="tag in tags" :key="tag.id" :to="`/garden/tags/${tag.name}`"
                class="px-4 py-3 rounded-xl border border-soft bg-white hover:border-stone-400 hover:shadow-sm transition-all group flex items-center gap-2">
                <span class="text-lg font-medium text-stone-700 group-hover:text-black">#{{ tag.name }}</span>
                <span
                    class="text-xs bg-stone-100 px-2 py-0.5 rounded-full text-stone-500 group-hover:bg-stone-200 transition-colors">
                    {{ tag.noteCount }}
                </span>
            </NuxtLink>
        </div>

        <div v-if="!tags?.length" class="text-center py-16 border-2 border-dashed border-stone-100 rounded-2xl">
            <p class="text-muted text-lg font-serif">No tags yet.</p>
            <p class="text-sm text-stone-500 mt-1">Add tags to your notes to start organizing.</p>
        </div>
    </div>
</template>
