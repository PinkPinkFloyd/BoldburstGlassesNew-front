<script setup lang="ts">
import { formatRupees } from '~/utils/money'
defineProps<{ totals: { subtotal: number; tax: number; total: number }; checkoutLink?: boolean }>()
</script>

<template>
  <aside class="bg-white p-6 rounded-xl border border-gray-100 h-fit">
    <h2 class="text-xl font-bold mb-6">Order Summary</h2>
    <dl class="space-y-4">
      <div class="flex justify-between"><dt>Subtotal</dt><dd>{{ formatRupees(totals.subtotal) }}</dd></div>
      <div class="flex justify-between"><dt>Shipping</dt><dd>Free</dd></div>
      <div class="flex justify-between"><dt>Tax (8%)</dt><dd>{{ formatRupees(totals.tax) }}</dd></div>
      <div class="flex justify-between border-t pt-4 font-bold text-lg"><dt>Total</dt><dd data-testid="order-total">{{ formatRupees(totals.total) }}</dd></div>
    </dl>
    <UButton v-if="checkoutLink" to="/checkout" block size="xl" class="mt-6">Proceed to Checkout</UButton>
  </aside>
</template>
