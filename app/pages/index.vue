<script setup lang="ts">
definePageMeta({
    layout: 'default'
})

const features = [
    {
        title: 'Capture',
        description: 'Plant your initial thoughts as seeds. Quickly jot down ideas before they fade away.',
        icon: 'i-heroicons-sparkles',
        color: 'text-amber-500'
    },
    {
        title: 'Nurture',
        description: 'Water your seeds with research and refined thinking. Watch them sprout into seedlings.',
        icon: 'i-heroicons-beaker',
        color: 'text-emerald-500' // Using existing palette relation
    },
    {
        title: 'Harvest',
        description: 'Turn your matured evergreen notes into articles, projects, or shared wisdom.',
        icon: 'i-heroicons-book-open',
        color: 'text-stone-600'
    }
]
</script>

<template>
    <!-- Force light mode defaults heavily -->
    <div class="min-h-screen bg-[#fafaf9] text-[#1c1917] font-sans selection:bg-stone-200">
        
        <!-- Navigation / Header -->
        <header class="fixed top-0 inset-x-0 z-50 bg-[#fafaf9]/80 backdrop-blur-md border-b border-[#e7e5e4]">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-globe-alt" class="w-6 h-6 text-emerald-600" />
                    <span class="font-serif font-medium text-lg tracking-tight text-stone-900">Digitech Garden</span>
                </div>
                <div class="flex items-center gap-4">
                    <UButton to="/login" color="neutral" variant="ghost" size="sm" class="font-medium hover:bg-stone-100">
                        Sign In
                    </UButton>
                    <UButton to="/register" color="neutral" variant="solid" size="sm" class="font-medium bg-stone-900 text-stone-50 hover:bg-stone-800">
                        Get Started
                    </UButton>
                </div>
            </div>
        </header>

        <!-- Hero Section -->
        <main class="pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                
                <!-- Background Decoration -->
                <div class="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl opacity-60 pointer-events-none mix-blend-multiply animate-pulse"></div>
                <div class="absolute top-1/2 -right-24 w-80 h-80 bg-stone-200/50 rounded-full blur-3xl opacity-60 pointer-events-none mix-blend-multiply"></div>

                <div class="max-w-2xl mx-auto text-center relative z-10 animate-fade-in-up">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100/50 text-emerald-800 text-xs font-medium mb-8">
                        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Now in active bloom
                    </div>
                    
                    <h1 class="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-stone-900 mb-6 leading-[1.1]">
                        Cultivate your <br/>
                        <span class="text-emerald-700 italic">digital wisdom</span>
                    </h1>
                    
                    <p class="text-lg sm:text-xl text-stone-600 mb-10 leading-relaxed delay-100 animate-fade-in-up">
                        A serene space to capture thoughts, nurture ideas, and grow your personal knowledge base into a thriving ecosystem.
                    </p>

                    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 delay-200 animate-fade-in-up">
                        <UButton to="/register" size="xl" block class="sm:w-auto px-8 bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-xl shadow-stone-900/5">
                            Start Cultivating
                        </UButton>
                        <UButton to="/login" variant="ghost" size="xl" block class="sm:w-auto px-8 text-stone-600 hover:bg-stone-100 hover:text-stone-900">
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
                         class="group p-8 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                        <div :class="`w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-stone-50 group-hover:bg-stone-100 transition-colors`">
                            <UIcon :name="feature.icon" :class="`w-6 h-6 ${feature.color}`" />
                        </div>
                        <h3 class="text-xl font-serif font-medium text-stone-900 mb-3">{{ feature.title }}</h3>
                        <p class="text-stone-500 leading-relaxed">{{ feature.description }}</p>
                    </div>
                </div>

            </div>
        </main>

        <!-- Simple Footer -->
        <footer class="border-t border-stone-200 bg-stone-50 py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p class="font-serif text-stone-900 text-lg mb-2">Digitech Garden</p>
                <p class="text-stone-500 text-sm">© {{ new Date().getFullYear() }} All rights reserved.</p>
            </div>
        </footer>

    </div>
</template>

<style scoped>
/* Specific overrides if needed, but Tailwind classes cover most */
</style>
