// 不用 import、不用注册，nuxt会自动加载
export default defineNuxtPlugin(() => {
    // 读取 Nuxt 的运行时配置（支持 SSR）
    const config = useRuntimeConfig()
    const auth = useAuthStore()
    const toast = useToast()
    
    const api = $fetch.create({
      baseURL: config.public.apiBase,
  
      onRequest({ options }) {
        if(auth.token){
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${auth.token}`,
          }
        }
      },
  
      onResponseError({ response }) {
        const status = response.status
        const message =
          response._data?.message || 'Something went wrong'
  
        // 401：登录失效
        if (status === 401) {
          auth.logout()
          toast.add({
            title: 'Unauthorized',
            description: 'Please login again',
            color: 'error',
          })
          navigateTo('/login')
          return
        }
  
        // 403：没权限
        if (status === 403) {
          toast.add({
            title: 'Forbidden',
            description: message,
            color: 'error',
          })
          return
        }
  
        // 400 / 404 / 409 等业务错误
        toast.add({
          title: 'Error',
          description: message,
          color: 'error',
        })
      }
    })
  
    return {
      provide: {
        api,
      },
    }
  })
  