<template>
  <div class="max-w-4xl mx-auto py-12">
    <div class="mb-12">
      <h1 class="text-5xl font-black text-gray-900 italic uppercase tracking-tighter mb-4">About Us</h1>
      <div class="h-1 w-20 bg-primary-500"/>
    </div>

    <div class="prose prose-lg max-w-none text-gray-600 space-y-8">
      <section>
        <h2 class="text-2xl font-bold text-gray-900 uppercase italic">Our Story</h2>
        <p>
          Founded in 2026, BoldburstGlasses was born from a simple mission: to provide world-class optics that don't compromise on style. We believe that eyewear is more than just a medical necessity—it's an expression of your personality.
        </p>
      </section>

      <section class="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
        <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 class="font-black text-xl mb-4 italic uppercase text-primary-600">Precision Engineering</h3>
          <p>Every pair of glasses we produce undergoes rigorous quality control to ensure your vision is perfectly clear.</p>
        </div>
        <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 class="font-black text-xl mb-4 italic uppercase text-primary-600">Modern Design</h3>
          <p>Our frames are handcrafted by artisans who blend traditional techniques with contemporary aesthetics.</p>
        </div>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-gray-900 uppercase italic">Our Commitment</h2>
        <p>
          We are committed to sustainability and ethical manufacturing. From the materials we source to the packaging we use, we strive to minimize our environmental footprint while maximizing the value we provide to our customers.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'About Us - BoldburstGlasses',
  meta: [
    { name: 'description', content: 'Learn more about BoldburstGlasses and our mission to provide premium eyewear.' }
  ]
})
</script>
