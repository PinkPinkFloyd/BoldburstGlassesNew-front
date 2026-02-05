<template>
  <div>
    <div class="mb-8">
      <h1 class="text-4xl font-bold capitalize">{{ slug }} Glasses</h1>
      <p class="text-gray-500 mt-2 italic">Premium quality and stylish designs for your vision needs.</p>
    </div>

    <!-- Filters & Sorting (Simple Placeholder) -->
    <div class="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-8 border border-gray-100">
      <div class="flex gap-4">
        <USelect v-model="sort" :options="['Popular', 'Price: Low to High', 'Price: High to Low']" />
      </div>
      <p class="text-sm text-gray-500">{{ products.length }} items found</p>
    </div>

    <!-- Product Grid -->
    <div v-if="products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <div v-for="product in products" :key="product.id" class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 group">
        <NuxtLink :to="`/product/${product.id}`">
          <div class="aspect-square bg-gray-50 relative overflow-hidden">
            <img :src="product.image" :alt="product.name" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
          </div>
          <div class="p-4">
            <h3 class="font-bold mb-1 text-gray-900">{{ product.name }}</h3>
            <div class="flex justify-between items-center mt-4">
              <span class="text-xl font-bold text-primary-600">₹{{ (product.price * 91).toFixed(2) }}</span>
              <div class="flex gap-1">
                <div v-for="color in product.colors" :key="color" :class="`w-3 h-3 rounded-full bg-${color}-500 border border-gray-200`"></div>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
    
    <div v-else class="text-center py-24">
      <UIcon name="i-heroicons-magnifying-glass" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-xl font-bold text-gray-900">No products found</h3>
      <p class="text-gray-500">Try adjusting your filters or check back later.</p>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const slug = computed(() => route.params.slug)
const sort = ref('Popular')

// Mock Data for preview (Replace with useFetch from backend later)
const products = ref([
  { id: 1, name: 'Aero Slim', price: 145, image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=400', colors: ['black', 'blue'] },
  { id: 2, name: 'Retro Bold', price: 189, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=400', colors: ['brown', 'gold'] },
  { id: 3, name: 'Minimalist X', price: 120, image: 'https://images.unsplash.com/photo-1511499767390-a7335958beba?q=80&w=400', colors: ['gray'] },
  { id: 4, name: 'Office Pro', price: 155, image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=400', colors: ['black', 'silver'] },
])
</script>
