<script setup lang="ts">
definePageMeta({
    layout: 'garden',
    middleware: 'auth',
})

const title = ref('')
const language = ref('typescript')
const content = ref('')
const tags = ref<string[]>([])
const tagInput = ref('')
const loading = ref(false)

const languages = [
    'typescript', 'javascript', 'vue', 'python', 'html', 'css', 'bash', 'json', 'sql', 'markdown'
]

function addTag() {
    const val = tagInput.value.trim().toLowerCase()
    if (val && !tags.value.includes(val)) {
        tags.value.push(val)
    }
    tagInput.value = ''
}

function removeTag(t: string) {
    tags.value = tags.value.filter(tag => tag !== t)
}

async function handleSave() {
    if (!title.value || !content.value) return

    loading.value = true
    try {
        const snippet = await $fetch('/api/snippets', {
            method: 'POST',
            body: {
                title: title.value,
                language: language.value,
                content: content.value,
                tags: tags.value,
            }
        })
        navigateTo(`/garden/snippets/${snippet.id}`)
    } catch (e) {
        alert('Failed to save snippet')
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="max-w-3xl mx-auto">
        <div class="mb-6">
            <NuxtLink to="/garden/snippets" class="text-sm text-muted hover:text-main transition-colors font-medium">
                ← Back to snippets
            </NuxtLink>
        </div>

        <div class="mb-8 pb-4 border-b border-DEFAULT">
            <h1 class="text-3xl font-serif text-main">New Snippet</h1>
        </div>

        <form @submit.prevent="handleSave" class="space-y-6">
            <div class="grid gap-6 md:grid-cols-3">
                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-muted mb-1">Title</label>
                    <input v-model="title" type="text" placeholder="Snippet Title"
                        class="w-full text-lg bg-card border border-DEFAULT rounded-xl px-4 py-2 outline-none focus:border-strong focus:shadow-sm text-main placeholder:text-subtle transition-all" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-muted mb-1">Language</label>
                    <USelect v-model="language" :options="languages" size="lg"
                        :ui="{ rounded: 'rounded-xl', base: 'bg-card border-DEFAULT' }" />
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-muted mb-1">Content</label>
                <textarea v-model="content" rows="12"
                    class="w-full text-sm font-mono bg-elevated dark:bg-card text-main border border-DEFAULT rounded-xl px-4 py-3 outline-none focus:border-strong resize-none leading-relaxed"
                    placeholder="// Paste your code here..." />
            </div>

            <div>
                <label class="block text-sm font-medium text-muted mb-1">Tags</label>
                <div class="flex flex-wrap gap-2 mb-2 p-2 bg-card border border-DEFAULT rounded-xl min-h-[42px]">
                    <span v-for="tag in tags" :key="tag"
                        class="text-sm px-2 py-0.5 rounded-full bg-hover border border-DEFAULT text-muted flex items-center gap-1.5">
                        #{{ tag }}
                        <button type="button" @click="removeTag(tag)"
                            class="hover:text-red-500 text-subtle transition-colors">×</button>
                    </span>
                    <input v-model="tagInput" @keydown.enter.prevent="addTag" @keydown.,.prevent="addTag" type="text"
                        placeholder="Add tag..." class="flex-1 bg-transparent outline-none text-sm min-w-[80px] text-main placeholder:text-subtle" />
                </div>
            </div>

            <div class="flex gap-3 pt-4">
                <UButton type="submit" size="md" color="neutral" :loading="loading">
                    Save Snippet
                </UButton>
                <UButton to="/garden/snippets" size="md" color="neutral" variant="ghost">
                    Cancel
                </UButton>
            </div>
        </form>
    </div>
</template>
