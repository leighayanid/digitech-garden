<script setup lang="ts">
definePageMeta({
    layout: 'garden',
    middleware: 'auth',
})

interface GraphNode {
    id: string
    title: string
    growthStage: string
    linkCount: number
}

interface GraphLink {
    source: string
    target: string
}

interface GraphData {
    nodes: GraphNode[]
    links: GraphLink[]
}

const { data: graphData } = await useFetch<GraphData>('/api/graph')

const selectedNode = ref<GraphNode | null>(null)

function selectNode(node: GraphNode) {
    selectedNode.value = node
}

function goToNote(id: string) {
    navigateTo(`/garden/notes/${id}`)
}

const growthIcon = (stage: string) => {
    switch (stage) {
        case 'SEEDLING': return '🌱'
        case 'BUDDING': return '🌿'
        case 'EVERGREEN': return '🌳'
        default: return '🌱'
    }
}

const growthColor = (stage: string) => {
    switch (stage) {
        case 'SEEDLING': return 'var(--color-seedling)'
        case 'BUDDING': return 'var(--color-budding)'
        case 'EVERGREEN': return 'var(--color-evergreen)'
        default: return '#a8a29e'
    }
}
</script>

<template>
    <div class="h-[calc(100vh-theme(spacing.32))] flex flex-col">
        <div class="mb-6 flex justify-between items-end border-b border-soft pb-4">
            <div>
                <h1 class="text-3xl font-serif text-main">Knowledge Graph</h1>
                <p class="text-muted font-light mt-1">Visualizing {{ graphData?.nodes?.length || 0 }} nodes</p>
            </div>
        </div>

        <div class="flex gap-6 flex-1 min-h-0">
            <!-- Graph visualization area -->
            <div class="flex-1 border border-soft rounded-2xl p-6 bg-white relative overflow-hidden shadow-sm">
                <template v-if="graphData?.nodes?.length">
                    <!-- Simple CSS-based graph visualization -->
                    <div class="flex flex-wrap gap-4 items-start content-start h-full overflow-y-auto p-2">
                        <button v-for="node in graphData.nodes" :key="node.id" @click="selectNode(node)"
                            @dblclick="goToNote(node.id)"
                            class="px-4 py-3 rounded-xl border transition-all text-left bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5"
                            :class="selectedNode?.id === node.id
                                ? 'border-stone-400 ring-1 ring-stone-900/10'
                                : 'border-soft hover:border-stone-300'" :style="{
                                    borderLeftWidth: '4px',
                                    borderLeftColor: growthColor(node.growthStage)
                                }">
                            <div class="flex items-center gap-2">
                                <span class="text-lg">{{ growthIcon(node.growthStage) }}</span>
                                <span class="text-base font-serif font-medium text-main">
                                    {{ node.title }}
                                </span>
                            </div>
                            <div class="text-xs text-muted mt-1 font-light">
                                {{ node.linkCount }} connections
                            </div>
                        </button>
                    </div>
                </template>
                <template v-else>
                    <div class="flex flex-col items-center justify-center h-full text-muted space-y-2">
                        <UIcon name="i-heroicons-share" class="size-12 opacity-20" />
                        <p class="font-serif text-lg">Your garden is empty</p>
                        <p class="text-sm">Create notes and link them to grow your graph.</p>
                    </div>
                </template>

                <div
                    class="absolute bottom-6 left-6 px-3 py-1.5 bg-white/80 backdrop-blur rounded-lg border border-soft text-xs text-muted">
                    Click to select • Double-click to open
                </div>
            </div>

            <!-- Node details sidebar -->
            <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 translate-x-4"
                enter-to-class="opacity-100 translate-x-0" leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100 translate-x-0" leave-to-class="opacity-0 translate-x-4">
                <div v-if="selectedNode" class="w-64 border border-soft rounded-2xl p-5 bg-white shadow-sm h-fit">
                    <div class="flex items-center gap-2 mb-3">
                        <span class="text-2xl">{{ growthIcon(selectedNode.growthStage) }}</span>
                    </div>
                    <h2 class="text-xl font-serif text-main mb-2 leading-tight">
                        {{ selectedNode.title }}
                    </h2>
                    <div class="text-sm text-muted mb-6 flex items-center gap-1">
                        <UIcon name="i-heroicons-link" class="size-4" />
                        {{ selectedNode.linkCount }} connections
                    </div>
                    <UButton size="md" color="neutral" block @click="goToNote(selectedNode.id)">
                        Open Note
                    </UButton>
                </div>
            </transition>
        </div>
    </div>
</template>
