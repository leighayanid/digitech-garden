<script setup lang="ts">
definePageMeta({
    layout: 'garden',
    middleware: 'auth',
})

const route = useRoute()
const id = route.params.id as string

interface NoteData {
    id: string
    title: string
    content: string
    slug: string
    growthStage: 'SEEDLING' | 'BUDDING' | 'EVERGREEN'
    createdAt: string
    updatedAt: string
    tags: { id: string; name: string; color: string }[]
    linksTo: { id: string; title: string; slug: string; growthStage: string }[]
    backlinks: { id: string; title: string; slug: string; growthStage: string }[]
}

const { data: note, refresh } = await useFetch<NoteData>(`/api/notes/${id}`)

const isEditing = ref(false)
const editTitle = ref('')
const editContent = ref('')
const editGrowthStage = ref('')
const editTags = ref<string[]>([])
const tagInput = ref('')
const loading = ref(false)

function startEdit() {
    if (!note.value) return
    editTitle.value = note.value.title
    editContent.value = note.value.content
    editGrowthStage.value = note.value.growthStage
    editTags.value = note.value.tags.map(t => t.name)
    isEditing.value = true
}

function cancelEdit() {
    isEditing.value = false
}

function addTag() {
    const tag = tagInput.value.trim().toLowerCase()
    if (tag && !editTags.value.includes(tag)) {
        editTags.value.push(tag)
    }
    tagInput.value = ''
}

function removeTag(tag: string) {
    editTags.value = editTags.value.filter(t => t !== tag)
}

async function saveEdit() {
    loading.value = true
    try {
        await $fetch(`/api/notes/${id}`, {
            method: 'PUT',
            body: {
                title: editTitle.value,
                content: editContent.value,
                growthStage: editGrowthStage.value,
                tags: editTags.value,
            },
        })
        await refresh()
        isEditing.value = false
    } finally {
        loading.value = false
    }
}

async function deleteNote() {
    if (!confirm('Delete this note?')) return
    await $fetch(`/api/notes/${id}`, { method: 'DELETE' })
    navigateTo('/garden/notes')
}

const stages = [
    { label: '🌱 Seedling', value: 'SEEDLING' },
    { label: '🌿 Budding', value: 'BUDDING' },
    { label: '🌳 Evergreen', value: 'EVERGREEN' },
]

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
    <div class="max-w-3xl mx-auto"> <!-- Centered, constrained width -->
        <div class="mb-6">
            <NuxtLink to="/garden/notes" class="text-sm text-muted hover:text-main transition-colors font-medium">
                ← Back to notes
            </NuxtLink>
        </div>

        <template v-if="note">
            <!-- View Mode -->
            <template v-if="!isEditing">
                <div class="mb-8 border-b border-soft pb-6">
                    <div class="flex items-start justify-between mb-4">
                        <div>
                            <div class="flex items-center gap-3 mb-2">
                                <span class="text-2xl">{{ growthIcon(note.growthStage) }}</span>
                                <h1 class="text-3xl font-serif text-main leading-tight">
                                    {{ note.title }}
                                </h1>
                            </div>
                            <div class="flex items-center gap-3 text-sm text-muted">
                                <span>Updated {{ new Date(note.updatedAt).toLocaleDateString() }}</span>
                                <span v-for="tag in note.tags" :key="tag.id"
                                    class="px-2 py-0.5 bg-hover rounded-full text-muted border border-DEFAULT">
                                    #{{ tag.name }}
                                </span>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <UButton size="sm" color="neutral" variant="ghost" @click="startEdit">
                                Edit
                            </UButton>
                            <UButton size="sm" color="red" variant="ghost" @click="deleteNote">
                                Delete
                            </UButton>
                        </div>
                    </div>
                </div>

                <MarkdownRenderer :content="note.content" class="mb-12" />

                <!-- Backlinks -->
                <div v-if="note.backlinks.length" class="mt-12 p-6 bg-hover rounded-2xl border border-soft">
                    <h2 class="text-sm font-medium text-muted uppercase tracking-wider mb-4">Linked from</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <NuxtLink v-for="link in note.backlinks" :key="link.id" :to="`/garden/notes/${link.id}`"
                            class="flex items-center gap-3 p-3 bg-card rounded-xl border border-transparent hover:border-soft hover:shadow-sm transition-all text-muted hover:text-main">
                            <span class="text-lg">{{ growthIcon(link.growthStage) }}</span>
                            <span class="font-medium font-serif">{{ link.title }}</span>
                        </NuxtLink>
                    </div>
                </div>
            </template>

            <!-- Edit Mode -->
            <template v-else>
                <form @submit.prevent="saveEdit" class="space-y-6">
                    <div>
                        <input v-model="editTitle" type="text"
                            class="w-full text-3xl font-serif bg-transparent border-b border-soft focus:border-accent outline-none py-2 text-main placeholder-stone-300 transition-colors"
                            placeholder="Note Title" />
                    </div>

                    <div class="flex gap-2">
                        <button v-for="stage in stages" :key="stage.value" type="button"
                            @click="editGrowthStage = stage.value"
                            class="px-3 py-1.5 text-sm rounded-lg transition-all border" :class="editGrowthStage === stage.value
                                ? 'bg-elevated text-main border-strong'
                                : 'bg-card text-muted border-soft hover:border-strong'">
                            {{ stage.label }}
                        </button>
                    </div>

                    <div>
                        <div class="flex flex-wrap gap-2 mb-3">
                            <span v-for="tag in editTags" :key="tag"
                                class="text-sm px-2.5 py-1 rounded-full bg-hover border border-DEFAULT text-muted flex items-center gap-1.5">
                                #{{ tag }}
                                <button type="button" @click="removeTag(tag)"
                                    class="hover:text-red-500 text-subtle transition-colors">×</button>
                            </span>
                        </div>
                        <input v-model="tagInput" @keydown.enter.prevent="addTag" type="text"
                            placeholder="Add tags + Enter"
                            class="w-full text-sm bg-hover border border-soft rounded-lg px-3 py-2 outline-none focus:bg-card focus:border-accent transition-all text-main placeholder-subtle" />
                    </div>

                    <textarea v-model="editContent" rows="18"
                        class="w-full text-base bg-card border border-soft rounded-xl px-4 py-3 outline-none focus:border-accent resize-none font-mono leading-relaxed text-main placeholder-subtle"
                        placeholder="Start writing..." />

                    <div class="flex gap-3 pt-4 border-t border-soft">
                        <UButton type="submit" size="md" color="neutral" :loading="loading">
                            Save Changes
                        </UButton>
                        <UButton type="button" size="md" color="neutral" variant="ghost" @click="cancelEdit">
                            Cancel
                        </UButton>
                    </div>
                </form>
            </template>
        </template>
    </div>
</template>
