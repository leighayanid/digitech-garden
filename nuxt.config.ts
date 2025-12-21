import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@prisma/nuxt',
    'nuxt-auth-utils',
  ],

  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
  },

  // Global App Config
  app: {
    head: {
      title: 'Digitech Garden',
      meta: [
        { name: 'description', content: 'A personal technical knowledge garden.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  // Nuxt UI uses Tailwind CSS v4 - configure theme via CSS
  css: ['~/assets/css/main.css'],

  // Auth session secret (will be set in .env)
  runtimeConfig: {
    session: {
      password: process.env.NUXT_SESSION_PASSWORD || '',
    },
  },

  // Configure Nitro aliases for server imports
  nitro: {
    alias: {
      '#lib': fileURLToPath(new URL('./lib', import.meta.url)),
      '#root': fileURLToPath(new URL('./', import.meta.url)),
    },
  },

  // Fix Prisma client resolution for Vercel production builds
  vite: {
    resolve: {
      alias: {
        '.prisma/client/index-browser': resolve('./node_modules/.prisma/client/index-browser.js'),
      },
    },
  },
})
