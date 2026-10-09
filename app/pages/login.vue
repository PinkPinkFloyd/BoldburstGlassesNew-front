<script setup lang="ts">
import { DEMO_EMAIL, DEMO_PASSWORD } from '~/utils/demo-api'
const demo = useRuntimeConfig().public.demoMode
const auth = useAuthStore()
const email = ref(demo ? DEMO_EMAIL : '')
const password = ref(demo ? DEMO_PASSWORD : '')
const loading = ref(false)
const error = ref('')
async function login() {
  if (loading.value) return
  loading.value = true
  error.value = ''
  try { await auth.login(email.value, password.value); await navigateTo('/') }
  catch (cause) { error.value = cause instanceof Error ? cause.message : 'Unable to sign in' }
  finally { loading.value = false }
}
</script>

<template>
  <div class="max-w-md mx-auto py-12 space-y-6">
    <h1 class="text-3xl font-bold">{{ demo ? 'Demo sign in' : 'Sign in' }}</h1>
    <UAlert v-if="demo" title="Try the sample account" :description="'Email: ' + DEMO_EMAIL + ' · Passphrase: ' + DEMO_PASSWORD + '. This is a local simulation; do not use a real password.'" />
    <form class="space-y-6" @submit.prevent="login">
      <UFormField label="Email address"><UInput v-model="email" type="email" required class="w-full" /></UFormField>
      <UFormField :label="demo ? 'Demo passphrase' : 'Password'"><UInput v-model="password" type="password" required class="w-full" /></UFormField>
      <UButton type="submit" block size="lg" :loading="loading" :disabled="loading">Sign in</UButton>
      <UAlert v-if="error" title="Sign in failed" :description="error" color="error" />
    </form>
    <p>New here? <NuxtLink to="/register" class="underline text-primary-600">Create a demo identity</NuxtLink></p>
  </div>
</template>
