import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),
  getters: {
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0),
  },
  actions: {
    addToCart(product) {
      const existing = this.items.find(i => 
        i.id === product.id && 
        i.selectedColor === product.selectedColor && 
        i.selectedLens === product.selectedLens
      )
      
      if (existing) {
        existing.quantity += 1
      } else {
        this.items.push({ ...product, quantity: 1 })
      }
    },
    removeFromCart(product) {
      const index = this.items.indexOf(product)
      if (index > -1) {
        this.items.splice(index, 1)
      }
    },
    clearCart() {
      this.items = []
    }
  },
  persist: {
    storage: persistedState.localStorage,
  },
})