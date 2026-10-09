<script setup lang="ts">
import type { ShippingAddress } from '~/types/checkout'
defineProps<{ processing: boolean }>()
const emit = defineEmits<{ submit: [address: ShippingAddress] }>()
const form = reactive<ShippingAddress>({ firstName: 'Demo', lastName: 'Shopper', address: '123 Example Street', city: 'Example City', zip: '10001', country: 'United States' })
const fields = [
  { key: 'firstName', label: 'First name' }, { key: 'lastName', label: 'Last name' },
  { key: 'address', label: 'Street address' }, { key: 'city', label: 'City' },
  { key: 'zip', label: 'Postal code' }, { key: 'country', label: 'Country' },
] as const
</script>

<template>
  <form class="p-6 bg-white rounded-xl border border-gray-100 space-y-6" @submit.prevent="emit('submit', { ...form })">
    <h2 class="text-xl font-bold">Sample shipping address</h2>
    <p class="text-sm text-gray-500">Use the example details below. No payment or shipment will be made.</p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <UFormField v-for="field in fields" :key="field.key" :label="field.label">
        <UInput v-model="form[field.key]" required :maxlength="150" class="w-full" />
      </UFormField>
    </div>
    <UButton type="submit" block size="xl" :loading="processing" :disabled="processing">Place demo order</UButton>
  </form>
</template>
