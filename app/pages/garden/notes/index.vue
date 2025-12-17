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
    { label: 'All', value: 'all', count: notes.value?.length || 0 },
    { label: 'Seedlings', value: 'SEEDLING', icon: '🌱' },
    { label: 'Budding', value: 'BUDDING', icon: '🌿' },
    { label: 'Evergreen', value: 'EVERGREEN', icon: '🌳' },
]

watch(filter, () => refresh())
</script>

<template>
    <div class="animate-fade-in">
        <!-- Header -->
        <div class="flex items-end justify-between mb-10">
            <div>
                <h1 class="font-heading text-4xl text-main mb-2">Notes</h1>
                <p class="text-muted">
                    <span class="font-semibold text-main">{{ notes?.length || 0 }}</span> ideas growing in your garden
                </p>
            </div>
            <UButton to="/garden/notes/new" size="lg" class="font-heading font-semibold bg-accent hover:bg-accent-hover text-white">
                <UIcon name="i-heroicons-plus" class="mr-2" />
                New Note
            </UButton>
        </div>

        <!-- Filters -->
        <div class="flex gap-2 mb-8 pb-6 border-b border-DEFAULT">
            <button
                v-for="f in filters"
                :key="f.value"
                @click="filter = f.value"
                class="px-4 py-2 text-sm font-medium rounded-xl border transition-all flex items-center gap-2"
                :class="filter === f.value
                    ? 'bg-accent-light text-accent border-accent/30'
                    : 'bg-card text-muted border-DEFAULT hover:border-strong hover:text-main'">
                <span v-if="f.icon">{{ f.icon }}</span>
                {{ f.label }}
            </button>
        </div>

        <!-- Notes Grid -->
        <div class="grid gap-3">
            <NuxtLink
                v-for="(note, index) in notes"
                :key="note.id"
                :to="`/garden/notes/${note.id}`"
                class="flex items-center gap-4 p-5 rounded-xl border border-DEFAULT bg-card hover:border-accent/30 hover:shadow-md transition-all group animate-fade-in-up"
                :style="{ animationDelay: `${index * 30}ms` }">

                <!-- Growth Icon -->
                <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                     :class="{
                         'bg-seedling/10': note.growthStage === 'SEEDLING',
                         'bg-budding/10': note.growthStage === 'BUDDING',
                         'bg-evergreen/10': note.growthStage === 'EVERGREEN'
                     }">
                    {{ growthIcon(note.growthStage) }}
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                    <div class="font-heading text-lg text-main group-hover:text-accent transition-colors truncate mb-1">
                        {{ note.title }}
                    </div>
                    <div class="flex items-center gap-2 flex-wrap">
                        <span
                            v-for="tag in note.tags.slice(0, 3)"
                            :key="tag.id"
                            class="tag text-xs">
                            #{{ tag.name }}
                        </span>
                        <span v-if="note.linkCount" class="text-xs text-subtle flex items-center gap-1 ml-1">
                            <UIcon name="i-heroicons-link" class="size-3" />
                            {{ note.linkCount }} links
                        </span>
                    </div>
                </div>

                <!-- Date & Arrow -->
                <div class="flex items-center gap-4 shrink-0">
                    <span class="text-sm text-subtle">
                        {{ new Date(note.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
                    </span>
                    <UIcon name="i-heroicons-chevron-right" class="size-5 text-subtle group-hover:text-accent transition-colors" />
                </div>
            </NuxtLink>

            <!-- Empty State -->
            <div v-if="!notes?.length" class="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed border-DEFAULT">
                <div class="text-5xl mb-4">🌱</div>
                <h3 class="font-heading text-xl text-main mb-2">No notes yet</h3>
                <p class="text-muted mb-6">Start planting your first ideas</p>
                <UButton to="/garden/notes/new" class="bg-accent hover:bg-accent-hover text-white font-heading font-semibold">
                    Create Your First Note
                </UButton>
            </div>
        </div>
    </div>
</template>

<style scoped>
.bg-seedling\/10 {
    background-color: color-mix(in srgb, var(--color-seedling) 10%, transparent);
}
.bg-budding\/10 {
    background-color: color-mix(in srgb, var(--color-budding) 10%, transparent);
}
.bg-evergreen\/10 {
    background-color: color-mix(in srgb, var(--color-evergreen) 10%, transparent);
}
</style>
