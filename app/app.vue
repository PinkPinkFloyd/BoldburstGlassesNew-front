<template>
  <UApp>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <!-- Navbar component -->
      <Navbar />

      <!-- Main Content Area -->
      <main class="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <NuxtPage />
      </main>

      <!-- Footer -->
      <footer class="border-t border-gray-200 dark:border-gray-800 py-8 bg-white dark:bg-gray-900 mt-auto">
        <div class="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p>&copy; 2026 BoldburstGlasses. All rights reserved.</p>
          <p class="text-xs mt-2 italic text-gray-400">Premium eyewear for your clear vision.</p>
        </div>
      </footer>
    </div>
  </UApp>
</template>

<script setup>
const auth = useAuthStore()

// Try to restore user session on app start
if (auth.token && !auth.user) {
  await auth.fetchUser()
}

// Global head settings
useHead({
  title: 'BoldburstGlasses - Premium Eyewear Store',
  meta: [
    { name: 'description', content: 'Buy high-quality Myopia, Sunglasses, Reading, and Contacts online at BoldburstGlasses.' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})
</script>

<style>
body {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>