<template>
  <div class="flex min-h-[calc(100vh-200px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Create a new account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Already have an account?
          <NuxtLink to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </NuxtLink>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4 rounded-md shadow-sm">
          <UFormField label="Full Name" name="name">
            <UInput v-model="name" required placeholder="John Doe" size="lg" class="w-full" />
          </UFormField>
          <UFormField label="Email address" name="email">
            <UInput v-model="email" type="email" required placeholder="you@example.com" size="lg" class="w-full" />
          </UFormField>
          <UFormField label="Password" name="password">
            <UInput v-model="password" type="password" required placeholder="Min. 8 characters" size="lg" class="w-full" />
          </UFormField>
        </div>

        <div>
          <UButton type="submit" block size="lg" :loading="loading" class="w-full justify-center">
            Register
          </UButton>
        </div>
        
        <UAlert v-if="error" color="error" variant="subtle" title="Registration Failed" :description="error" icon="i-heroicons-exclamation-circle" />
      </form>
    </div>
  </div>
</template>

<script setup>
const auth = useAuthStore()
const router = useRouter()
const toast = useToast()

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  try {
    console.log('111');
    
    await auth.register(name.value, email.value, password.value)
    toast.add({ title: 'Account created!', description: 'Welcome to Boldburst Glasses.', icon: 'i-heroicons-check-circle', color: 'success' })
    router.push('/')
  } catch (e) {
    error.value = 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>