import MarkdownIt from 'markdown-it'
import { createHighlighter } from 'shiki'

export const useMarkdown = () => {
    const highlighter = ref<any>(null)
    const md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
    })

    // Initialize highlighter
    onMounted(async () => {
        if (!highlighter.value) {
            highlighter.value = await createHighlighter({
                themes: ['github-light', 'github-dark'],
                langs: ['javascript', 'typescript', 'vue', 'python', 'html', 'css', 'json', 'bash', 'markdown', 'sql'],
            })
        }
    })

    const render = async (content: string) => {
        if (!content) return ''

        // Custom rendering for code blocks if highlighter is ready
        if (highlighter.value) {
            md.options.highlight = (code, lang) => {
                try {
                    return highlighter.value.codeToHtml(code, {
                        lang: lang || 'text',
                        themes: {
                            light: 'github-light',
                            dark: 'github-dark',
                        }
                    })
                } catch (e) {
                    return `<pre><code>${md.utils.escapeHtml(code)}</code></pre>`
                }
            }
        }

        let rendered = md.render(content)

        // Wiki-link replacement (simple regex for now, can be improved)
        rendered = rendered.replace(/\[\[([^\]]+)\]\]/g, (match, title) => {
            return `<a href="/garden/notes/search?q=${encodeURIComponent(title)}" class="wiki-link">${title}</a>`
        })

        return rendered
    }

    // Sync render for immediate display (without highlight initially)
    const renderSync = (content: string) => {
        if (!content) return ''
        md.options.highlight = (code, lang) => `<pre class="bg-stone-100 p-2 rounded"><code>${md.utils.escapeHtml(code)}</code></pre>`

        let rendered = md.render(content)
        // Wiki-link replacement
        rendered = rendered.replace(/\[\[([^\]]+)\]\]/g, (match, title) => {
            return `<span class="wiki-link-placeholder text-main decoration-dotted underline underline-offset-4 cursor-pointer" data-link="${title}">${title}</span>`
        })
        return rendered
    }

    return {
        render,
        renderSync,
        highlighter
    }
}
