<script setup lang="ts">
const config = useRuntimeConfig()
const auth = useAuthStore()
const resetting = ref(false)
async function reset() {
  if (resetting.value) return
  resetting.value = true
  try {
    await useNuxtApp().$api('/demo/reset', { method: 'POST' })
    auth.setToken(null)
    auth.setUser(null)
    useCartStore().clearCart()
    await navigateTo('/')
  } finally { resetting.value = false }
}
</script>

<template>
  <aside v-if="config.public.demoMode" class="bg-emerald-950 text-white px-4 py-3 text-sm">
    <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
      <p><strong>Interactive demo.</strong> Sample data stays in this browser. Checkout is simulated; no payment or shipment.</p>
      <div class="flex items-center gap-4 shrink-0">
        <NuxtLink v-if="!auth.isAuthenticated" to="/login" class="underline">Demo sign in</NuxtLink>
        <span v-else>{{ auth.user?.name }}</span>
        <button class="underline disabled:opacity-50" :disabled="resetting" @click="reset">Reset demo</button>
      </div>
    </div>
  </aside>
</template>
