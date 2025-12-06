<script setup lang="ts">
definePageMeta({
    layout: 'garden',
    middleware: 'auth',
})

const { data: readingList } = await useFetch('/api/reading')

// --- Repositories Logic ---
interface Repo {
    id: number
    name: string
    full_name: string
    description: string
    html_url: string
    stargazers_count: number
    forks_count: number
    language: string
    owner: {
        avatar_url: string
        login: string
    }
}

const languages = ['All', 'TypeScript', 'Vue', 'Python', 'Rust', 'Go', 'JavaScript']
const selectedLanguage = ref('All')
const loading = ref(false)
const repos = ref<Repo[]>([])
const error = ref('')

async function fetchTrending() {
    loading.value = true
    error.value = ''
    try {
        const date = new Date()
        date.setDate(date.getDate() - 30) // Last 30 days
        const dateStr = date.toISOString().split('T')[0]

        let q = `created:>${dateStr} sort:stars-desc`
        if (selectedLanguage.value !== 'All') {
            q += ` language:${selectedLanguage.value}`
        }

        const res: any = await $fetch('https://api.github.com/search/repositories', {
            params: { q, per_page: 24 }
        })
        repos.value = res.items
    } catch (e) {
        error.value = 'Failed to fetch usage limits or network error.'
    } finally {
        loading.value = false
    }
}

// Initial fetch
onMounted(() => {
    fetchTrending()
})

watch(selectedLanguage, () => {
    fetchTrending()
})

const addingToReading = ref<number | null>(null)

async function addToReading(repo: Repo) {
    if (addingToReading.value) return
    addingToReading.value = repo.id
    try {
        await $fetch('/api/reading', {
            method: 'POST',
            body: {
                url: repo.html_url,
                title: repo.full_name,
                note: `Discovered in Cosmos: ${repo.description?.slice(0, 100)}...`
            }
        })
        alert('Added to Reading List!')
    } catch (e) {
        alert('Failed or already exists')
    } finally {
        addingToReading.value = null
    }
}

// --- News Logic ---
type NewsCategory = 'All' | 'AI' | 'Software Dev' | 'Tools'
const activeTab = ref<'repos' | 'news'>('repos')
const newsFilter = ref<NewsCategory>('All')
const newsCategories: NewsCategory[] = ['All', 'AI', 'Software Dev', 'Tools']

interface NewsItem {
    id: number
    title: string
    summary: string
    source: string
    date: string
    category: NewsCategory
    url: string
    image?: string
}

const { data: newsItems, status: newsStatus, refresh: refreshNews } = await useFetch<NewsItem[]>('/api/news', {
    query: computed(() => ({ category: newsFilter.value })),
    watch: [newsFilter]
})
</script>

<template>
    <div class="max-w-6xl mx-auto">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-soft gap-4">
            <div>
                <h1 class="text-4xl font-serif text-main mb-2 tracking-tight">
                    Cosmos <span class="text-lg font-sans font-light text-muted align-middle ml-2">Discovery</span>
                </h1>
                <p class="text-muted font-light text-lg">
                    Explore the universe of trending technology.
                </p>
            </div>

            <!-- Top Level Tabs -->
            <div class="flex gap-1 bg-stone-100 p-1 rounded-xl border border-soft">
                <button 
                    @click="activeTab = 'repos'"
                    class="px-4 py-2 text-sm font-medium rounded-lg transition-all"
                    :class="activeTab === 'repos' ? 'bg-white text-black shadow-sm' : 'text-stone-500 hover:text-stone-700'"
                >
                    Repositories
                </button>
                <button 
                    @click="activeTab = 'news'"
                    class="px-4 py-2 text-sm font-medium rounded-lg transition-all"
                    :class="activeTab === 'news' ? 'bg-white text-black shadow-sm' : 'text-stone-500 hover:text-stone-700'"
                >
                    Tech News
                </button>
            </div>
        </div>

        <!-- REPOSITORIES VIEW -->
        <div v-if="activeTab === 'repos'">
            <!-- Repo Filters -->
            <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
                <button v-for="lang in languages" :key="lang" @click="selectedLanguage = lang"
                    class="px-3 py-1.5 text-sm rounded-lg transition-all whitespace-nowrap border border-transparent"
                    :class="selectedLanguage === lang ? 'bg-stone-800 text-white shadow-sm' : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-300'">
                    {{ lang }}
                </button>
            </div>

            <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="i in 6" :key="i" class="h-48 bg-stone-100 rounded-2xl animate-pulse" />
            </div>

            <div v-else-if="error" class="text-center py-20">
                <div class="text-red-500 mb-2">Error contacting mission control.</div>
                <button @click="fetchTrending" class="text-main underline">Retry Mission</button>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Repo Cards (Same as before) -->
                <div v-for="repo in repos" :key="repo.id"
                    class="group bg-white border border-transparent hover:border-soft hover:shadow-lg transition-all duration-300 rounded-2xl p-5 flex flex-col h-full relative overflow-hidden">
                    <div
                        class="absolute top-0 right-0 p-[200px] bg-gradient-to-bl from-stone-50/50 to-transparent pointer-events-none group-hover:from-stone-100/50 transition-all rounded-full translate-x-1/2 -translate-y-1/2" />

                    <div class="relative z-10 flex items-start justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <img :src="repo.owner.avatar_url" class="w-10 h-10 rounded-full border border-soft shadow-sm" />
                            <div>
                                <a :href="repo.html_url" target="_blank"
                                    class="font-bold text-main hover:underline decoration-stone-300 decoration-1 underline-offset-2 truncate block max-w-[180px]">
                                    {{ repo.name }}
                                </a>
                                <div class="text-xs text-muted">{{ repo.owner.login }}</div>
                            </div>
                        </div>
                        <span v-if="repo.language"
                            class="text-xs font-mono bg-stone-100 px-2 py-1 rounded-md text-stone-600 border border-stone-200">
                            {{ repo.language }}
                        </span>
                    </div>

                    <p class="text-sm text-stone-600 mb-6 flex-1 leading-relaxed font-light line-clamp-3">
                        {{ repo.description }}
                    </p>

                    <div class="flex items-center justify-between pt-4 border-t border-dotted border-stone-200">
                        <div class="flex gap-4 text-xs text-muted font-mono">
                            <span class="flex items-center gap-1">
                                <UIcon name="i-heroicons-star" class="text-amber-400" />
                                {{ (repo.stargazers_count / 1000).toFixed(1) }}k
                            </span>
                            <span class="flex items-center gap-1">
                                <UIcon name="i-heroicons-arrow-path-rounded-square" />
                                {{ repo.forks_count }}
                            </span>
                        </div>

                        <UButton size="xs" color="neutral" variant="ghost" :loading="addingToReading === repo.id"
                            @click="addToReading(repo)" icon="i-heroicons-bookmark" class="hover:bg-stone-100">
                            Plant Seed
                        </UButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- NEWS VIEW -->
        <div v-if="activeTab === 'news'">
             <!-- News Filters -->
             <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
                <button v-for="cat in newsCategories" :key="cat" @click="newsFilter = cat"
                    class="px-3 py-1.5 text-sm rounded-lg transition-all whitespace-nowrap border border-transparent"
                    :class="newsFilter === cat ? 'bg-stone-800 text-white shadow-sm' : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-300'">
                    {{ cat }}
                </button>
            </div>

            <div v-if="newsStatus === 'pending'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="i in 6" :key="i" class="h-48 bg-stone-100 rounded-2xl animate-pulse" />
            </div>

            <div v-else-if="newsStatus === 'error'" class="text-center py-20">
                 <div class="text-red-500 mb-2">Failed to load news feed.</div>
                 <button @click="refreshNews" class="text-main underline">Retry</button>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="item in newsItems" :key="item.id" 
                    class="group bg-white border border-soft hover:border-stone-300 hover:shadow-md transition-all rounded-2xl p-5 flex flex-col h-full">
                    
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-xs font-medium px-2 py-1 rounded bg-stone-100 text-stone-600">
                            {{ item.category }}
                        </span>
                        <span class="text-xs text-muted">{{ item.date }}</span>
                    </div>

                    <h3 class="text-lg font-serif font-bold text-main mb-2 group-hover:text-stone-700 transition-colors line-clamp-2">
                        {{ item.title }}
                    </h3>

                    <p class="text-sm text-stone-600 mb-4 flex-1 font-light leading-relaxed line-clamp-3">
                        {{ item.summary }}
                    </p>

                    <div class="flex items-center justify-between pt-4 border-t border-soft mt-auto">
                        <span class="text-xs font-medium text-stone-500 uppercase tracking-wide truncate max-w-[120px]">
                            {{ item.source }}
                        </span>
                        <a :href="item.url" target="_blank" class="text-sm font-medium text-black hover:underline flex items-center gap-1">
                            Read 
                            <UIcon name="i-heroicons-arrow-up-right" class="w-3 h-3" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
