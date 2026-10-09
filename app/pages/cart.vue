<script setup lang="ts">
import type { CartEntry } from '~/types/shop'
const cart = useCartStore()
const { pending, error } = await useAsyncData('cart', async () => { await cart.load(); return true })
const toast = useToast()
async function quantity(item: CartEntry, count: number) {
  try { await cart.setQuantity(item, count) }
  catch (error) { toast.add({ title: 'Unable to update cart', description: error instanceof Error ? error.message : 'Please try again', color: 'error' }) }
}
async function remove(id: number) {
  try { await cart.removeFromCart(id) }
  catch (error) { toast.add({ title: 'Unable to remove item', description: error instanceof Error ? error.message : 'Please try again', color: 'error' }) }
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">Shopping Cart</h1>
    <USkeleton v-if="pending" class="h-64 w-full" />
    <UAlert v-else-if="error" color="error" title="Unable to load your cart" :description="error.message" />
    <div v-else-if="cart.items.length" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <CartItems class="lg:col-span-2" :items="cart.items" :busy="cart.busy" @quantity="quantity" @remove="remove" />
      <CartSummary :totals="cart.totals" checkout-link />
    </div>
    <div v-else class="text-center py-24">
      <h2 class="text-2xl font-bold mb-2">Your cart is empty</h2>
      <p class="text-gray-500 mb-8">Find your next pair of glasses.</p>
      <UButton to="/" size="xl">Start Shopping</UButton>
    </div>
  </div>
</template>
