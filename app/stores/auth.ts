import { defineStore } from 'pinia'
import type { AuthResponse, ShopUser } from '~/types/shop'
export const useAuthStore = defineStore('auth', () => {
  const user = ref<ShopUser | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = computed(() => user.value !== null && token.value !== null)
  function setToken(value: string | null) {
    token.value = value
    if (import.meta.client && !useRuntimeConfig().public.demoMode) {
      try {
        if (value) localStorage.setItem('token', value)
        else localStorage.removeItem('token')
      } catch { /* Session still works without storage. */ }
    }
  }
  function setUser(value: ShopUser | null) { user.value = value }
  async function fetchUser() {
    try {
      user.value = await useNuxtApp().$api<ShopUser>('/auth/profile')
      if (useRuntimeConfig().public.demoMode) token.value = 'demo-session-' + user.value.id
    } catch { user.value = null; token.value = null }
  }
  async function initialize() {
    if (!useRuntimeConfig().public.demoMode) {
      try { token.value = localStorage.getItem('token') } catch { token.value = null }
      if (!token.value) return
    }
    await fetchUser()
  }
  async function login(email: string, password: string) {
    const data = await useNuxtApp().$api<AuthResponse>('/auth/login', { method: 'POST', body: { email, password } })
    setToken(data.access_token)
    setUser(data.user)
    await useCartStore().load()
    return data
  }
  async function register(name: string, email: string, password: string) {
    const data = await useNuxtApp().$api<AuthResponse>('/auth/register', { method: 'POST', body: { name, email, password } })
    setToken(data.access_token)
    setUser(data.user)
    await useCartStore().load()
    return data
  }
  async function logout() {
    if (useRuntimeConfig().public.demoMode) await useNuxtApp().$api('/auth/logout', { method: 'POST' })
    setToken(null)
    setUser(null)
    useCartStore().clearCart()
    await navigateTo('/login')
  }
  return { user, token, isAuthenticated, setToken, setUser, fetchUser, initialize, login, register, logout }
})
