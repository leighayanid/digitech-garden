<script setup lang="ts">
definePageMeta({
    layout: 'garden',
    middleware: 'auth',
})

const filter = ref<string>('all')

interface Note {
    id: string
    title: string
    slug: string
    growthStage: 'SEEDLING' | 'BUDDING' | 'EVERGREEN'
    updatedAt: string
    tags: { id: string; name: string; color: string }[]
    linkCount: number
}

const { data: notes, refresh } = await useFetch<Note[]>('/api/notes', {
    query: computed(() => ({
        limit: 50,
        growthStage: filter.value !== 'all' ? filter.value : undefined,
    }))
})

const growthIcon = (stage: string) => {
    switch (stage) {
        case 'SEEDLING': return '🌱'
        case 'BUDDING': return '🌿'
        case 'EVERGREEN': return '🌳'
        default: return '🌱'
    }
}

const filters = [
    { label: 'All', value: 'all' },
    { label: '🌱 Seedlings', value: 'SEEDLING' },
    { label: '🌿 Budding', value: 'BUDDING' },
    { label: '🌳 Evergreen', value: 'EVERGREEN' },
]

watch(filter, () => refresh())
</script>

<template>
    <div class="max-w-4xl mx-auto">
        <div class="flex items-end justify-between mb-8 border-b border-soft pb-4">
            <div>
                <h1 class="text-3xl font-serif text-main">
                    All Notes
                </h1>
                <p class="text-muted font-light mt-1">
                    {{ notes?.length || 0 }} notes in your garden
                </p>
            </div>
            <UButton to="/garden/notes/new" size="md" color="neutral">
                + Plant Note
            </UButton>
        </div>

        <!-- Filters -->
        <div class="flex gap-2 mb-8">
            <button v-for="f in filters" :key="f.value" @click="filter = f.value"
                class="px-3 py-1.5 text-sm rounded-lg border transition-all" :class="filter === f.value
                    ? 'bg-elevated text-main border-strong'
                    : 'bg-card text-muted border-soft hover:border-DEFAULT'">
                {{ f.label }}
            </button>
        </div>

        <!-- Notes list -->
        <div class="grid gap-3">
            <NuxtLink v-for="note in notes" :key="note.id" :to="`/garden/notes/${note.id}`"
                class="flex items-center gap-4 p-4 rounded-xl border border-transparent bg-card hover:border-soft hover:shadow-sm transition-all group">
                <span class="text-xl">{{ growthIcon(note.growthStage) }}</span>
                <div class="flex-1 min-w-0">
                    <div class="text-lg font-serif text-main group-hover:text-accent transition-colors truncate">
                        {{ note.title }}
                    </div>
                    <div class="flex items-center gap-3 mt-1">
                        <span v-for="tag in note.tags.slice(0, 3)" :key="tag.id"
                            class="text-xs px-2 py-0.5 rounded-full bg-hover text-subtle">
                            #{{ tag.name }}
                        </span>
                        <span v-if="note.linkCount" class="text-xs text-muted flex items-center gap-1">
                            <UIcon name="i-heroicons-link" class="size-3" />
                            {{ note.linkCount }}
                        </span>
                    </div>
                </div>
                <div class="text-xs text-muted font-light">
                    {{ new Date(note.updatedAt).toLocaleDateString() }}
                </div>
            </NuxtLink>

            <div v-if="!notes?.length"
                class="text-center py-16 border-2 border-dashed border-DEFAULT rounded-2xl bg-hover/50">
                <p class="text-muted mb-2 font-serif text-lg">Your garden is empty.</p>
                <NuxtLink to="/garden/notes/new" class="text-main hover:underline font-medium">Create your first note
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
