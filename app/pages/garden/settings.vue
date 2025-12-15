<script setup lang="ts">
definePageMeta({
    layout: 'garden',
    middleware: 'auth',
})

const { user, fetch } = useUserSession()

interface Settings {
    name: string
    email: string
}

const name = ref(user.value?.name || '')
const saving = ref(false)
const message = ref('')

async function saveSettings() {
    saving.value = true
    message.value = ''
    try {
        await $fetch('/api/user/settings', {
            method: 'PUT',
            body: { name: name.value },
        })
        await fetch()
        message.value = 'Settings saved'
    } catch (e: any) {
        message.value = e.data?.message || 'Failed to save'
    } finally {
        saving.value = false
    }
}
</script>

<template>
    <div class="max-w-2xl mx-auto">
        <div class="mb-10">
            <h1 class="text-3xl font-serif text-main mb-2">
                Garden <span class="text-muted font-light">Settings</span>
            </h1>
            <p class="text-muted text-lg font-light">
                Manage your personal knowledge space preferences
            </p>
        </div>

        <div class="bg-card/50 backdrop-blur-sm border border-soft rounded-2xl p-8 shadow-sm">
            <h2 class="text-xl font-serif text-main mb-6 flex items-center gap-2">
                <UIcon name="i-heroicons-user-circle" class="w-6 h-6 text-subtle" />
                Profile Information
            </h2>

            <form @submit.prevent="saveSettings" class="space-y-6">
                <!-- Email Field (ReadOnly) -->
                <div>
                    <label class="block text-sm font-medium text-main mb-2">Email Address</label>
                    <div class="relative">
                        <UInput :model-value="user?.email" type="email" size="lg" disabled
                            icon="i-heroicons-envelope"
                            :ui="{ base: 'bg-hover border-soft text-subtle rounded-xl' }" />
                    </div>
                    <p class="mt-1.5 text-xs text-muted">
                        Email address is managed by your account provider.
                    </p>
                </div>

                <!-- Name Field -->
                <div>
                    <label class="block text-sm font-medium text-main mb-2">Display Name</label>
                    <UInput v-model="name" type="text" size="lg" placeholder="Your name"
                        icon="i-heroicons-face-smile"
                        :ui="{ base: 'bg-card border-soft focus:ring-accent focus:border-accent rounded-xl' }" />
                </div>

                <!-- Status Message -->
                <div v-if="message" class="p-3 rounded-xl text-sm flex items-center gap-2 bg-hover border border-soft" 
                    :class="message.includes('Failed') ? 'text-red-600 bg-red-50 border-red-100' : 'text-green-600 bg-green-50 border-green-100'">
                    <UIcon :name="message.includes('Failed') ? 'i-heroicons-exclamation-circle' : 'i-heroicons-check-circle'" class="w-5 h-5" />
                    {{ message }}
                </div>

                <div class="pt-4 border-t border-soft flex justify-end">
                    <UButton type="submit" size="lg" color="neutral" :loading="saving" 
                        class="rounded-xl px-8 font-medium transition-transform active:scale-95 bg-black text-main hover:bg-hover">
                        Save Changes
                    </UButton>
                </div>
            </form>
        </div>

        <div class="mt-8 text-center">
            <p class="text-xs text-muted">
                Digitech Garden v1.0 &middot; Built with Nuxt & Tailwind
            </p>
        </div>
    </div>
</template>
