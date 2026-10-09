<script setup lang="ts">
import type { CartEntry } from '~/types/shop'
import { formatRupees, rupeeCents } from '~/utils/money'
defineProps<{ items: CartEntry[]; busy: boolean }>()
defineEmits<{ quantity: [item: CartEntry, quantity: number]; remove: [id: number] }>()
</script>

<template>
  <div class="space-y-6">
    <article v-for="item in items" :key="item.id" class="flex gap-4 p-4 bg-white rounded-xl border border-gray-100">
      <NuxtLink :to="'/product/' + item.product.id" class="w-20 h-20 sm:w-24 sm:h-24 shrink-0 overflow-hidden rounded-lg">
        <img :src="item.product.images[0]?.url" :alt="item.product.name" class="w-full h-full object-cover">
      </NuxtLink>
      <div class="min-w-0 flex-1">
        <h2 class="font-bold text-gray-900">{{ item.product.name }}</h2>
        <p class="text-sm text-gray-500">{{ item.productVariant.color }} / {{ item.productVariant.lensType }}</p>
        <p class="font-bold mt-2">{{ formatRupees(rupeeCents(item.product.price) * item.quantity) }}</p>
        <div class="flex flex-wrap justify-between items-center gap-2 mt-3">
          <div class="flex items-center gap-3">
            <UButton aria-label="Decrease quantity" icon="i-heroicons-minus" size="xs" variant="outline" :disabled="busy" @click="$emit('quantity', item, item.quantity - 1)" />
            <span aria-label="Quantity">{{ item.quantity }}</span>
            <UButton aria-label="Increase quantity" icon="i-heroicons-plus" size="xs" variant="outline" :disabled="busy || item.quantity >= 99" @click="$emit('quantity', item, item.quantity + 1)" />
          </div>
          <UButton color="error" variant="ghost" size="sm" :disabled="busy" @click="$emit('remove', item.id)">Remove</UButton>
        </div>
      </div>
    </article>
  </div>
</template>
