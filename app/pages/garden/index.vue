<script setup lang="ts">
definePageMeta({
    layout: 'garden',
    middleware: 'auth',
})

interface Note {
    id: string
    title: string
    growthStage: 'SEEDLING' | 'BUDDING' | 'EVERGREEN'
    updatedAt: string
}

interface Stats {
    totalNotes: number
    seedlings: number
    budding: number
    evergreen: number
    totalTags: number
}

const { data: stats } = await useFetch<Stats>('/api/notes/stats')
const { data: recentNotes } = await useFetch<Note[]>('/api/notes', {
    query: { limit: 5, orderBy: 'updatedAt' }
})

const growthIcon = (stage: string) => {
    switch (stage) {
        case 'SEEDLING': return '🌱'
        case 'BUDDING': return '🌿'
        case 'EVERGREEN': return '🌳'
        default: return '🌱'
    }
}

const growthClass = (stage: string) => {
    switch (stage) {
        case 'SEEDLING': return 'growth-seedling'
        case 'BUDDING': return 'growth-budding'
        case 'EVERGREEN': return 'growth-evergreen'
        default: return 'growth-seedling'
    }
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    })
}
</script>

<template>
    <div class="animate-fade-in">
        <!-- Header -->
        <div class="mb-12">
            <h1 class="font-heading text-4xl text-main mb-3">
                Your Garden
            </h1>
            <p class="text-lg text-muted">
                Watch your knowledge ecosystem flourish
            </p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <div class="stat-card group">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-2xl">📚</span>
                    <span class="text-xs text-subtle uppercase tracking-wider">Total</span>
                </div>
                <div class="stat-value">{{ stats?.totalNotes || 0 }}</div>
                <div class="stat-label">Notes</div>
            </div>

            <div class="stat-card group">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-2xl">🌱</span>
                    <span class="text-xs text-subtle uppercase tracking-wider">Stage 1</span>
                </div>
                <div class="stat-value growth-seedling">{{ stats?.seedlings || 0 }}</div>
                <div class="stat-label">Seedlings</div>
            </div>

            <div class="stat-card group">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-2xl">🌿</span>
                    <span class="text-xs text-subtle uppercase tracking-wider">Stage 2</span>
                </div>
                <div class="stat-value growth-budding">{{ stats?.budding || 0 }}</div>
                <div class="stat-label">Budding</div>
            </div>

            <div class="stat-card group">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-2xl">🌳</span>
                    <span class="text-xs text-subtle uppercase tracking-wider">Stage 3</span>
                </div>
                <div class="stat-value growth-evergreen">{{ stats?.evergreen || 0 }}</div>
                <div class="stat-label">Evergreen</div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="mb-12">
            <h2 class="font-heading text-xl text-main mb-4">Quick Actions</h2>
            <div class="flex flex-wrap gap-3">
                <UButton to="/garden/notes/new" size="lg" class="font-heading font-semibold bg-accent hover:bg-accent-hover text-white">
                    <UIcon name="i-heroicons-plus" class="mr-2" />
                    New Note
                </UButton>
                <UButton to="/garden/daily" size="lg" variant="outline" class="font-heading font-medium">
                    <UIcon name="i-heroicons-calendar" class="mr-2" />
                    Today's Note
                </UButton>
                <UButton to="/garden/random" size="lg" variant="ghost" class="font-heading font-medium">
                    <UIcon name="i-heroicons-sparkles" class="mr-2" />
                    Surprise Me
                </UButton>
            </div>
        </div>

        <!-- Recent Activity -->
        <div>
            <div class="flex items-center justify-between mb-6">
                <h2 class="font-heading text-xl text-main">Recent Activity</h2>
                <NuxtLink to="/garden/notes" class="text-sm text-accent font-medium hover:underline">
                    View all →
                </NuxtLink>
            </div>

            <div class="space-y-2">
                <NuxtLink
                    v-for="(note, index) in recentNotes"
                    :key="note.id"
                    :to="`/garden/notes/${note.id}`"
                    class="flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-DEFAULT hover:bg-card transition-all group animate-fade-in-up"
                    :style="{ animationDelay: `${index * 50}ms` }">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                             :class="{
                                 'bg-seedling/10': note.growthStage === 'SEEDLING',
                                 'bg-budding/10': note.growthStage === 'BUDDING',
                                 'bg-evergreen/10': note.growthStage === 'EVERGREEN'
                             }">
                            {{ growthIcon(note.growthStage) }}
                        </div>
                        <div>
                            <span class="font-medium text-main group-hover:text-accent transition-colors block">
                                {{ note.title }}
                            </span>
                            <span class="text-xs text-subtle capitalize">
                                {{ note.growthStage.toLowerCase() }}
                            </span>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="text-sm text-subtle">
                            {{ formatDate(note.updatedAt) }}
                        </span>
                        <UIcon name="i-heroicons-chevron-right" class="size-4 text-subtle group-hover:text-accent transition-colors" />
                    </div>
                </NuxtLink>

                <div v-if="!recentNotes?.length" class="text-center py-16 bg-muted/30 rounded-2xl">
                    <div class="text-4xl mb-4">🌱</div>
                    <p class="text-muted font-medium mb-2">Your garden is empty</p>
                    <p class="text-subtle text-sm mb-6">Start planting your first ideas</p>
                    <UButton to="/garden/notes/new" class="bg-accent hover:bg-accent-hover text-white font-heading font-semibold">
                        Plant Your First Note
                    </UButton>
                </div>
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
