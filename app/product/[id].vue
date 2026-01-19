<template>
  <div v-if="product">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Product Gallery -->
      <div class="space-y-4">
        <div class="aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
          <img :src="selectedImage || product.images[0]" :alt="product.name" class="w-full h-full object-cover">
        </div>
        <div class="grid grid-cols-4 gap-4">
          <button 
            v-for="(img, idx) in product.images" 
            :key="idx" 
            @click="selectedImage = img"
            class="aspect-square rounded-lg overflow-hidden border-2 transition"
            :class="selectedImage === img ? 'border-primary-600' : 'border-transparent'"
          >
            <img :src="img" class="w-full h-full object-cover">
          </button>
        </div>
      </div>

      <!-- Product Info -->
      <div class="flex flex-col">
        <nav class="flex mb-4 text-sm text-gray-500">
          <NuxtLink to="/" class="hover:text-primary-600">Home</NuxtLink>
          <span class="mx-2">/</span>
          <span class="capitalize">{{ product.category }}</span>
        </nav>
        
        <h1 class="text-4xl font-bold text-gray-900 mb-2 italic tracking-tight">{{ product.name }}</h1>
        <p class="text-2xl font-bold text-primary-600 mb-6">${{ product.price }}</p>
        
        <div class="prose prose-sm text-gray-600 mb-8">
          <p>{{ product.description }}</p>
        </div>

        <!-- Variants -->
        <div class="space-y-6 mb-8">
          <!-- Color Selection -->
          <div>
            <span class="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Frame Color</span>
            <div class="flex gap-3">
              <button 
                v-for="color in product.variants.colors" 
                :key="color.id"
                @click="selectedColor = color.id"
                class="px-4 py-2 rounded-full border text-sm font-medium transition"
                :class="selectedColor === color.id ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-900'"
              >
                {{ color.name }}
              </button>
            </div>
          </div>

          <!-- Lens Type Selection -->
          <div>
            <span class="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Lens Type</span>
            <USelect 
              v-model="selectedLens" 
              :options="product.variants.lenses" 
              option-attribute="name"
              value-attribute="id"
              class="max-w-xs"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4 mt-auto">
          <UButton 
            color="black" 
            size="xl" 
            class="flex-1 font-bold h-14 justify-center" 
            @click="addToCart"
          >
            Add to Cart
          </UButton>
          <UButton 
            variant="outline" 
            color="gray" 
            size="xl" 
            icon="i-heroicons-heart" 
            class="h-14 w-14 justify-center"
          />
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
</template>

<script setup>
const route = useRoute()
const toast = useToast()

// Mock product data
const product = {
  id: route.params.id,
  name: 'Aero Slim Titanium',
  category: 'myopia',
  price: 145.00,
  description: 'Ultra-lightweight titanium frames designed for maximum comfort and durability. The Aero Slim features a minimalist design that complements any face shape, perfect for daily wear.',
  images: [
    'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=800',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800',
    'https://images.unsplash.com/photo-1511499767390-a7335958beba?q=80&w=800'
  ],
  variants: {
    colors: [
      { id: 'matte-black', name: 'Matte Black' },
      { id: 'gunmetal', name: 'Gunmetal' },
      { id: 'rose-gold', name: 'Rose Gold' }
    ],
    lenses: [
      { id: 'standard', name: 'Standard Clear' },
      { id: 'blue-light', name: 'Blue Light Blocking' },
      { id: 'photochromic', name: 'Photochromic (Transition)' }
    ]
  }
}

const selectedImage = ref(product.images[0])
const selectedColor = ref(product.variants.colors[0].id)
const selectedLens = ref(product.variants.lenses[0].id)

const addToCart = () => {
  toast.add({
    title: 'Added to cart!',
    description: `${product.name} has been added to your shopping bag.`,
    icon: 'i-heroicons-check-circle',
    color: 'green'
  })
}
</script>
