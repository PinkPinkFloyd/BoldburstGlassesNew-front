<script setup lang="ts">
import type { Product } from '~/types/shop'
const route = useRoute()
const toast = useToast()
const cart = useCartStore()
const { $api } = useNuxtApp()
const { data: product, pending } = await useAsyncData(() => 'product-' + String(route.params.id), () => $api<Product>('/products/' + String(route.params.id)))
const selectedImage = ref('')
const selectedColor = ref('')
const selectedLens = ref('')
const adding = ref(false)
watch(product, value => {
  selectedImage.value = value?.images[0]?.url || ''
  selectedColor.value = value?.variants[0]?.color || ''
  selectedLens.value = value?.variants[0]?.lensType || ''
}, { immediate: true })
const uniqueColors = computed(() => [...new Set(product.value?.variants.map(v => v.color) || [])])
const availableLenses = computed(() => product.value?.variants.filter(v => v.color === selectedColor.value).map(v => v.lensType) || [])
watch(selectedColor, () => {
  if (!availableLenses.value.includes(selectedLens.value)) selectedLens.value = availableLenses.value[0] || ''
})
const selectedVariant = computed(() => product.value?.variants.find(v => v.color === selectedColor.value && v.lensType === selectedLens.value))
async function addToCart() {
  if (!selectedVariant.value || adding.value) return
  adding.value = true
  try {
    await cart.addToCart(selectedVariant.value.id)
    toast.add({ title: 'Added to cart!', color: 'success' })
  } catch (error) {
    toast.add({ title: 'Unable to add item', description: error instanceof Error ? error.message : 'Please try again', color: 'error' })
  } finally { adding.value = false }
}
</script>

<template>
  <div v-if="product">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Product Gallery -->
      <div class="space-y-4">
        <div class="aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
          <img :src="selectedImage" :alt="product.name" class="w-full h-full object-cover">
        </div>
        <div v-if="product.images && product.images.length > 1" class="grid grid-cols-4 gap-4">
          <button
v-for="(img, idx) in product.images" :key="idx" class="aspect-square rounded-lg overflow-hidden border-2 transition"
            :class="selectedImage === img.url ? 'border-primary-600' : 'border-transparent'"
            @click="selectedImage = img.url">
            <img :src="img.url" class="w-full h-full object-cover">
          </button>
        </div>
      </div>

      <!-- Product Info -->
      <div class="flex flex-col">
        <nav class="flex mb-4 text-sm text-gray-500">
          <NuxtLink to="/" class="hover:text-primary-600">Home</NuxtLink>
          <span class="mx-2">/</span>
          <NuxtLink
:to="`/category/${product.category?.name?.toLowerCase()}`"
            class="hover:text-primary-600 capitalize">
            {{ product.category?.name }}
          </NuxtLink>
        </nav>

        <h1 class="text-4xl font-bold text-gray-900 mb-2 italic tracking-tight">{{ product.name }}</h1>
        <p class="text-2xl font-bold text-primary-600 mb-6">₹{{ (product.price * 91).toFixed(2) }}</p>

        <div class="prose prose-sm text-gray-600 mb-8">
          <p>{{ product.description }}</p>
        </div>

        <!-- Variants -->
        <div class="space-y-6 mb-8">
          <!-- Color Selection (derived from unique colors in variants) -->
          <div>
            <span class="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Frame Color</span>
            <div class="flex flex-wrap gap-3">
              <button
v-for="color in uniqueColors" :key="color" class="px-4 py-2 rounded-full border text-sm font-medium transition"
                :class="selectedColor === color ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-900'"
                @click="selectedColor = color">
                {{ color }}
              </button>
            </div>
          </div>

          <!-- Lens Type Selection (filtered by selected color) -->
          <div>
            <span class="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Lens Type</span>
            <USelect v-model="selectedLens" :items="availableLenses" class="max-w-xs" />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4 mt-auto">
          <UButton color="primary" size="xl" class="flex-1 font-bold h-14 justify-center" :loading="adding" :disabled="!selectedVariant" @click="addToCart">
            Add to Cart
          </UButton>
          <UButton variant="outline" color="neutral" size="xl" icon="i-heroicons-heart" class="h-14 w-14 justify-center" />
        </div>

        <!-- Extra Info -->
        <div class="mt-8 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm">
          <div class="flex items-center gap-2 text-gray-600">
            <UIcon name="i-heroicons-truck" class="w-5 h-5" />
            <span>Free Shipping</span>
          </div>
          <div class="flex items-center gap-2 text-gray-600">
            <UIcon name="i-heroicons-arrow-path" class="w-5 h-5" />
            <span>30-Day Returns</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="py-24 text-center">
      <p class="text-xl font-bold">{{ pending ? 'Loading product…' : 'Product not found' }}</p>
      <UButton to="/" class="mt-6">Browse products</UButton>
    </div>
</template>
