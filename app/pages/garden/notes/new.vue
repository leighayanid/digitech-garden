<script setup lang="ts">
definePageMeta({
    layout: 'garden',
    middleware: 'auth',
})

const title = ref('')
const content = ref('')
const growthStage = ref('SEEDLING')
const tagInput = ref('')
const tags = ref<string[]>([])
const loading = ref(false)
const error = ref('')

const stages = [
    { label: '🌱 Seedling', value: 'SEEDLING' },
    { label: '🌿 Budding', value: 'BUDDING' },
    { label: '🌳 Evergreen', value: 'EVERGREEN' },
]

function addTag() {
    const tag = tagInput.value.trim().toLowerCase()
    if (tag && !tags.value.includes(tag)) {
        tags.value.push(tag)
    }
    tagInput.value = ''
}

function removeTag(tag: string) {
    tags.value = tags.value.filter(t => t !== tag)
}

async function handleCreate() {
    if (!title.value.trim()) {
        error.value = 'Title is required'
        return
    }

    loading.value = true
    error.value = ''

    try {
        const note = await $fetch('/api/notes', {
            method: 'POST',
            body: {
                title: title.value,
                content: content.value,
                growthStage: growthStage.value,
                tags: tags.value,
            },
        })
        navigateTo(`/garden/notes/${note.id}`)
    } catch (e: any) {
        error.value = e.data?.message || 'Failed to create note'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="max-w-3xl mx-auto">
        <div class="mb-6">
            <NuxtLink to="/garden/notes" class="text-sm text-muted hover:text-main transition-colors font-medium">
                ← Back to notes
            </NuxtLink>
        </div>

        <div class="mb-8 pb-4 border-b border-DEFAULT">
            <h1 class="text-3xl font-serif text-main">New Note</h1>
        </div>

        <form @submit.prevent="handleCreate" class="space-y-6">
            <!-- Title -->
            <div>
                <input v-model="title" type="text" placeholder="Note Title"
                    class="w-full text-3xl font-serif bg-transparent border-b border-DEFAULT focus:border-strong outline-none py-2 text-main placeholder:text-subtle transition-colors" />
            </div>

            <!-- Growth Stage -->
            <div class="flex gap-2">
                <button v-for="stage in stages" :key="stage.value" type="button" @click="growthStage = stage.value"
                    class="px-3 py-1.5 text-sm rounded-lg transition-all border" :class="growthStage === stage.value
                        ? 'bg-accent text-white border-accent'
                        : 'bg-card text-muted border-DEFAULT hover:border-strong hover:bg-hover'">
                    {{ stage.label }}
                </button>
            </div>

            <!-- Tags -->
            <div>
                <div class="flex flex-wrap gap-2 mb-3">
                    <span v-for="tag in tags" :key="tag"
                        class="text-sm px-2.5 py-1 rounded-full bg-hover border border-DEFAULT text-muted flex items-center gap-1.5">
                        #{{ tag }}
                        <button type="button" @click="removeTag(tag)"
                            class="hover:text-red-500 text-subtle transition-colors">×</button>
                    </span>
                </div>
                <input v-model="tagInput" @keydown.enter.prevent="addTag" @keydown.,="addTag" type="text"
                    placeholder="Add tags (press Enter)"
                    class="w-full text-sm bg-card border border-DEFAULT rounded-lg px-3 py-2 outline-none focus:bg-elevated focus:border-strong transition-all text-main placeholder:text-subtle" />
            </div>

            <!-- Content -->
            <div>
                <textarea v-model="content"
                    placeholder="Write your note in markdown... Use [[Note Title]] to link to other notes." rows="18"
                    class="w-full text-base bg-card border border-DEFAULT rounded-xl px-4 py-3 outline-none focus:border-strong resize-none font-mono leading-relaxed text-main placeholder:text-subtle" />
            </div>

            <p v-if="error" class="text-sm text-red-500 bg-red-50 p-2 rounded border border-red-100">
                {{ error }}
            </p>

            <div class="flex gap-3 pt-4 border-t border-DEFAULT">
                <UButton type="submit" size="md" color="neutral" :loading="loading">
                    Create Note
                </UButton>
                <UButton to="/garden/notes" size="md" color="neutral" variant="ghost">
                    Cancel
                </UButton>
            </div>
        </form>
    </div>
</template>
