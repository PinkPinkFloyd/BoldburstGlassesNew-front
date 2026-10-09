import { defineStore } from 'pinia'
import type { CartEntry } from '~/types/shop'
import { cartTotals } from '~/utils/money'
export const useCartStore = defineStore('cart', () => {
  const items = ref<CartEntry[]>([])
  const totalItems = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const totals = computed(() => cartTotals(items.value))
  const busy = ref(false)
  async function load() {
    const data = await useNuxtApp().$api<{ items: CartEntry[] }>('/cart')
    items.value = data.items
  }
  async function addToCart(productVariantId: number) {
    await useNuxtApp().$api('/cart/add', { method: 'POST', body: { productVariantId, quantity: 1 } })
    await load()
  }
  async function removeFromCart(id: number) {
    await useNuxtApp().$api('/cart/remove/' + id, { method: 'DELETE' })
    await load()
  }
  async function setQuantity(item: CartEntry, quantity: number) {
    if (busy.value || quantity > 99) return
    busy.value = true
    try {
      if (quantity < 1) await removeFromCart(item.id)
      else if (useRuntimeConfig().public.demoMode) {
        await useNuxtApp().$api('/cart/quantity/' + item.id, { method: 'PATCH', body: { quantity } })
        await load()
      } else {
        await useNuxtApp().$api('/cart/remove/' + item.id, { method: 'DELETE' })
        await useNuxtApp().$api('/cart/add', { method: 'POST', body: { productVariantId: item.productVariant.id, quantity } })
        await load()
      }
    } finally { busy.value = false }
  }
  function clearCart() { items.value = [] }
  return { items, totalItems, totals, busy, load, addToCart, removeFromCart, setQuantity, clearCart }
})
