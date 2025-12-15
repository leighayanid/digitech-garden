<script setup lang="ts">
definePageMeta({
    layout: 'default'
})

const features = [
    {
        title: 'Capture',
        description: 'Plant your initial thoughts as seeds. Quickly jot down ideas before they fade away.',
        icon: 'i-heroicons-sparkles',
        color: 'growth-seedling'
    },
    {
        title: 'Nurture',
        description: 'Water your seeds with research and refined thinking. Watch them sprout into seedlings.',
        icon: 'i-heroicons-beaker',
        color: 'growth-budding'
    },
    {
        title: 'Harvest',
        description: 'Turn your matured evergreen notes into articles, projects, or shared wisdom.',
        icon: 'i-heroicons-book-open',
        color: 'growth-evergreen'
    }
]
</script>

<template>
    <!-- Theme-aware landing page -->
    <div class="min-h-screen bg-body text-main font-sans selection:bg-hover">

        <!-- Navigation / Header -->
        <header class="fixed top-0 inset-x-0 z-50 bg-body/80 backdrop-blur-md border-b border-DEFAULT">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-globe-alt" class="w-6 h-6 text-accent" />
                    <span class="font-serif font-medium text-lg tracking-tight text-main">Digitech Garden</span>
                </div>
                <div class="flex items-center gap-4">
                    <UButton to="/login" color="neutral" variant="ghost" size="sm" class="font-medium">
                        Sign In
                    </UButton>
                    <UButton to="/register" color="neutral" variant="solid" size="sm" class="font-medium">
                        Get Started
                    </UButton>
                </div>
            </div>
        </header>

        <!-- Hero Section -->
        <main class="pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

                <!-- Background Decoration -->
                <div class="absolute -top-24 -left-24 w-96 h-96 bg-accent/10 dark:bg-accent/20 rounded-full blur-3xl opacity-60 pointer-events-none animate-pulse"></div>
                <div class="absolute top-1/2 -right-24 w-80 h-80 bg-hover dark:bg-elevated rounded-full blur-3xl opacity-60 pointer-events-none"></div>

                <div class="max-w-2xl mx-auto text-center relative z-10 animate-fade-in-up">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-8">
                        <span class="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                        Now in active bloom
                    </div>

                    <h1 class="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-main mb-6 leading-[1.1]">
                        Cultivate your <br/>
                        <span class="text-accent italic">digital wisdom</span>
                    </h1>

                    <p class="text-lg sm:text-xl text-muted mb-10 leading-relaxed delay-100 animate-fade-in-up">
                        A serene space to capture thoughts, nurture ideas, and grow your personal knowledge base into a thriving ecosystem.
                    </p>

                    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 delay-200 animate-fade-in-up">
                        <UButton to="/register" size="xl" block class="sm:w-auto px-8 shadow-xl">
                            Start Cultivating
                        </UButton>
                        <UButton to="/login" variant="ghost" size="xl" block class="sm:w-auto px-8">
                            Enter Garden
                            <template #trailing>
                                <UIcon name="i-heroicons-arrow-right" />
                            </template>
                        </UButton>
                    </div>
                </div>

                <!-- Feature Grid -->
                <div class="mt-24 sm:mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 delay-300 animate-fade-in-up">
                    <div v-for="feature in features" :key="feature.title"
                         class="group card-soft p-8">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-hover group-hover:bg-elevated transition-colors">
                            <UIcon :name="feature.icon" :class="`w-6 h-6 ${feature.color}`" />
                        </div>
                        <h3 class="text-xl font-serif font-medium text-main mb-3">{{ feature.title }}</h3>
                        <p class="text-muted leading-relaxed">{{ feature.description }}</p>
                    </div>
                </div>

            </div>
        </main>

        <!-- Simple Footer -->
        <footer class="border-t border-DEFAULT bg-hover py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p class="font-serif text-main text-lg mb-2">Digitech Garden</p>
                <p class="text-muted text-sm">© {{ new Date().getFullYear() }} All rights reserved.</p>
            </div>
        </footer>

    </div>
</template>

<style scoped>
/* Specific overrides if needed, but Tailwind classes cover most */
</style>
