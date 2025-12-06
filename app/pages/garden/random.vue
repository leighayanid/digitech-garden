<script setup lang="ts">
definePageMeta({
    layout: 'garden',
    middleware: 'auth',
})

// Redirect to a random note
const { data } = await useFetch('/api/notes/random')

if (data.value?.id) {
    await navigateTo(`/garden/notes/${data.value.id}`, { replace: true })
} else {
    await navigateTo('/garden/notes', { replace: true })
}
</script>

<template>
    <div class="text-xs text-neutral-500">
        Finding a random note...
    </div>
</template>
