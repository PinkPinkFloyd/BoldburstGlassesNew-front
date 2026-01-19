<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Order History</h1>

    <div v-if="pending" class="py-24 text-center">
      <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 animate-spin text-gray-400 mx-auto" />
    </div>

    <div v-else-if="orders && orders.length > 0" class="space-y-6">
      <div v-for="order in orders" :key="order.id" class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div class="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-200">
          <div>
            <p class="text-xs font-bold text-gray-500 uppercase tracking-wide">Order Placed</p>
            <p class="font-medium text-gray-900">{{ new Date(order.createdAt).toLocaleDateString() }}</p>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-500 uppercase tracking-wide">Total</p>
            <p class="font-medium text-gray-900">${{ Number(order.totalAmount).toFixed(2) }}</p>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-500 uppercase tracking-wide">Status</p>
             <UBadge :color="statusColor(order.status)" variant="subtle">{{ order.status }}</UBadge>
          </div>
          <div class="text-right">
             <p class="text-xs font-bold text-gray-500 uppercase tracking-wide">Order #</p>
             <p class="font-medium text-gray-900">{{ order.id }}</p>
          </div>
        </div>
        
        <div class="p-6">
          <div v-for="item in order.items" :key="item.id" class="flex gap-4 mb-4 last:mb-0">
             <div class="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
               <!-- Safe image access -->
               <img 
                 :src="item.productVariant?.product?.images?.[0]?.url || 'https://placehold.co/100'" 
                 class="w-full h-full object-cover"
               >
             </div>
             <div>
               <h4 class="font-bold text-gray-900">{{ item.productVariant?.product?.name || 'Unknown Product' }}</h4>
               <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
               <p class="text-sm text-gray-500">{{ item.productVariant?.color }} / {{ item.productVariant?.lensType }}</p>
             </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-24 bg-white rounded-xl border border-gray-200">
      <UIcon name="i-heroicons-clipboard-document-list" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-xl font-bold text-gray-900">No orders yet</h3>
      <p class="text-gray-500 mb-6">Start shopping to see your orders here.</p>
      <UButton to="/" color="black">Browse Products</UButton>
    </div>
  </div>
</template>

<script setup>
const auth = useAuthStore()
const config = useRuntimeConfig()

// Fetch orders if user is logged in
const { data: orders, pending } = await useFetch(() => auth.user ? `/orders/user/${auth.user.id}` : null, {
  baseURL: config.public.apiBase,
  immediate: !!auth.user
})

const statusColor = (status) => {
  switch(status) {
    case 'DELIVERED': return 'success'
    case 'SHIPPED': return 'info'
    case 'PENDING': return 'warning'
    default: return 'neutral'
  }
}
</script>