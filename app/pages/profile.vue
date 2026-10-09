<template>
  <div class="min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
    <div class="max-w-3xl mx-auto space-y-8">
      
      <!-- Profile Header -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex items-center space-x-6">
        <div class="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-3xl font-bold">
           <UIcon name="i-heroicons-user" class="w-12 h-12" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ user?.name || 'User' }}</h1>
          <p class="text-gray-500 dark:text-gray-400">{{ user?.email }}</p>
          <div class="mt-2 flex space-x-3">
             <UBadge color="primary" variant="subtle">Member</UBadge>
          </div>
        </div>
      </div>

      <!-- Account Actions -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Account Settings</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Manage your account preferences.</p>
        </div>
        <div class="p-6 space-y-4">
           <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <span class="text-gray-700 dark:text-gray-300">My Orders</span>
               <UButton to="/orders" variant="ghost" icon="i-heroicons-shopping-bag" >View History</UButton>
           </div>
           
           <div class="pt-4">
              <UButton color="error" variant="outline" block icon="i-heroicons-arrow-right-on-rectangle" @click="handleLogout">
                Sign Out
              </UButton>
           </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth']
})

const auth = useAuthStore()
const router = useRouter()
const toast = useToast()

// Computed property to safely access user data
// If user is null (e.g. after refresh before fetch), we might want to handle that.
// For now, we rely on the store.
const user = computed(() => auth.user)

const handleLogout = async () => {
  await auth.logout()
  toast.add({ title: 'Logged out successfully', icon: 'i-heroicons-arrow-left-on-rectangle' })
  router.push('/login')
}
</script>
