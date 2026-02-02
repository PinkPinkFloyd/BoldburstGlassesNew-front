<template>
  <div v-if="product">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Product Gallery -->
      <div class="space-y-4">
        <div class="aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
          <img :src="selectedImage" :alt="product.name" class="w-full h-full object-cover">
        </div>
        <div class="grid grid-cols-4 gap-4" v-if="product.images && product.images.length > 1">
          <button v-for="(img, idx) in product.images" :key="idx" @click="selectedImage = img.url"
            class="aspect-square rounded-lg overflow-hidden border-2 transition"
            :class="selectedImage === img.url ? 'border-primary-600' : 'border-transparent'">
            <img :src="img.url" class="w-full h-full object-cover">
          </button>
        </div>
      </div>

      <!-- Product Info -->
      <div class="flex flex-col">
        <nav class="flex mb-4 text-sm text-gray-500">
          <NuxtLink to="/" class="hover:text-primary-600">Home</NuxtLink>
          <span class="mx-2">/</span>
          <NuxtLink :to="`/category/${product.category?.name?.toLowerCase()}`"
            class="hover:text-primary-600 capitalize">
            {{ product.category?.name }}
          </NuxtLink>
        </nav>

        <h1 class="text-4xl font-bold text-gray-900 mb-2 italic tracking-tight">{{ product.name }}</h1>
        <p class="text-2xl font-bold text-primary-600 mb-6">₹{{ product.price * 91 }}</p>

        <div class="prose prose-sm text-gray-600 mb-8">
          <p>{{ product.description }}</p>
        </div>

        <!-- Variants -->
        <div class="space-y-6 mb-8">
          <!-- Color Selection (derived from unique colors in variants) -->
          <div>
            <span class="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Frame Color</span>
            <div class="flex gap-3">
              <button v-for="color in uniqueColors" :key="color" @click="selectedColor = color"
                class="px-4 py-2 rounded-full border text-sm font-medium transition"
                :class="selectedColor === color ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-900'">
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
          <UButton color="primary" size="xl" class="flex-1 font-bold h-14 justify-center" @click="addToCart">
            Add to Cart
          </UButton>
          <UButton variant="outline" color="gray" size="xl" icon="i-heroicons-heart" class="h-14 w-14 justify-center" />
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
    <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 animate-spin text-primary-600 mx-auto" />
    <p class="mt-4 text-gray-500">Loading product...</p>
  </div>
</template>

<script setup>
const route = useRoute()
const config = useRuntimeConfig()
const toast = useToast()
const cart = useCartStore()

// Fetch product data
const { data: product } = await useFetch(() => `/products/${route.params.id}`, {
  baseURL: config.public.apiBase
}).catch(e => {
  console.log(e);
})
const selectedProV = ref(null)
// Reactive State
const selectedImage = ref('')
const selectedColor = ref('')
const selectedLens = ref('')

// Initialize selection when product loads
watchEffect(() => {
  if (product.value) {
    if (!selectedImage.value && product.value.images?.length) {
      selectedImage.value = product.value.images[0].url
    }
    if (!selectedColor.value && product.value.variants?.length) {
      selectedColor.value = product.value.variants[0].color
      selectedLens.value = product.value.variants[0].lensType
      selectedProV.value = product.value.variants[0]
    }
  }
})

// Computed: Unique Colors
const uniqueColors = computed(() => {
  if (!product.value?.variants) return []
  return [...new Set(product.value.variants.map(v => v.color))]
})

// Computed: Lenses available for selected color
const availableLenses = computed(() => {
  if (!product.value?.variants || !selectedColor.value) return []
  return product.value.variants
    .filter(v => v.color === selectedColor.value)
    .map(v => v.lensType)
})

// Update selected lens if current selection is not valid for new color
watch(selectedColor, (newColor) => {
  const valid = availableLenses.value.includes(selectedLens.value)
  if (!valid && availableLenses.value.length > 0) {
    selectedLens.value = availableLenses.value[0]
    selectedProV.value = product.value.variants.find(v => v.color === newColor && v.lensType === selectedLens.value)
    console.log(selectedProV.value);
    
  }
})
const { $api } = useNuxtApp()
const addToCart = async () => {
  const obj = {
    // id: product.value.id,
    // name: product.value.name,
    // price: Number(product.value.price), // Ensure number
    // selectedColor: selectedColor.value,
    // selectedLens: selectedLens.value,
    productVariantId: selectedProV.value.id,
    quantity: 1
  }

  try {
   await $api('/cart/add', {
      method: 'POST',
      body: obj
    })
    cart.addToCart(obj)
    toast.add({
      title: 'Added to cart!',
      description: `${product.value.name} has been added to your shopping bag.`,
      icon: 'i-heroicons-check-circle',
      color: 'success'
    })
  } catch (e) {
    console.log(e);
    
    toast.add({
      title: 'Error',
      description: 'Failed to add to cart. Please Login or try again later.',
      icon: 'i-heroicons-x-circle',
      color: 'error'
    })
  }


}
</script>