<template>
  <div>
    <!-- Category Hero Banner -->
    <div class="relative rounded-3xl overflow-hidden bg-gray-900 h-64 mb-12 shadow-xl group">
      <div class="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent opacity-80 z-10"></div>
      <img :src="categoryImages" :alt="slug" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700">
      <div class="relative z-20 h-full flex flex-col justify-center px-12 text-white">
        <UBadge color="primary" variant="solid" class="w-fit mb-3 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">Collection 2026</UBadge>
        <h1 class="text-5xl font-black italic tracking-tighter uppercase leading-none">{{ slug }}</h1>
        <p class="text-gray-300 mt-4 max-w-md font-medium text-sm leading-relaxed">
          Discover our curated selection of {{ slug }} eyewear. Designed for those who demand both style and performance.
        </p>
      </div>
    </div>

    <!-- Toolbar: Filters & Results Count -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm mb-12 border border-gray-100">
      <div class="flex items-center gap-2">
        <span class="text-xs font-black uppercase tracking-widest text-gray-400">Sort By:</span>
        <USelect 
          v-model="sort" 
          :items="['Popular', 'Price: Low to High', 'Price: High to Low']" 
          variant="none"
          class="font-bold text-gray-900 focus:ring-0"
        />
      </div>
      <div class="text-xs font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
        Showing <span class="text-primary-600">{{ products ? products.length : 0 }}</span> premium items
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-12">
      <div v-for="i in 8" :key="i" class="animate-pulse">
        <div class="aspect-square bg-gray-100 rounded-2xl mb-4"></div>
        <div class="h-6 bg-gray-100 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-gray-100 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Product Grid -->
    <div v-else-if="products && products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
      <div v-for="product in sortedProducts" :key="product.id" class="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
        <NuxtLink :to="`/product/${product.id}`" class="flex-grow">
          <div class="aspect-square bg-gray-50 rounded-xl mb-6 overflow-hidden relative border border-gray-100">
            <img 
              :src="product.images?.[0]?.url || 'https://placehold.co/400x400?text=BoldBurst'" 
              :alt="product.name" 
              class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            >
            <div v-if="product.price < 150" class="absolute top-4 left-4">
              <UBadge color="primary" variant="solid" size="xs" class="font-black uppercase tracking-tighter italic">Value</UBadge>
            </div>
            <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <UButton icon="i-heroicons-heart" color="neutral" variant="solid" size="xs" class="rounded-full shadow-md" />
            </div>
          </div>
          
          <div class="mb-4">
            <h3 class="font-black text-lg text-gray-900 italic tracking-tight uppercase truncate">{{ product.name }}</h3>
            <p class="text-gray-400 text-[10px] font-black tracking-widest uppercase mt-1">{{ slug }} collection</p>
          </div>
          
          <div class="flex justify-between items-center mt-auto">
            <span class="font-black text-xl text-primary-600 tracking-tighter">₹{{ (product.price * 91).toFixed(2) }}</span>
            <UButton 
              color="neutral" 
              variant="solid" 
              size="sm" 
              class="font-bold rounded-lg px-4 group-hover:bg-primary-600 group-hover:text-white transition-colors" 
              label="View" 
            />
          </div>
        </NuxtLink>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="text-center py-32 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-sm mb-6">
        <UIcon name="i-heroicons-magnifying-glass" class="w-10 h-10 text-gray-300" />
      </div>
      <h3 class="text-2xl font-black text-gray-900 italic uppercase tracking-tight">No items found</h3>
      <p class="text-gray-500 mt-2 max-w-xs mx-auto font-medium">We couldn't find any products in the {{ slug }} category at this moment.</p>
      <UButton to="/" variant="link" color="primary" class="mt-8 font-bold">Back to Home</UButton>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const config = useRuntimeConfig()
const slug = computed(() => route.params.slug)
const sort = ref('Popular')

// Category Images Mapping
const categoryImages = computed(() => {
  const images = {
    myopia: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=1200',
    sunglasses: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=1200',
    reading: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=1200',
    contacts: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&q=80&w=1200',
  }
  return images[slug.value] || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=1200'
})

// Fetch real data from backend
const { data: products, pending } = await useFetch(() => `/products/category/${slug.value}`, {
  baseURL: config.public.apiBase
})

// Sorting Logic
const sortedProducts = computed(() => {
  if (!products.value) return []
  const items = [...products.value]
  
  if (sort.value === 'Price: Low to High') {
    return items.sort((a, b) => a.price - b.price)
  } else if (sort.value === 'Price: High to Low') {
    return items.sort((a, b) => b.price - a.price)
  }
  return items // Default to Popular (which is the API order for now)
})

useHead({
  title: `${slug.value.charAt(0).toUpperCase() + slug.value.slice(1)} - Boldburst Glasses`,
  meta: [
    { name: 'description', content: `Explore our premium collection of ${slug.value} eyewear at Boldburst Glasses.` }
  ]
})
</script>