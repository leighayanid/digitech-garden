<script setup lang="ts">
definePageMeta({
    layout: 'garden',
    middleware: 'auth',
})

const route = useRoute()
const dateParam = route.params.date as string | undefined

// Get today's date or parse from route
const today = new Date()
const currentDate = computed(() => {
    if (dateParam) {
        return new Date(dateParam)
    }
    return today
})

const dateKey = computed(() => currentDate.value.toISOString().split('T')[0])

interface DailyNoteData {
    id: string
    date: string
    content: string
}

const { data: dailyNote, refresh } = await useFetch<DailyNoteData>(`/api/daily/${dateKey.value}`)

const content = ref('')
const saving = ref(false)

watch(dailyNote, (note) => {
    if (note) {
        content.value = note.content
    }
}, { immediate: true })

async function saveNote() {
    saving.value = true
    try {
        await $fetch(`/api/daily/${dateKey.value}`, {
            method: 'PUT',
            body: { content: content.value },
        })
        await refresh()
    } finally {
        saving.value = false
    }
}

// Debounced auto-save
let saveTimeout: NodeJS.Timeout
function debouncedSave() {
    clearTimeout(saveTimeout)
    saveTimeout = setTimeout(saveNote, 1000)
}

const formatDate = computed(() => {
    return currentDate.value.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
})

function goToPreviousDay() {
    const prev = new Date(currentDate.value)
    prev.setDate(prev.getDate() - 1)
    navigateTo(`/garden/daily/${prev.toISOString().split('T')[0]}`)
}

function goToNextDay() {
    const next = new Date(currentDate.value)
    next.setDate(next.getDate() + 1)
    navigateTo(`/garden/daily/${next.toISOString().split('T')[0]}`)
}

function goToToday() {
    navigateTo('/garden/daily')
}
</script>

<template>
    <div class="max-w-2xl">
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
                <button @click="goToPreviousDay" class="p-1 hover:bg-hover rounded text-muted hover:text-main">
                    ←
                </button>
                <h1 class="text-sm font-medium text-main">
                    {{ formatDate }}
                </h1>
                <button @click="goToNextDay" class="p-1 hover:bg-hover rounded text-muted hover:text-main">
                    →
                </button>
            </div>
            <div class="flex gap-2">
                <UButton v-if="dateParam" size="xs" color="neutral" variant="ghost" @click="goToToday">
                    Today
                </UButton>
                <span v-if="saving" class="text-xs text-subtle">Saving...</span>
            </div>
        </div>

        <textarea v-model="content" @input="debouncedSave"
            placeholder="What's on your mind today? Use [[Note Title]] to link to notes..." rows="20"
            class="w-full text-sm bg-transparent border border-soft rounded px-3 py-2 outline-none focus:border-accent resize-none font-mono text-main placeholder:text-subtle" />
    </div>
</template>
