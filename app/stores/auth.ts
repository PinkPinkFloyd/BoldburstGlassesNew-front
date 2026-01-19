// stores/auth.ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  id: 'auth',
  state: () => ({
    user: null as any,
    token: null as string | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    setToken(token: string | null) {
      this.token = token
      if (token) localStorage.setItem('token', token)
      else localStorage.removeItem('token')
    },
    setUser(user: any) {
      this.user = user
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      navigateTo('/login')
    },
    async login(email: string, password: string) {
      const config = useRuntimeConfig()
      try {
        const data = await $fetch(`${config.public.apiBase}/auth/login`, {
          method: 'POST',
          body: { email, password }
        })
        this.setToken(data.access_token)
        this.setUser(data.user)
        return data
      } catch (error) {
        throw error
      }
    },
    async register(name: string,email: string, password: string ) {
      const config = useRuntimeConfig()
      try {
        const data = await $fetch(`${config.public.apiBase}/auth/register`, {
          method: 'POST',
          body: { email, password, name }
        })
        this.setToken(data.access_token)
        this.setUser(data.user)
        return data
      } catch (error) {
        throw error
      }
    },
    async fetchUser() {
      if (!this.token) return
      try {
        const config = useRuntimeConfig()
        this.user = await $fetch(`${config.public.apiBase}/auth/profile`, {
          headers: { Authorization: `Bearer ${this.token}` }
        })
      } catch (error) {
        this.logout()
      }
    },
    // 初始化，从 localStorage 恢复 token
    initialize() {
      const token = localStorage.getItem('token')
      if (token) this.token = token
    }
  }
})
