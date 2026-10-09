import { createDemoApi } from '~/utils/demo-api'
import type { ShopApi } from '~/types/shop'
export default defineNuxtPlugin({
  name: 'shop-api',
  setup() {
    const config = useRuntimeConfig()
    let storage: Storage | undefined
    try { if (import.meta.client) storage = window.localStorage } catch { /* Memory fallback. */ }
    const demoApi = createDemoApi(storage)
    const realApi = $fetch.create({
      baseURL: config.public.apiBase,
      onRequest({ options }) {
        const token = useAuthStore().token
        if (token) options.headers.set('Authorization', 'Bearer ' + token)
      },
    })
    const api: ShopApi = (url, options) => config.public.demoMode ? demoApi(url, options) : realApi(url, options)
    return { provide: { api } }
  },
})
