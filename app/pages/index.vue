<template>
  <div>
    <!-- Hero Section -->
    <div class="relative rounded-3xl overflow-hidden bg-gray-900 h-[500px] mb-16 shadow-2xl">
      <div class="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent opacity-70 z-10"></div>
      <img src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=1200" alt="New Collection" class="absolute inset-0 w-full h-full object-cover">
      <div class="relative z-20 h-full flex flex-col justify-center px-16 text-white">
        <UBadge color="primary" variant="solid" class="w-fit mb-4 px-3 py-1 text-xs font-bold uppercase tracking-widest">New Season 2026</UBadge>
        <h1 class="text-6xl font-black mb-6 italic tracking-tighter leading-none">BOLD BURST.<br>CLEAR VISION.</h1>
        <p class="text-xl mb-10 max-w-lg text-gray-200 leading-relaxed font-light">
          Experience world-class optics with our premium collection of handcrafted frames. 
          Designed for style, engineered for precision.
        </p>
        <div class="flex gap-4">
          <UButton color="neutral" variant="solid" size="xl" to="/category/sunglasses" class="font-bold px-8">
            Shop Sunglasses
          </UButton>
          <UButton color="neutral" variant="outline" size="xl" to="/category/myopia" class="font-bold px-8">
            Browse Myopia
          </UButton>
        </div>
      </div>
    </div>

    <!-- Category Grid -->
    <section class="mb-20">
      <div class="flex items-end justify-between mb-10">
        <div>
          <h2 class="text-4xl font-black text-gray-900 italic uppercase">Categories</h2>
          <div class="h-1 w-20 bg-primary-500 mt-2"></div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <NuxtLink v-for="cat in categories" :key="cat.name" :to="cat.path" class="group relative rounded-2xl overflow-hidden h-80 bg-gray-200 shadow-lg">
          <img :src="cat.image" :alt="cat.name" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-in-out">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
            <span class="text-white text-3xl font-black italic uppercase tracking-tight">{{ cat.name }}</span>
            <span class="text-gray-300 text-sm mt-1 group-hover:translate-x-2 transition-transform duration-300">Explore Collection &rarr;</span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Featured Products (Real Data) -->
    <section class="mb-20">
      <div class="flex justify-between items-end mb-10">
        <div>
          <h2 class="text-4xl font-black text-gray-900 italic uppercase tracking-tight">Best Sellers</h2>
          <div class="h-1 w-20 bg-primary-500 mt-2"></div>
        </div>
        <NuxtLink to="/category/myopia" class="text-primary-600 font-bold hover:underline flex items-center gap-2 uppercase text-sm tracking-widest">
          View All Products <UIcon name="i-heroicons-arrow-right" />
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div v-for="i in 4" :key="i" class="animate-pulse">
          <div class="aspect-square bg-gray-200 rounded-2xl mb-4"></div>
          <div class="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>

      <!-- Real Products Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div v-for="product in featuredProducts" :key="product.id" class="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
          <NuxtLink :to="`/product/${product.id}`">
            <div class="aspect-square bg-gray-50 rounded-xl mb-6 overflow-hidden relative border border-gray-100">
              <img :src="product.images?.[0]?.url || 'https://placehold.co/400x400'" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
              <div class="absolute top-4 right-4">
                <UButton icon="i-heroicons-heart" color="neutral" variant="solid" size="xs" class="rounded-full shadow-md" />
              </div>
            </div>
            <h3 class="font-black text-xl mb-1 text-gray-900 italic tracking-tight uppercase truncate">{{ product.name }}</h3>
            <p class="text-gray-500 mb-4 text-xs font-medium tracking-widest uppercase">Special Collection</p>
            <div class="flex justify-between items-center">
              <span class="font-black text-2xl text-primary-600 tracking-tighter">₹{{ (product.price * 91).toFixed(2) }}</span>
              <UButton color="neutral" variant="solid" size="md" class="font-bold rounded-lg px-4" label="Details" />
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()

const categories = [
  { name: 'Myopia', path: '/category/myopia', image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800' },
  { name: 'Sunglasses', path: '/category/sunglasses', image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=800' },
  { name: 'Reading', path: '/category/reading', image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=800' },
  { name: 'Contacts', path: '/category/contacts', image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&q=80&w=800' },
]

// Fetch real products for featured section
const { data: products, pending } = await useFetch('/products', {
  baseURL: config.public.apiBase
})

// Take first 4 products for featured section
const featuredProducts = computed(() => {
  return products.value ? products.value.slice(0, 4) : []
})
</script>
