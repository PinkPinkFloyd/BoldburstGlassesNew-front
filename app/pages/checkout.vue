<script setup lang="ts">
import type { ShippingAddress } from '~/types/checkout'
definePageMeta({ middleware: ['auth'] })
const cart = useCartStore()
const processing = ref(false)
const error = ref('')
const toast = useToast()
await cart.load()
async function checkout(address: ShippingAddress) {
  if (processing.value || !cart.items.length) return
  processing.value = true
  error.value = ''
  try {
    await useNuxtApp().$api('/orders', { method: 'POST', body: { shippingAddress: { ...address } } })
    await cart.load()
    toast.add({ title: 'Demo order placed', description: 'Payment was simulated. Nothing will be shipped.', color: 'success' })
    await navigateTo('/orders')
  } catch (cause) { error.value = cause instanceof Error ? cause.message : 'Please try again' }
  finally { processing.value = false }
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">Demo Checkout</h1>
    <UAlert v-if="error" class="mb-6" title="Unable to place order" color="error" :description="error" />
    <div v-if="cart.items.length" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <CheckoutForm class="lg:col-span-2" :processing="processing" @submit="checkout" />
      <CartSummary :totals="cart.totals" />
    </div>
    <div v-else class="py-24 text-center">
      <p class="text-xl font-bold mb-6">Your cart is empty</p>
      <UButton to="/">Browse products</UButton>
    </div>
  </div>
</template>
