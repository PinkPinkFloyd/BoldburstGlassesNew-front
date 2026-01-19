import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: useCookie('auth_token').value || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(email, password) {
      const config = useRuntimeConfig()
      try {
        const data = await $fetch(`${config.public.apiBase}/auth/login`, {
          method: 'POST',
          body: { email, password }
        })
        this.setToken(data.access_token)
        this.user = data.user
        return data
      } catch (error) {
        throw error
      }
    },
    async register(name, email, password) {
      const config = useRuntimeConfig()
      try {
        const data = await $fetch(`${config.public.apiBase}/auth/register`, {
          method: 'POST',
          body: { name, email, password }
        })
        this.setToken(data.access_token)
        this.user = data.user
        return true
      } catch (error) {
        throw error
      }
    },
    setToken(token) {
      this.token = token
      const cookie = useCookie('auth_token')
      cookie.value = token
    },
    logout() {
      this.token = null
      this.user = null
      const cookie = useCookie('auth_token')
      cookie.value = null
      navigateTo('/login')
    }
  }
})
