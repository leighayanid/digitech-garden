<script setup lang="ts">
definePageMeta({
    layout: 'default'
})

const features = [
    {
        title: 'Capture',
        description: 'Plant your thoughts as seeds. Quick capture before ideas fade into the ether.',
        icon: 'i-heroicons-sparkles',
        stage: 'seedling'
    },
    {
        title: 'Nurture',
        description: 'Water with research and reflection. Watch seedlings grow into budding concepts.',
        icon: 'i-heroicons-beaker',
        stage: 'budding'
    },
    {
        title: 'Harvest',
        description: 'Mature evergreen notes become articles, projects, and shared wisdom.',
        icon: 'i-heroicons-book-open',
        stage: 'evergreen'
    }
]

const stats = [
    { value: '∞', label: 'Ideas Waiting' },
    { value: '24/7', label: 'Always Growing' },
    { value: '100%', label: 'Yours Forever' }
]
</script>

<template>
    <div class="min-h-screen bg-body">

        <!-- Navigation -->
        <header class="fixed top-0 inset-x-0 z-50 bg-body/80 backdrop-blur-xl border-b border-DEFAULT">
            <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <NuxtLink to="/" class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                        <span class="text-white text-sm">🌿</span>
                    </div>
                    <span class="font-heading text-lg text-main">Digital Garden</span>
                </NuxtLink>

                <div class="flex items-center gap-3">
                    <UButton to="/login" variant="ghost" size="md" class="font-heading font-medium">
                        Sign In
                    </UButton>
                    <UButton to="/register" size="md" class="font-heading font-semibold bg-accent hover:bg-accent-hover text-white">
                        Get Started
                    </UButton>
                </div>
            </div>
        </header>

        <!-- Hero Section -->
        <section class="pt-32 pb-24 lg:pt-40 lg:pb-32 relative overflow-hidden">
            <!-- Background Decorations -->
            <div class="absolute top-20 -left-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-pulse-soft"></div>
            <div class="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-secondary/5 blur-3xl animate-pulse-soft delay-200"></div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent/3 blur-3xl"></div>

            <div class="max-w-6xl mx-auto px-6 relative z-10">
                <div class="max-w-4xl mx-auto text-center">
                    <!-- Badge -->
                    <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-light border border-accent/20 mb-8 animate-fade-in-up">
                        <span class="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                        <span class="text-sm font-medium text-accent">Now cultivating ideas</span>
                    </div>

                    <!-- Main Headline -->
                    <h1 class="font-heading text-5xl sm:text-6xl lg:text-7xl text-main mb-6 leading-[1.05] tracking-tight animate-fade-in-up delay-100">
                        Where ideas
                        <br />
                        <span class="font-serif italic text-accent">bloom & grow</span>
                    </h1>

                    <!-- Subheadline -->
                    <p class="text-xl lg:text-2xl text-muted max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-200">
                        A beautiful space to capture thoughts, nurture connections, and cultivate your personal knowledge ecosystem.
                    </p>

                    <!-- CTA Buttons -->
                    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
                        <UButton to="/register" size="xl" class="px-8 py-4 font-heading font-semibold bg-accent hover:bg-accent-hover text-white shadow-lg hover:shadow-xl transition-all">
                            Start Your Garden
                            <template #trailing>
                                <UIcon name="i-heroicons-arrow-right" class="ml-1" />
                            </template>
                        </UButton>
                        <UButton to="/login" variant="ghost" size="xl" class="px-8 py-4 font-heading font-medium">
                            Enter Garden
                        </UButton>
                    </div>
                </div>

                <!-- Stats Row -->
                <div class="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in-up delay-400">
                    <div v-for="stat in stats" :key="stat.label" class="text-center">
                        <div class="font-heading text-3xl lg:text-4xl font-bold text-main mb-1">{{ stat.value }}</div>
                        <div class="text-sm text-subtle uppercase tracking-wider">{{ stat.label }}</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="py-24 lg:py-32 bg-muted/30">
            <div class="max-w-6xl mx-auto px-6">
                <!-- Section Header -->
                <div class="text-center mb-16">
                    <h2 class="font-heading text-4xl lg:text-5xl text-main mb-4">
                        The Growth Cycle
                    </h2>
                    <p class="text-lg text-muted max-w-xl mx-auto">
                        Every great idea follows a natural path from seed to harvest.
                    </p>
                </div>

                <!-- Feature Cards -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    <div
                        v-for="(feature, index) in features"
                        :key="feature.title"
                        class="card-elevated p-8 lg:p-10 group animate-fade-in-up"
                        :style="{ animationDelay: `${index * 100 + 100}ms` }">

                        <!-- Icon -->
                        <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                             :class="{
                                 'bg-seedling/10': feature.stage === 'seedling',
                                 'bg-budding/10': feature.stage === 'budding',
                                 'bg-evergreen/10': feature.stage === 'evergreen'
                             }">
                            <UIcon
                                :name="feature.icon"
                                class="size-7"
                                :class="{
                                    'growth-seedling': feature.stage === 'seedling',
                                    'growth-budding': feature.stage === 'budding',
                                    'growth-evergreen': feature.stage === 'evergreen'
                                }" />
                        </div>

                        <!-- Content -->
                        <h3 class="font-heading text-2xl text-main mb-3">{{ feature.title }}</h3>
                        <p class="text-muted leading-relaxed">{{ feature.description }}</p>

                        <!-- Stage Indicator -->
                        <div class="mt-6 pt-6 border-t border-DEFAULT">
                            <span
                                class="inline-flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full"
                                :class="`badge-${feature.stage}`">
                                <span class="w-1.5 h-1.5 rounded-full"
                                      :class="{
                                          'bg-seedling': feature.stage === 'seedling',
                                          'bg-budding': feature.stage === 'budding',
                                          'bg-evergreen': feature.stage === 'evergreen'
                                      }"></span>
                                {{ feature.stage.charAt(0).toUpperCase() + feature.stage.slice(1) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Quote Section -->
        <section class="py-24 lg:py-32">
            <div class="max-w-4xl mx-auto px-6 text-center">
                <blockquote class="font-serif text-3xl lg:text-4xl text-main italic leading-relaxed mb-8 animate-fade-in-up">
                    "The best time to plant a tree was twenty years ago.
                    <br />
                    The second best time is now."
                </blockquote>
                <cite class="text-muted text-lg not-italic animate-fade-in-up delay-100">— Chinese Proverb</cite>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="py-24 lg:py-32 bg-accent">
            <div class="max-w-4xl mx-auto px-6 text-center">
                <h2 class="font-heading text-4xl lg:text-5xl text-white mb-6">
                    Ready to cultivate?
                </h2>
                <p class="text-xl text-white/80 mb-10 max-w-xl mx-auto">
                    Join a growing community of thinkers, creators, and lifelong learners.
                </p>
                <UButton to="/register" size="xl" variant="solid" class="px-10 py-4 font-heading font-semibold bg-white text-accent hover:bg-white/90 shadow-xl">
                    Start Your Garden Free
                    <template #trailing>
                        <UIcon name="i-heroicons-arrow-right" />
                    </template>
                </UButton>
            </div>
        </section>

        <!-- Footer -->
        <footer class="py-12 bg-card border-t border-DEFAULT">
            <div class="max-w-6xl mx-auto px-6">
                <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                            <span class="text-white text-sm">🌿</span>
                        </div>
                        <span class="font-heading text-lg text-main">Digital Garden</span>
                    </div>
                    <p class="text-sm text-subtle">
                        © {{ new Date().getFullYear() }} Digital Garden. Cultivate your wisdom.
                    </p>
                </div>
            </div>
        </footer>
    </div>
</template>

<style scoped>
.bg-seedling\/10 {
    background-color: color-mix(in srgb, var(--color-seedling) 10%, transparent);
}
.bg-budding\/10 {
    background-color: color-mix(in srgb, var(--color-budding) 10%, transparent);
}
.bg-evergreen\/10 {
    background-color: color-mix(in srgb, var(--color-evergreen) 10%, transparent);
}
</style>
