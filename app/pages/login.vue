<script setup lang="ts">
const email = ref('')
const password = ref('')
const loading = ref(false)
const { fetch } = useUserSession()

async function handleLogin() {
    loading.value = true
    try {
        await $fetch('/api/auth/login', {
            method: 'POST',
            body: { email: email.value, password: password.value },
        })
        await fetch()
        navigateTo('/garden')
    } catch (e) {
        alert('Login failed')
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-body p-4">
        <div class="card-soft w-full max-w-sm p-8 bg-white">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-serif text-main mb-2">Digitech Garden</h1>
                <p class="text-muted font-light">for Tech</p>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-4">
                <UInput v-model="email" type="email" placeholder="Email" size="lg" icon="i-heroicons-envelope"
                    class="w-full" :ui="{ base: 'rounded-xl bg-stone-50 border-soft text-stone-900 placeholder:text-stone-400' }" />
                <UInput v-model="password" type="password" placeholder="Password" size="lg"
                    icon="i-heroicons-lock-closed" class="w-full"
                    :ui="{ base: 'rounded-xl bg-stone-50 border-soft text-stone-900 placeholder:text-stone-400' }" />

                <UButton type="submit" block size="lg" color="neutral" :loading="loading" class="rounded-xl">
                    Enter Garden
                </UButton>
            </form>

            <div class="mt-6 text-center text-sm">
                <NuxtLink to="/register"
                    class="text-muted hover:text-main transition-colors underline decoration-stone-300 underline-offset-4">
                    Plant a new garden (Register)
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
