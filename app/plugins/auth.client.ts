// plugins/auth.client.ts
import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(() => {
  const auth = useAuthStore()
  auth.initialize()

  return {
    provide: {
      setAuthToken(token: string | null) {
        auth.setToken(token)
      },
      clearAuth() {
        auth.logout()
      }
    }
  }
})
