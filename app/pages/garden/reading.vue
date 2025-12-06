<script setup lang="ts">
definePageMeta({
    layout: 'garden',
    middleware: 'auth',
})

interface ReadingItem {
    id: string
    url: string
    title?: string
    note?: string
    read: boolean
    createdAt: string
}

const { data: items, refresh } = await useFetch<ReadingItem[]>('/api/reading')

const activeItems = computed(() => items.value?.filter(i => !i.read) || [])
const readItems = computed(() => items.value?.filter(i => i.read) || [])

const url = ref('')
const title = ref('')
const note = ref('')
const saving = ref(false)

async function addItem() {
    if (!url.value) return

    saving.value = true
    try {
        await $fetch('/api/reading', {
            method: 'POST',
            body: {
                url: url.value,
                title: title.value || undefined,
                note: note.value || undefined,
            },
        })
        url.value = ''
        title.value = ''
        note.value = ''
        refresh()
    } catch (e) {
        console.error(e)
    } finally {
        saving.value = false
    }
}

async function toggleRead(item: ReadingItem) {
    await $fetch(`/api/reading/${item.id}`, {
        method: 'PUT',
        body: {
            read: !item.read,
        },
    })
    refresh()
}

async function deleteItem(id: string) {
    if (!confirm('Remove this item?')) return

    await $fetch(`/api/reading/${id}`, {
        method: 'DELETE',
    })
    refresh()
}
</script>

<template>
    <div class="max-w-3xl mx-auto">
        <div class="mb-8 border-b border-soft pb-4">
            <h1 class="text-3xl font-serif text-main">Reading List</h1>
            <p class="text-lg text-muted font-light mt-1">Articles and links to read later.</p>
        </div>

        <!-- Add Item Form -->
        <div class="card-soft p-6 mb-10 bg-white">
            <form @submit.prevent="addItem" class="space-y-4">
                <div class="flex flex-col gap-4">
                    <UInput v-model="url" type="url" placeholder="https://example.com/article" icon="i-heroicons-link"
                        size="md" required class="w-full"
                        :ui="{ rounded: 'rounded-xl', base: 'bg-stone-50 border-soft' }" />
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <UInput v-model="title" placeholder="Title (optional)" size="md"
                            :ui="{ rounded: 'rounded-xl', base: 'bg-stone-50 border-soft' }" />
                        <UInput v-model="note" placeholder="Note (optional)" size="md"
                            :ui="{ rounded: 'rounded-xl', base: 'bg-stone-50 border-soft' }" />
                    </div>
                </div>
                <div class="flex justify-end pt-2">
                    <UButton type="submit" color="neutral" size="md" :loading="saving" label="Add to List" />
                </div>
            </form>
        </div>

        <!-- Active Items -->
        <div v-if="activeItems.length" class="space-y-6 mb-12">
            <h2 class="text-sm font-medium text-muted uppercase tracking-wider pl-2 border-l-2 border-stone-300">
                To Read
            </h2>
            <div class="grid gap-3">
                <div v-for="item in activeItems" :key="item.id"
                    class="flex items-start gap-4 p-4 bg-white rounded-2xl border border-soft hover:shadow-sm transition-all group">
                    <UCheckbox :model-value="item.read" @update:model-value="toggleRead(item)" name="read"
                        class="mt-1" />
                    <div class="flex-1 min-w-0">
                        <a :href="item.url" target="_blank"
                            class="text-lg font-medium text-main hover:underline decoration-stone-300 font-serif block truncate">
                            {{ item.title || item.url }}
                        </a>
                        <p v-if="item.title" class="text-sm text-stone-500 truncate mb-1">
                            {{ item.url }}
                        </p>
                        <p v-if="item.note" class="text-sm text-stone-600 bg-stone-50 p-2 rounded-lg inline-block mt-2">
                            {{ item.note }}
                        </p>
                    </div>
                    <UButton color="red" variant="ghost" size="xs" icon="i-heroicons-trash"
                        class="opacity-0 group-hover:opacity-100 transition-opacity" @click="deleteItem(item.id)" />
                </div>
            </div>
        </div>

        <!-- Read Items -->
        <div v-if="readItems.length" class="space-y-6">
            <h2 class="text-sm font-medium text-muted uppercase tracking-wider pl-2 border-l-2 border-stone-200">
                Finished
            </h2>
            <div class="space-y-2 opacity-70 hover:opacity-100 transition-opacity">
                <div v-for="item in readItems" :key="item.id"
                    class="flex items-start gap-4 p-4 rounded-xl group hover:bg-white hover:shadow-sm">
                    <UCheckbox :model-value="item.read" @update:model-value="toggleRead(item)" name="read"
                        class="mt-1" />
                    <div class="flex-1 min-w-0">
                        <a :href="item.url" target="_blank"
                            class="text-base text-muted line-through group-hover:no-underline decoration-stone-300">
                            {{ item.title || item.url }}
                        </a>
                    </div>
                    <UButton color="red" variant="ghost" size="xs" icon="i-heroicons-trash"
                        class="opacity-0 group-hover:opacity-100 transition-opacity" @click="deleteItem(item.id)" />
                </div>
            </div>
        </div>

        <div v-if="!items?.length" class="text-center py-16 border-2 border-dashed border-stone-100 rounded-3xl">
            <p class="text-lg text-muted font-light mb-2">
                Your reading list is empty.
            </p>
            <p class="text-sm text-stone-500">
                Add articles, videos, or resources to consume later.
            </p>
        </div>
    </div>
</template>
