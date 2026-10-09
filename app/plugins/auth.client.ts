export default defineNuxtPlugin({
  name: 'shop-session',
  dependsOn: ['shop-api'],
  async setup() {
    const auth = useAuthStore()
    await auth.initialize()
    if (useRuntimeConfig().public.demoMode || auth.isAuthenticated) await useCartStore().load()
  },
})
