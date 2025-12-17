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
    <div class="min-h-screen bg-body">
        <!-- Sidebar -->
        <aside
            class="fixed left-0 top-0 bottom-0 w-72 border-r border-DEFAULT bg-card flex flex-col">

            <!-- Logo Section -->
            <div class="px-6 py-8 border-b border-DEFAULT">
                <NuxtLink to="/garden" class="flex items-center gap-3 group">
                    <div class="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                        <span class="text-white text-lg">🌿</span>
                    </div>
                    <div>
                        <span class="font-heading text-lg text-main block leading-tight">
                            Digital Garden
                        </span>
                        <span class="text-xs text-subtle">Cultivate knowledge</span>
                    </div>
                </NuxtLink>
            </div>

            <!-- Navigation -->
            <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                <NuxtLink
                    v-for="item in navigation"
                    :key="item.to"
                    :to="item.to"
                    class="sidebar-link group"
                    active-class="active">
                    <UIcon
                        :name="item.icon"
                        class="size-5 transition-transform group-hover:scale-110" />
                    <span>{{ item.label }}</span>
                </NuxtLink>
            </nav>

            <!-- User Section -->
            <div class="px-4 py-4 border-t border-DEFAULT bg-muted/30">
                <!-- User Info -->
                <div class="px-3 py-2 mb-3">
                    <div class="text-sm font-semibold text-main truncate">
                        {{ (user as any)?.name || 'User' }}
                    </div>
                    <div class="text-xs text-subtle truncate">
                        {{ (user as any)?.email || '' }}
                    </div>
                </div>

                <!-- Actions -->
                <div class="space-y-1">
                    <button
                        @click="toggleColorMode"
                        class="sidebar-link w-full justify-between">
                        <div class="flex items-center gap-3">
                            <UIcon
                                :name="colorMode.value === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'"
                                class="size-5" />
                            <span>{{ colorMode.value === 'dark' ? 'Light' : 'Dark' }} Mode</span>
                        </div>
                        <div class="w-8 h-5 rounded-full bg-hover flex items-center px-0.5 transition-colors"
                             :class="colorMode.value === 'dark' ? 'justify-end bg-accent-light' : 'justify-start'">
                            <div class="w-4 h-4 rounded-full bg-card shadow-sm transition-all"
                                 :class="colorMode.value === 'dark' ? 'bg-accent' : ''"></div>
                        </div>
                    </button>

                    <button
                        @click="handleLogout"
                        class="sidebar-link w-full text-error hover:bg-error/10">
                        <UIcon name="i-heroicons-arrow-right-on-rectangle" class="size-5" />
                        <span>Sign out</span>
                    </button>
                </div>
            </div>
        </aside>

        <!-- Main content -->
        <main class="ml-72 min-h-screen">
            <div class="max-w-5xl mx-auto px-8 py-10">
                <slot />
            </div>
        </main>
    </div>
</template>

<style scoped>
.text-error {
    color: var(--color-error);
}
</style>
