<script setup lang="ts">
definePageMeta({
    layout: 'garden',
    middleware: 'auth',
})

const sections = [
    {
        title: 'Development with AI',
        description: 'Workflows and strategies for AI-assisted coding.',
        icon: 'i-heroicons-cpu-chip',
        items: [
            { title: 'Prompt Engineering', description: 'Crafting effective prompts for code generation.' },
            { title: 'Context Management', description: 'Optimizing context windows for large codebases.' },
            { title: 'Iterative Refinement', description: 'Strategies for refining AI output.' },
        ]
    },
    {
        title: 'Tools',
        description: 'Essential AI tools for developers.',
        icon: 'i-heroicons-wrench-screwdriver',
        items: [
            { title: 'Cursor', description: 'The AI-first code editor.' },
            { title: 'Windsurf', description: 'Agentic IDE for complex tasks.' },
            { title: 'GitHub Copilot', description: 'AI pair programmer.' },
        ]
    },
    {
        title: 'MCP (Model Context Protocol)',
        description: 'Standardizing AI context exchange.',
        icon: 'i-heroicons-server',
        items: [
            { title: 'MCP Servers', description: 'Connecting data sources to AI models.' },
            { title: 'MCP Clients', description: 'Tools that consume MCP context.' },
            { title: 'Configuration', description: 'Setting up MCP in your environment.' },
        ]
    },
    {
        title: 'Configurations',
        description: 'Optimized settings and presets.',
        icon: 'i-heroicons-adjustments-horizontal',
        items: [
            { title: 'VS Code Settings', description: 'Optimizing VS Code for AI tools.' },
            { title: 'System Prompts', description: 'Custom instructions for AI agents.' },
            { title: 'API Keys', description: 'Managing access to LLMs.' },
        ]
    }
]
</script>

<template>
    <div>
        <div class="mb-10">
            <h1 class="text-3xl font-serif text-main mb-2">
                AI Resources <span class="text-muted font-light">Hub</span>
            </h1>
            <p class="text-muted text-lg font-light mb-6">
                Tools, workflows, and configurations for the AI era.
            </p>

            <!-- Chatbot CTA -->
            <NuxtLink to="/ai/chat" class="block group">
                <div class="p-6 rounded-2xl bg-gradient-to-br from-stone-800 to-black text-white shadow-lg hover:shadow-xl transition-all relative overflow-hidden">
                    <div class="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <UIcon name="i-heroicons-chat-bubble-left-right" class="w-32 h-32" />
                    </div>
                    <div class="relative z-10 flex items-center justify-between">
                        <div>
                            <div class="flex items-center gap-2 mb-2 text-subtle">
                                <UIcon name="i-heroicons-sparkles" class="w-5 h-5" />
                                <span class="text-sm font-medium uppercase tracking-wider">New Feature</span>
                            </div>
                            <h2 class="text-2xl font-serif mb-2">Talk to your Garden AI</h2>
                            <p class="text-subtle max-w-md">Brainstorm ideas, refactor code, and organize your thoughts with your personal AI assistant.</p>
                        </div>
                        <div class="bg-card text-main px-4 py-2 rounded-lg font-medium text-sm group-hover:scale-105 transition-transform">
                            Start Chatting &rarr;
                        </div>
                    </div>
                </div>
            </NuxtLink>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div v-for="section in sections" :key="section.title" class="space-y-4">
                <div class="flex items-center gap-3 mb-2">
                    <div class="p-2 rounded-lg bg-hover text-muted">
                        <UIcon :name="section.icon" class="w-6 h-6" />
                    </div>
                    <div>
                        <h2 class="text-xl font-serif text-main">{{ section.title }}</h2>
                        <p class="text-sm text-muted">{{ section.description }}</p>
                    </div>
                </div>

                <div class="space-y-3">
                    <div v-for="item in section.items" :key="item.title"
                        class="p-4 rounded-xl border border-soft hover:border-DEFAULT hover:shadow-sm transition-all bg-card/50 backdrop-blur-sm group cursor-pointer">
                        <h3 class="font-medium text-main group-hover:text-main transition-colors mb-1">
                            {{ item.title }}
                        </h3>
                        <p class="text-sm text-muted group-hover:text-muted transition-colors">
                            {{ item.description }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Future: Add a "Latest Updates" or "News" section here -->
    </div>
</template>
