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
            <span>{{ item.quantity }}x {{ item.name }} <span class="text-gray-500">({{ item.selectedColor
            }})</span></span>
            <span class="font-medium">₹{{ (item.price * 91 * item.quantity).toFixed(2) }}</span>
          </div>
        </div>

        <div class="border-t border-gray-200 pt-4 space-y-2">
          <div class="flex justify-between">
            <span>Subtotal</span>
            <span>₹{{ (cart.totalPrice * 91).toFixed(2) }}</span>
          </div>
          <div class="flex justify-between font-bold text-lg mt-4">
            <span>Total</span>
            <span>₹{{ (cart.totalPrice * 91 * 1.08).toFixed(2) }}</span>
          </div>
        </div>

        <UButton block size="xl" class="mt-8 font-bold w-full justify-center" :loading="processing"
          @click="handleCheckout">
          Pay ₹{{ (cart.totalPrice * 91 * 1.08).toFixed(2) }}
        </UButton>
        <canvas ref="qrCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import QRCode from 'qrcode';
import setPromiseInterval, { clearPromiseInterval } from 'set-promise-interval'
const cart = useCartStore()
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
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
// 支付相关
const timer = ref(null);
const state = reactive({
  flag: '0',
  sign: ''
})
const processing = ref(false)
const qrCanvas = ref(null);
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
      totalAmount: (cart.totalPrice * 1.08).toFixed(2),
      accountName: form.firstName + ' ' + form.lastName,
      email: auth.user.email,
      phone: '1229345932',
      shippingAddress: form,
      items: cart.items.map(item => ({
        productVariantId: item.productVariantId, // Ideally fetch real variant ID from product selection
        quantity: item.quantity,
        price: item.price
      }))
    }
    // 生成订单
    await $fetch('/orders', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: orderData
    }).then(async (res) => {
      try {
        console.log(res);
        // 生成二维码
        if (!qrCanvas.value) return;
        await QRCode.toCanvas(qrCanvas.value, res.payInfo.payUrl + '&shop=1', {
          width: 300,            // 二维码宽高
          margin: 2,             // 边距
          errorCorrectionLevel: 'M' // 高纠错
        });
        // 去轮询接口查看支付状态
        // 取出sign
        let params = new URL(res.payInfo.payUrl).searchParams;
        state.sign = params.get('sign');
        // toPay()
        toast.add({
          title: 'QRcode generated Successfully!',
          description: 'Please use your mobile device to scan the QR code and make the payment.',
          icon: 'i-heroicons-check-badge',
          color: 'info',
          timeout: 5000
        })
        setTimeout(() => {
          getPageStatus()
        }, 3000)
      } catch (err) {
        console.error('fail to Qrcode:', err);
      }
      console.log('Order placed successfully:', res)
    })


    // 下面先注释，这是支付成功后的操作
    // cart.clearCart()
    // toast.add({
    //   title: 'Order Placed Successfully!',
    //   description: 'Check your email for confirmation.',
    //   icon: 'i-heroicons-check-badge',
    //   color: 'success',
    //   timeout: 5000
    // })
    // router.push('/orders')
  } catch (e) {
    processing.value = false
    toast.add({ title: 'Order Failed', description: 'Please try again.', color: 'error' })
  } finally {
    // processing.value = false
  }
}


// 轮询接口查看支付状态
const toPay = async () => {
  await $fetch('/api/v2/payin/checkout/getStatus', {
    baseURL: "https://www.insppay.com",
    method: 'POST',
    body: { sign: state.sign }
  }).then(() => {
    if (res.status == 1 || res.status == 2) {
      clearPromiseInterval(timer.value);
      state.flag = "1";
      sessionStorage.setItem("flag", "1");
      // router.push({ path: "/about" });
    }
  })
}
const getPageStatus = () => {
  let count = 0;
  timer.value = setPromiseInterval(async () => {
    console.log(count, "count");
    if (++count === 30) {
      clearPromiseInterval(timer.value);
    }
    setTimeout(() => {
      toPay();
    }, 0);
  }, 3000);
}
//监听从app页面回来时，重新请求接口
document.addEventListener("visibilitychange", async () => {
  if (document.visibilityState == "visible") {
    console.log("页面展示了！");
    console.log(route);
    if (route && route.name == "checkout") {
      // toPay();
      getPageStatus();
    }
  }
  if (document.hidden) {
    console.log("页面隐藏了！");
    clearPromiseInterval(timer.value);
  }
});
onBeforeUnmount(() => {
  clearPromiseInterval(timer.value)
})
</script>
