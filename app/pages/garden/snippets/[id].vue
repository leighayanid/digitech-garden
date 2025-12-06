<script setup lang="ts">
import { useMarkdown } from '~/composables/useMarkdown'

definePageMeta({
    layout: 'garden',
    middleware: 'auth',
})

const route = useRoute()
const id = route.params.id as string
const { data: snippet, refresh } = await useFetch<any>(`/api/snippets/${id}`)

const { highlighter } = useMarkdown()
const renderedCode = ref('')

watchEffect(async () => {
    if (snippet.value && highlighter.value) {
        renderedCode.value = highlighter.value.codeToHtml(snippet.value.content, {
            lang: snippet.value.language,
            themes: {
                light: 'github-light',
                dark: 'github-dark',
            }
        })
    } else if (snippet.value) {
        // Fallback or simple pre while loading
        renderedCode.value = `<pre><code>${snippet.value.content}</code></pre>`
    }
})

const isEditing = ref(false)
const editTitle = ref('')
const editContent = ref('')
const editTags = ref<string[]>([]) // Simplified for now, can implement edit later properly
// Actually let's just support delete for now to keep it simple, or full edit mode similar to new.vue
// I'll implement full edit mode.

const editLanguage = ref('')
const loading = ref(false)

function startEdit() {
    editTitle.value = snippet.value.title
    editContent.value = snippet.value.content
    editLanguage.value = snippet.value.language
    try {
        editTags.value = JSON.parse(snippet.value.tags || '[]')
    } catch {
        editTags.value = []
    }
    isEditing.value = true
}

async function saveEdit() {
    loading.value = true
    try {
        await $fetch(`/api/snippets/${id}`, {
            method: 'PUT',
            body: {
                title: editTitle.value,
                content: editContent.value,
                language: editLanguage.value,
                tags: editTags.value
            }
        })
        await refresh()
        isEditing.value = false
    } finally {
        loading.value = false
    }
}

async function handleDelete() {
    if (!confirm('Delete this snippet?')) return
    await $fetch(`/api/snippets/${id}`, { method: 'DELETE' })
    navigateTo('/garden/snippets')
}

const copyToClipboard = () => {
    navigator.clipboard.writeText(snippet.value.content)
    alert('Copied!')
}

const parseTags = (tags: string | null) => {
    if (!tags) return []
    try { return JSON.parse(tags) } catch { return [] }
}
</script>

<template>
    <div class="max-w-3xl mx-auto">
        <div class="mb-6">
            <NuxtLink to="/garden/snippets" class="text-sm text-muted hover:text-main transition-colors font-medium">
                ← Back to snippets
            </NuxtLink>
        </div>

        <template v-if="snippet">
            <div v-if="!isEditing">
                <div class="flex items-start justify-between mb-6 pb-6 border-b border-soft">
                    <div>
                        <div class="flex items-center gap-3 mb-2">
                            <h1 class="text-3xl font-serif text-main">{{ snippet.title }}</h1>
                            <span
                                class="text-xs px-2 py-1 bg-stone-100 rounded-md font-mono uppercase text-stone-600 border border-stone-200">
                                {{ snippet.language }}
                            </span>
                        </div>
                        <div class="flex gap-2">
                            <span v-for="tag in parseTags(snippet.tags)" :key="tag" class="text-xs text-stone-500">
                                #{{ tag }}
                            </span>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <UButton size="sm" color="neutral" variant="ghost" icon="i-heroicons-clipboard"
                            @click="copyToClipboard">
                            Copy
                        </UButton>
                        <UButton size="sm" color="neutral" variant="ghost" @click="startEdit">
                            Edit
                        </UButton>
                        <UButton size="sm" color="red" variant="ghost" @click="handleDelete">
                            Delete
                        </UButton>
                    </div>
                </div>

                <div class="bg-white rounded-xl border border-soft overflow-hidden">
                    <div class="bg-stone-50 px-4 py-2 border-b border-stone-100 flex justify-between items-center">
                        <span class="text-xs font-mono text-muted">{{ snippet.language }}</span>
                    </div>
                    <div class="p-6 overflow-x-auto text-sm" v-html="renderedCode"></div>
                </div>
            </div>

            <!-- Edit Mode -->
            <form v-else @submit.prevent="saveEdit" class="space-y-6">
                <input v-model="editTitle"
                    class="w-full text-3xl font-serif border-b border-soft bg-transparent outline-none py-2 text-main placeholder-stone-400" />
                <textarea v-model="editContent" rows="15"
                    class="w-full font-mono bg-stone-900 text-stone-100 rounded-xl p-4 text-sm resize-none placeholder-stone-500" />
                <div class="flex gap-3">
                    <UButton type="submit" :loading="loading" color="neutral">Save Changes</UButton>
                    <UButton variant="ghost" color="neutral" @click="isEditing = false">Cancel</UButton>
                </div>
            </form>
        </template>
    </div>
</template>
