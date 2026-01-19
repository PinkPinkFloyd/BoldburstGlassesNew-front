// middleware/auth.global.ts
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()

  // store.token 已经在插件初始化时恢复
  if (!auth.isAuthenticated) {
    return navigateTo('/login')
  }
})
