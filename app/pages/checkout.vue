<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-8 text-center">Checkout</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
      <!-- Shipping Form -->
      <div>
        <h2 class="text-xl font-bold mb-6">Shipping Address</h2>
        <form class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="First Name">
              <UInput v-model="form.firstName" class="w-full" />
            </UFormField>
            <UFormField label="Last Name">
              <UInput v-model="form.lastName" class="w-full" />
            </UFormField>
          </div>
          <UFormField label="Address">
            <UInput v-model="form.address" placeholder="123 Main St" class="w-full" />
          </UFormField>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="City">
              <UInput v-model="form.city" class="w-full" />
            </UFormField>
            <UFormField label="Postal Code">
              <UInput v-model="form.zip" class="w-full" />
            </UFormField>
          </div>
          <UFormField label="Country">
            <USelect v-model="form.country" :items="['United States', 'Canada', 'United Kingdom']" class="w-full" />
          </UFormField>
        </form>

        <h2 class="text-xl font-bold mt-8 mb-6">Payment Method</h2>
        <div class="p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm">
          <UIcon name="i-heroicons-credit-card" class="w-5 h-5 inline-block mr-2" />
          Payment Gateway Simulation (No real charge)
        </div>
      </div>

      <!-- Order Review -->
      <div class="bg-gray-50 p-8 rounded-xl h-fit">
        <h2 class="text-xl font-bold mb-6">Order Review</h2>
        <div class="space-y-4 mb-6">
           <div v-for="item in cart.items" :key="item.id" class="flex justify-between text-sm">
             <span>{{ item.quantity }}x {{ item.name }} <span class="text-gray-500">({{ item.selectedColor }})</span></span>
             <span class="font-medium">${{ (item.price * item.quantity).toFixed(2) }}</span>
           </div>
        </div>
        
        <div class="border-t border-gray-200 pt-4 space-y-2">
          <div class="flex justify-between">
            <span>Subtotal</span>
            <span>${{ cart.totalPrice.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between font-bold text-lg mt-4">
            <span>Total</span>
            <span>${{ (cart.totalPrice * 1.08).toFixed(2) }}</span>
          </div>
        </div>

        <UButton 
          block 
          size="xl" 
          color="black" 
          class="mt-8 font-bold w-full justify-center" 
          :loading="processing" 
          @click="handleCheckout"
        >
          Pay ${{ (cart.totalPrice * 1.08).toFixed(2) }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
const cart = useCartStore()
const auth = useAuthStore()
const router = useRouter()
const toast = useToast()
const config = useRuntimeConfig()

const form = reactive({
  firstName: 'John',
  lastName: 'Doe',
  address: '123 Main St',
  city: 'New York',
  zip: '10001',
  country: 'United States'
})

const processing = ref(false)

const handleCheckout = async () => {
  if (cart.items.length === 0) return

  // Basic validation check
  if (!auth.user) {
    toast.add({ title: 'Please login first', color: 'error' })
    router.push('/login')
    return
  }

  processing.value = true
  
  try {
    const orderData = {
      userId: auth.user.id, // Ensure user is logged in
      totalAmount: cart.totalPrice * 1.08,
      shippingAddress: form,
      items: cart.items.map(item => ({
        productVariantId: 1, // Ideally fetch real variant ID from product selection
        quantity: item.quantity,
        price: item.price
      }))
    }

    await $fetch('/orders', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: orderData
    })

    cart.clearCart()
    toast.add({
      title: 'Order Placed Successfully!',
      description: 'Check your email for confirmation.',
      icon: 'i-heroicons-check-badge',
      color: 'success',
      timeout: 5000
    })
    router.push('/orders')
  } catch (e) {
    toast.add({ title: 'Order Failed', description: 'Please try again.', color: 'error' })
  } finally {
    processing.value = false
  }
}
</script>
