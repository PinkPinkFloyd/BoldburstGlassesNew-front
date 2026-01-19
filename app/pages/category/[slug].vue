<template>
  <div>
    <div class="mb-8">
      <h1 class="text-4xl font-bold capitalize">{{ slug }} Glasses</h1>
      <p class="text-gray-500 mt-2 italic">Premium quality and stylish designs for your vision needs.</p>
    </div>

    <!-- Filters & Sorting -->
    <div class="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-8 border border-gray-100">
      <div class="flex gap-4">
        <USelect v-model="sort" :items="['Popular', 'Price: Low to High', 'Price: High to Low']" />
      </div>
      <p class="text-sm text-gray-500">{{ products ? products.length : 0 }} items found</p>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="py-24 flex justify-center">
      <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 animate-spin text-primary-600" />
    </div>

    <!-- Product Grid -->
    <div v-else-if="products && products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <div v-for="product in products" :key="product.id" class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 group">
        <NuxtLink :to="`/product/${product.id}`">
          <div class="aspect-square bg-gray-50 relative overflow-hidden">
            <!-- Handle image safely: check if images array exists and has length -->
            <img 
              :src="product.images?.[0]?.url || 'https://placehold.co/400x400?text=No+Image'" 
              :alt="product.name" 
              class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            >
          </div>
          <div class="p-4">
            <h3 class="font-bold mb-1 text-gray-900 truncate">{{ product.name }}</h3>
            <div class="flex justify-between items-center mt-4">
              <span class="text-xl font-bold text-primary-600">${{ product.price }}</span>
              <!-- Show variant colors preview -->
              <div class="flex gap-1">
                <div v-if="product.variants?.length" class="text-xs text-gray-400">
                  {{ product.variants.length }} options
                </div>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="text-center py-24">
      <UIcon name="i-heroicons-magnifying-glass" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-xl font-bold text-gray-900">No products found</h3>
      <p class="text-gray-500">We couldn't find any glasses in this category.</p>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const config = useRuntimeConfig()
const slug = computed(() => route.params.slug)
const sort = ref('Popular')

// Fetch real data from backend
const { data: products, pending } = await useFetch(() => `/products/category/${slug.value}`, {
  baseURL: config.public.apiBase
})
</script>