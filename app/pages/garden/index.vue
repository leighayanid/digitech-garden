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

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    })
}
</script>

<template>
    <div>
        <div class="mb-10">
            <h1 class="text-3xl font-serif text-main mb-2">
                Digitech Garden <span class="text-muted font-light">for Tech</span>
            </h1>
            <p class="text-muted text-lg font-light">
                Overview of your technical knowledge space
            </p>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-4 gap-6 mb-10">
            <div class="card-soft p-5 text-center">
                <div class="text-4xl font-serif text-main mb-1">
                    {{ stats?.totalNotes || 0 }}
                </div>
                <div class="text-sm text-muted uppercase tracking-wider font-medium">Notes</div>
            </div>
            <div class="card-soft p-5 text-center">
                <div class="text-4xl font-serif mb-1 growth-seedling">
                    {{ stats?.seedlings || 0 }}
                </div>
                <div class="text-sm text-muted uppercase tracking-wider font-medium">Seedlings</div>
            </div>
            <div class="card-soft p-5 text-center">
                <div class="text-4xl font-serif mb-1 growth-budding">
                    {{ stats?.budding || 0 }}
                </div>
                <div class="text-sm text-muted uppercase tracking-wider font-medium">Budding</div>
            </div>
            <div class="card-soft p-5 text-center">
                <div class="text-4xl font-serif mb-1 growth-evergreen">
                    {{ stats?.evergreen || 0 }}
                </div>
                <div class="text-sm text-muted uppercase tracking-wider font-medium">Evergreen</div>
            </div>
        </div>

        <!-- Quick actions -->
        <div class="flex gap-4 mb-10">
            <UButton to="/garden/notes/new" size="lg" color="neutral">
                + New Note
            </UButton>
            <UButton to="/garden/daily" size="lg" color="neutral" variant="outline">
                📅 Today's Note
            </UButton>
            <UButton to="/garden/random" size="lg" color="neutral" variant="ghost">
                🎲 Random
            </UButton>
        </div>

        <!-- Recent notes -->
        <div>
            <h2 class="text-xl font-serif text-main mb-4 border-b border-DEFAULT pb-2">
                Recent Activity
            </h2>
            <div class="space-y-3">
                <NuxtLink v-for="note in recentNotes" :key="note.id" :to="`/garden/notes/${note.id}`"
                    class="flex items-center justify-between p-4 rounded-2xl hover:bg-card hover:shadow-sm transition-all group bg-transparent border border-transparent hover:border-DEFAULT">
                    <div class="flex items-center gap-3">
                        <span class="text-lg">{{ growthIcon(note.growthStage) }}</span>
                        <span class="text-base font-medium text-muted group-hover:text-main transition-colors">
                            {{ note.title }}
                        </span>
                    </div>
                    <span class="text-sm text-subtle">
                        {{ formatDate(note.updatedAt) }}
                    </span>
                </NuxtLink>
                <p v-if="!recentNotes?.length" class="text-muted italic py-8 text-center">
                    No notes yet. Start planting ideas!
                </p>
            </div>
        </div>
    </div>
</template>
