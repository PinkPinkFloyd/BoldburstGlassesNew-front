<script setup lang="ts">
import { DEMO_PASSWORD } from '~/utils/demo-api'
const demo = useRuntimeConfig().public.demoMode
const name = ref('')
const email = ref('')
const password = ref(demo ? DEMO_PASSWORD : '')
const loading = ref(false)
const error = ref('')
const auth = useAuthStore()
async function register() {
  if (loading.value) return
  loading.value = true
  error.value = ''
  try { await auth.register(name.value, email.value, password.value); await navigateTo('/') }
  catch (cause) { error.value = cause instanceof Error ? cause.message : 'Unable to register' }
  finally { loading.value = false }
}
</script>

<template>
  <div class="max-w-md mx-auto py-12 space-y-6">
    <h1 class="text-3xl font-bold">Create a demo identity</h1>
    <UAlert v-if="demo" title="Local demo only" description="Use a made-up name and email. Every demo identity uses demo1234. Passwords are never saved, and this does not create a real account." />
    <form class="space-y-6" @submit.prevent="register">
      <UFormField label="Display name"><UInput v-model="name" required :maxlength="80" class="w-full" /></UFormField>
      <UFormField label="Example email"><UInput v-model="email" type="email" placeholder="shopper@example.com" required :maxlength="150" class="w-full" /></UFormField>
      <UFormField :label="demo ? 'Demo passphrase' : 'Password'"><UInput v-model="password" type="password" required class="w-full" :readonly="demo" /></UFormField>
      <UButton type="submit" block size="lg" :loading="loading" :disabled="loading">Create identity</UButton>
      <UAlert v-if="error" title="Registration failed" :description="error" color="error" />
    </form>
    <NuxtLink to="/login" class="underline text-primary-600">Already registered? Sign in</NuxtLink>
  </div>
</template>
