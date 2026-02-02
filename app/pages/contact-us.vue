<template>
  <div class="max-w-4xl mx-auto py-12 px-4">
    <div class="text-center mb-16">
      <h1 class="text-5xl font-black text-gray-900 italic uppercase tracking-tighter mb-4">Contact Us</h1>
      <div class="h-1.5 w-24 bg-primary-500 mx-auto"></div>
      <p class="text-gray-500 mt-6 text-lg">Have questions? We'd love to hear from you.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Email -->
      <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition duration-300">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 text-primary-600 mb-6">
          <UIcon name="i-heroicons-envelope" class="w-6 h-6" />
        </div>
        <h3 class="font-bold text-gray-900 mb-2 uppercase tracking-widest text-sm">Email Us</h3>
        <p class="text-gray-600 break-all">boldburst@gmail.com</p>
      </div>

      <!-- Phone -->
      <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition duration-300">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 text-primary-600 mb-6">
          <UIcon name="i-heroicons-phone" class="w-6 h-6" />
        </div>
        <h3 class="font-bold text-gray-900 mb-2 uppercase tracking-widest text-sm">Call Us</h3>
        <p class="text-gray-600">+91 9896187611</p>
      </div>

      <!-- Address -->
      <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition duration-300">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 text-primary-600 mb-6">
          <UIcon name="i-heroicons-map-pin" class="w-6 h-6" />
        </div>
        <h3 class="font-bold text-gray-900 mb-2 uppercase tracking-widest text-sm">Visit Us</h3>
        <p class="text-gray-600 text-sm leading-relaxed">
          FIRST FLOOR H-119, SECTOR-63, NOIDA, Uttar Pradesh
        </p>
      </div>
    </div>

    <!-- Map Section -->
    <div class="mt-12 rounded-3xl overflow-hidden h-96 bg-gray-100 border border-gray-200 shadow-inner relative group">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.56215160867!2d77.38714047533454!3d28.612911975674393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce579469796e9%3A0xc660d2d3a1f9e984!2sH-119%2C%20H%20Block%2C%20Sector%2063%2C%20Noida%2C%20Uttar%20Pradesh%20201301!5e0!3m2!1sen!2sin!4v1706170000000!5m2!1sen!2sin" 
        width="100%" 
        height="100%" 
        style="border:0;" 
        allowfullscreen="" 
        loading="lazy" 
        referrerpolicy="no-referrer-when-downgrade"
        class="grayscale hover:grayscale-0 transition-all duration-700"
      ></iframe>
      <div class="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200 shadow-sm pointer-events-none">
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Our Studio</p>
        <p class="text-xs font-black text-gray-900 italic">SECTOR-63, NOIDA</p>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Contact Us - Boldburst Glasses',
  meta: [
    { name: 'description', content: 'Get in touch with Boldburst Glasses for any inquiries.' }
  ]
})
</script>
