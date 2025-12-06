export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const category = query.category as string || 'All'

    let tag = 'tech' // Default tag
    if (category === 'AI') tag = 'ai'
    if (category === 'Software Dev') tag = 'programming'
    if (category === 'Tools') tag = 'tooling'

    try {
        const response: any[] = await $fetch(`https://dev.to/api/articles`, {
            params: {
                tag,
                per_page: 9,
                top: 7 // Top posts from last 7 days for better quality
            }
        })

        return response.map(article => ({
            id: article.id,
            title: article.title,
            summary: article.description,
            source: article.user.name,
            date: new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            category: category,
            url: article.url,
            image: article.cover_image || article.social_image
        }))
    } catch (e) {
        throw createError({
            statusCode: 502,
            message: 'Failed to fetch news'
        })
    }
})
