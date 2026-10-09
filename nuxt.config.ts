import { env } from 'node:process'
const demoMode = env.NUXT_PUBLIC_DEMO_MODE === 'true'
export default defineNuxtConfig({
  ssr: !demoMode,
  app: { baseURL: env.NUXT_APP_BASE_URL || '/' },
  // Enable Nuxt 4 features and directory structure
  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@nuxt/icon'
  ],

  css: ['~/assets/css/main.css'],

  icon: { provider: 'iconify', clientBundle: { scan: true } },
  // Use the system font stack so Pages builds need no font downloads.
  ui: { fonts: false },

  runtimeConfig: {
    public: {
      apiBase: demoMode ? '' : (env.NUXT_PUBLIC_API_BASE_URL || 'https://api.boldburstglasses.com'),
      demoMode,
    }
  },

  devtools: {
    enabled: false
  },

  compatibilityDate: '2025-01-15'
})
