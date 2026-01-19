<template>
  
  <div>
    <h1 class="text-3xl font-bold mb-8">Shopping Cart</h1>
    <USkeleton class="h-100 w-full" v-if="loading" />
    <div v-if="cart.items.length > 0 && !loading" class="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <!-- Cart Items List -->
      <div class="lg:col-span-2 space-y-6">
        <div v-for="item in cart.items" :key="item.id"
          class="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <div class="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <img :src="item.image" :alt="item.name" class="w-full h-full object-cover">
          </div>
          <div class="flex-1 flex flex-col justify-between">
            <div class="flex justify-between">
              <div>
                <h3 class="font-bold text-gray-900">{{ item.name }}</h3>
                <p class="text-sm text-gray-500 capitalize">{{ item.selectedColor }} Frame, {{ item.selectedLens }} Lens
                </p>
              </div>
              <p class="font-bold text-gray-900">${{ item.price * item.quantity }}</p>
            </div>

            <div class="flex justify-between items-center mt-4">
              <div class="flex items-center space-x-2">
                <UButton icon="i-heroicons-minus-20-solid" size="xs" variant="ghost"
                  @click="item.quantity > 1 ? item.quantity-- : removeCart(item)" />
                <span class="text-sm font-medium w-8 text-center">{{ item.quantity }}</span>
                <UButton icon="i-heroicons-plus-20-solid" size="xs" variant="ghost" @click="item.quantity++" />
              </div>
              <UButton icon="i-heroicons-trash" size="xs" color="red" variant="ghost" @click="removeCart(item)"
                label="Remove" />
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
          <h2 class="text-xl font-bold mb-6">Order Summary</h2>
          <div class="space-y-4 mb-6">
            <div class="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${{ cart.totalPrice.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Tax (Est.)</span>
              <span>${{ (cart.totalPrice * 0.08).toFixed(2) }}</span>
            </div>
            <div class="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${{ (cart.totalPrice * 1.08).toFixed(2) }}</span>
            </div>
          </div>
          <UButton to="/checkout" block size="xl" color="primary" class="font-bold">Proceed to Checkout</UButton>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="cart.items.length == 0 && !loading" class="text-center py-24">
      
      <div class="inline-flex justify-center items-center w-24 h-24 rounded-full bg-gray-100 mb-6">
        <UIcon name="i-heroicons-shopping-bag" class="w-10 h-10 text-gray-400" />
      </div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
      <p class="text-gray-500 mb-8">Looks like you haven't added any glasses yet.</p>
      <UButton to="/" size="xl" color="primary">Start Shopping</UButton>
    </div>
  </div>
  
</template>

<script setup>
const cart = useCartStore()
const toast  = useToast()
onMounted(() => {
  getCats()
})
const loading = ref(true)
const { $api } = useNuxtApp()
const getCats = async() => {
  cart.clearCart()
  try {
    let data = await  $api('/cart', {
      method: 'GET',
    })
    // cart.value = data
    for (let item of data.items) {
        let params = {
          id: item.product.id,
          cartItemId: item.id,
          name: item.product.name,
          price: Number(item.product.price), // Ensure number
          selectedColor: item.productVariant.color,
          selectedLens: item.productVariant.lensType,
          image:item.product.images[0].url,
        }
        cart.addToCart(params)
    }
    loading.value = false
  } catch (e) {
    console.log(e);
  }
}
const removeCart = async(item) => {
  console.log(item,"购物车项");
  try{
     await $api(`/cart/remove/${item.cartItemId}`, {
      method: 'DELETE',
    })
    getCats()
  }catch(e){
    console.log(e);
  }
  // cart.removeFromCart(item)
}
</script>
