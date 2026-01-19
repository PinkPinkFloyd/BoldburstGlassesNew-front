<template>
  <div class="flex min-h-[calc(100vh-200px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <NuxtLink to="/register" class="font-medium text-primary-600 hover:text-primary-500">
            create a new account
          </NuxtLink>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4 rounded-md shadow-sm">
          <UFormField label="Email address" name="email">
            <UInput v-model="email" type="email" required placeholder="you@example.com" size="lg" class="w-full" />
          </UFormField>
          <UFormField label="Password" name="password">
            <UInput v-model="password" type="password" required placeholder="********" size="lg" class="w-full" />
          </UFormField>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <UCheckbox label="Remember me" />
          </div>
          <div class="text-sm">
            <a href="#" class="font-medium text-primary-600 hover:text-primary-500">Forgot your password?</a>
          </div>
        </div>

        <div>
          <UButton type="submit" block size="lg" :loading="loading" class="w-full justify-center">
            Sign in
          </UButton>
        </div>
        
        <UAlert v-if="error" color="error" variant="subtle" title="Login Failed" :description="error" icon="i-heroicons-exclamation-circle" />
      </form>
    </div>
  </div>
</template>

<script setup>
const auth = useAuthStore()
const router = useRouter()
const toast = useToast()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const { $setAuthToken } = useNuxtApp()
const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await auth.login(email.value, password.value)
    // 保存 token 到 cookie + store
    console.log(data,'111111');
    
    $setAuthToken(data.access_token)
    auth.setUser(data.user)

    toast.add({ title: 'Welcome back!', icon: 'i-heroicons-check-circle', color: 'success' })
    router.push('/')
  } catch (e) {
    error.value = 'Invalid email or password.'
  } finally {
    loading.value = false
  }
}


</script>