<template>
  <nav class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center">
          <NuxtLink to="/" class="text-2xl font-black italic tracking-tighter text-gray-900 dark:text-white uppercase">
            Boldburst<span class="text-primary-600">Glasses</span>
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex space-x-8 uppercase text-xs font-bold tracking-widest">
          <NuxtLink v-for="cat in categories" :key="cat.name" :to="cat.path" class="text-gray-600 dark:text-gray-300 hover:text-primary-600 transition">
            {{ cat.name }}
          </NuxtLink>
          <NuxtLink to="/contact-us" class="text-gray-600 dark:text-gray-300 hover:text-primary-600 transition">
            Contact Us
          </NuxtLink>
        </div>

        <!-- Right Side: Cart & User -->
        <div class="flex items-center space-x-6">
          <NuxtLink to="/cart" class="p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 relative">
            <UIcon name="i-heroicons-shopping-bag" class="w-6 h-6" />
            <span v-if="cart.totalItems > 0" class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold leading-none text-white bg-primary-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
              {{ cart.totalItems }}
            </span>
          </NuxtLink>
          <NuxtLink :to="auth.isAuthenticated ? '/profile' : '/login'" class="p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600">
            <UIcon name="i-heroicons-user" class="w-6 h-6" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
const cart = useCartStore()
const auth = useAuthStore()
const categories = [
  { name: 'Myopia', path: '/category/myopia' },
  { name: 'Sunglasses', path: '/category/sunglasses' },
  { name: 'Reading', path: '/category/reading' },
  { name: 'Contacts', path: '/category/contacts' },
]
</script>
