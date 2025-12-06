<script setup lang="ts">
const { user, clear } = useUserSession()
const colorMode = useColorMode()

const navigation = [
    { label: 'Garden', to: '/garden', icon: 'i-heroicons-home' },
    { label: 'Notes', to: '/garden/notes', icon: 'i-heroicons-document-text' },
    { label: 'Snippets', to: '/garden/snippets', icon: 'i-heroicons-code-bracket' },
    { label: 'Cosmos', to: '/garden/cosmos', icon: 'i-heroicons-globe-alt' },
    { label: 'Daily', to: '/garden/daily', icon: 'i-heroicons-calendar' },
    { label: 'Graph', to: '/garden/graph', icon: 'i-heroicons-share' },
    { label: 'Tags', to: '/garden/tags', icon: 'i-heroicons-tag' },
    { label: 'Reading', to: '/garden/reading', icon: 'i-heroicons-bookmark' },
    { label: 'Search', to: '/garden/search', icon: 'i-heroicons-magnifying-glass' },
    { label: 'Chat', to: '/ai/chat', icon: 'i-heroicons-chat-bubble-left-right' },
    { label: 'AI Resources', to: '/ai', icon: 'i-heroicons-cpu-chip' },
    { label: 'Settings', to: '/garden/settings', icon: 'i-heroicons-cog-6-tooth' },
]

async function handleLogout() {
    await clear()
    navigateTo('/login')
}

function toggleColorMode() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
    <div class="min-h-screen bg-body text-base">
        <!-- Sidebar -->
        <aside
            class="fixed left-0 top-0 bottom-0 w-64 border-r border-DEFAULT bg-card p-6 flex flex-col transition-all duration-300">
            <div class="mb-10 px-2">
                <NuxtLink to="/garden"
                    class="font-serif text-xl font-medium tracking-tight text-main hover:text-muted transition-colors">
                    🌿 Digitech Garden
                </NuxtLink>
            </div>

            <nav class="space-y-2 flex-1">
                <NuxtLink v-for="item in navigation" :key="item.to" :to="item.to"
                    class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted hover:bg-hover hover:text-main transition-all group"
                    active-class="bg-hover text-main font-medium">
                    <UIcon :name="item.icon" class="size-5 group-hover:scale-110 transition-transform" />
                    {{ item.label }}
                </NuxtLink>
            </nav>

            <div class="mt-auto px-2">
                <div class="border-t border-DEFAULT pt-4 mb-4">
                    <div class="text-sm text-muted mb-3 font-medium truncate px-2">
                        {{ (user as any)?.name || (user as any)?.email || 'User' }}
                    </div>
                    <UButton size="md" color="neutral" variant="ghost" block
                        class="justify-start text-muted hover:text-main mb-2" @click="toggleColorMode">
                        <UIcon :name="colorMode.value === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'" class="mr-2" />
                        {{ colorMode.value === 'dark' ? 'Light' : 'Dark' }} Mode
                    </UButton>
                    <UButton size="md" color="neutral" variant="ghost" block
                        class="justify-start text-muted hover:text-red-500" @click="handleLogout">
                        <UIcon name="i-heroicons-arrow-right-on-rectangle" class="mr-2" />
                        Sign out
                    </UButton>
                </div>
            </div>
        </aside>

        <!-- Main content -->
        <main class="ml-64 p-8 max-w-5xl mx-auto transition-all duration-300">
            <slot />
        </main>
    </div>
</template>
