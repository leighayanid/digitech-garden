<script setup lang="ts">
const email = ref('')
const password = ref('')
const name = ref('')
const loading = ref(false)
const { fetch } = useUserSession()

async function handleRegister() {
    loading.value = true
    try {
        await $fetch('/api/auth/register', {
            method: 'POST',
            body: { email: email.value, password: password.value, name: name.value },
        })
        await fetch()
        navigateTo('/garden')
    } catch (e) {
        alert('Registration failed')
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-body p-4 relative overflow-hidden">
        <!-- Background Decorations -->
        <div class="absolute top-20 -right-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-pulse-soft"></div>
        <div class="absolute bottom-20 -left-32 w-96 h-96 rounded-full bg-secondary/5 blur-3xl animate-pulse-soft delay-200"></div>

        <div class="w-full max-w-md relative z-10 animate-fade-in-up">
            <!-- Logo -->
            <div class="text-center mb-10">
                <div class="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span class="text-2xl text-white">🌱</span>
                </div>
                <h1 class="font-heading text-3xl text-main mb-2">Start Growing</h1>
                <p class="text-muted">Create your knowledge garden</p>
            </div>

            <!-- Form Card -->
            <div class="card-elevated p-8">
                <form @submit.prevent="handleRegister" class="space-y-5">
                    <div>
                        <label class="block text-sm font-medium text-main mb-2">Name</label>
                        <UInput
                            v-model="name"
                            type="text"
                            placeholder="Your name"
                            size="xl"
                            icon="i-heroicons-user"
                            class="w-full" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-main mb-2">Email</label>
                        <UInput
                            v-model="email"
                            type="email"
                            placeholder="you@example.com"
                            size="xl"
                            icon="i-heroicons-envelope"
                            class="w-full" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-main mb-2">Password</label>
                        <UInput
                            v-model="password"
                            type="password"
                            placeholder="••••••••"
                            size="xl"
                            icon="i-heroicons-lock-closed"
                            class="w-full" />
                    </div>

                    <UButton
                        type="submit"
                        block
                        size="xl"
                        :loading="loading"
                        class="font-heading font-semibold bg-accent hover:bg-accent-hover text-white mt-2">
                        Create Garden
                        <template #trailing>
                            <UIcon name="i-heroicons-sparkles" />
                        </template>
                    </UButton>
                </form>
            </div>

            <!-- Footer -->
            <div class="mt-8 text-center">
                <p class="text-muted">
                    Already have a garden?
                    <NuxtLink to="/login" class="text-accent font-medium hover:underline ml-1">
                        Sign in
                    </NuxtLink>
                </p>
            </div>
        </div>
    </div>
</template>
