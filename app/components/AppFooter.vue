<template>
  <footer class="border-t border-gray-200 dark:border-gray-800 py-12 bg-white dark:bg-gray-900 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <!-- Brand Section -->
        <div class="col-span-1 md:col-span-2">
          <NuxtLink to="/" class="flex items-center gap-2 mb-4">
            <span class="text-xl font-black italic tracking-tighter uppercase">Boldburst</span>
          </NuxtLink>
          <p class="text-gray-500 max-w-sm mb-4">
            Premium eyewear designed for style and engineered for precision. Experience world-class optics with our handcrafted collection.
          </p>
        </div>

        <!-- Shop Section -->
        <div>
          <h3 class="font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Shop</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/category/myopia" class="text-gray-500 hover:text-primary-600">Myopia</NuxtLink></li>
            <li><NuxtLink to="/category/sunglasses" class="text-gray-500 hover:text-primary-600">Sunglasses</NuxtLink></li>
            <li><NuxtLink to="/category/reading" class="text-gray-500 hover:text-primary-600">Reading</NuxtLink></li>
            <li><NuxtLink to="/category/contacts" class="text-gray-500 hover:text-primary-600">Contacts</NuxtLink></li>
          </ul>
        </div>

        <!-- Company Section -->
        <div>
          <h3 class="font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Support</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/about-us" class="text-gray-500 hover:text-primary-600">About Us</NuxtLink></li>
            <li><NuxtLink to="/contact-us" class="text-gray-500 hover:text-primary-600">Contact Us</NuxtLink></li>
            <li><NuxtLink to="/privacy-policy" class="text-gray-500 hover:text-primary-600">Privacy Policy</NuxtLink></li>
            <li><NuxtLink to="/terms-and-conditions" class="text-gray-500 hover:text-primary-600">Terms & Conditions</NuxtLink></li>
            <li><NuxtLink to="/refund-policy" class="text-gray-500 hover:text-primary-600">Refund Policy</NuxtLink></li>
          </ul>
        </div>
      </div>
      
      <div class="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-gray-400 text-sm">&copy; 2026 BoldburstGlasses. All rights reserved.</p>
        <p class="text-xs italic text-gray-400">Premium eyewear for your clear vision.</p>
      </div>
    </div>
  </footer>
</template>
