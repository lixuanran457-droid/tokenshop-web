<template>
  <div class="px-4 md:px-12 py-8 md:py-12 max-w-[1200px] mx-auto">
    <h1 class="text-2xl md:text-3xl font-bold mb-3 md:mb-4">充值中心</h1>
    <p class="text-white/60 mb-6 md:mb-8 text-sm md:text-base">选择适合您的套餐，享受更优惠的价格</p>
    
    <!-- 余额卡片 -->
    <div class="inline-block bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-xl md:rounded-2xl p-4 md:p-6 mb-6 md:mb-8">
      <div class="text-white/60 text-xs md:text-sm">当前余额</div>
      <div class="text-2xl md:text-4xl font-bold mt-1 md:mt-2">{{ user?.balance || 0.00 }} <span class="text-sm md:text-lg text-white/60">元</span></div>
    </div>

    <!-- 套餐网格 -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
      <div 
        v-for="pkg in packages" 
        :key="pkg.id"
        :class="[
          'bg-white/5 border rounded-xl md:rounded-2xl p-4 md:p-6 text-center transition-all duration-300 cursor-pointer relative',
          pkg.popular ? 'border-accent' : 'border-primary/20',
          selectedPackage?.id === pkg.id ? 'border-primary bg-primary/10' : 'hover:border-primary/50 hover:-translate-y-1'
        ]"
        @click="selectPackage(pkg)"
      >
        <div v-if="pkg.popular" class="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-accent text-xs rounded-full">推荐</div>
        <div class="text-lg md:text-2xl font-bold mb-2 md:mb-4">¥{{ pkg.amount }} <span class="text-xs md:text-sm text-white/50">元</span></div>
        <ul class="text-left">
          <li 
            v-for="feature in pkg.features" 
            :key="feature"
            class="text-white/60 text-xs md:text-sm py-1 md:py-2 pl-3 md:pl-4 relative before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-1 md:before:w-1.5 md:before:h-1.5 before:bg-primary before:rounded-full"
          >
            {{ feature }}
          </li>
        </ul>
      </div>
    </div>

    <!-- 支付方式 -->
    <div class="mb-6 md:mb-8">
      <h3 class="text-base md:text-lg font-semibold mb-3 md:mb-4">支付方式</h3>
      <div class="flex flex-col sm:flex-row gap-3 md:gap-4">
        <div 
          v-for="method in paymentMethods" 
          :key="method.id"
          :class="[
            'px-4 md:px-6 py-3 md:py-4 bg-white/5 border rounded-xl flex items-center gap-3 cursor-pointer transition-all',
            selectedPayment === method.id ? 'border-primary bg-primary/10' : 'border-primary/20 hover:border-primary/50'
          ]"
          @click="selectedPayment = method.id"
        >
          <div class="w-5 h-5 md:w-6 md:h-6" v-html="method.icon"></div>
          <span class="text-sm md:text-base">{{ method.name }}</span>
        </div>
      </div>
    </div>

    <!-- 结算摘要 -->
    <div class="bg-white/5 rounded-xl p-4 md:p-6 mb-4 md:mb-6">
      <div class="flex justify-between py-2 text-sm md:text-base">
        <span class="text-white/60">充值金额</span>
        <span>¥{{ selectedPackage?.amount || '0.00' }}</span>
      </div>
      <div class="flex justify-between py-2 border-t border-white/10 mt-2 pt-4 font-semibold text-sm md:text-base">
        <span>应付金额</span>
        <span>¥{{ selectedPackage?.amount || '0.00' }}</span>
      </div>
    </div>

    <!-- 充值按钮 -->
    <button 
      class="w-full py-3 md:py-4 bg-gradient-to-r from-primary to-secondary rounded-xl text-sm md:text-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50"
      :disabled="!selectedPackage"
      @click="handleCheckout"
    >
      立即充值
    </button>
  </div>
</template>

<script setup lang="ts">
const { getPackages, createOrder, user } = useApi()
const showLoginModal = ref(true)

const packages = ref<any[]>([])
const selectedPackage = ref<any>(null)
const selectedPayment = ref('wechat')

const paymentMethods = [
  { 
    id: 'wechat', 
    name: '微信支付',
    icon: `<svg viewBox="0 0 24 24" fill="#10b981"><path d="M4.5 4.5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h15a1 1 0 0 0 1-1v-13a1 1 0 0 0-1-1h-15zm6.75 5.25a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5a.75.75 0 0 1 .75-.75zm3.75-.75a.75.75 0 0 0-1.5 0v5.25a.75.75 0 0 0 1.5 0v-5.25z"/></svg>`
  },
  { 
    id: 'alipay', 
    name: '支付宝',
    icon: `<svg viewBox="0 0 24 24" fill="#4285f4"><circle cx="12" cy="12" r="10"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93z" fill="#fff"/></svg>`
  }
]

const selectPackage = (pkg: any) => {
  selectedPackage.value = pkg
}

const handleCheckout = async () => {
  if (!selectedPackage.value) {
    alert('请先选择充值套餐')
    return
  }
  alert('请先登录')
}

const loadPackages = async () => {
  packages.value = await getPackages()
}

onMounted(() => {
  loadPackages()
})

useHead({
  title: '充值中心 - COCO CLAW'
})
</script>
