<template>
  <div>
    <!-- Hero区域 -->
    <div class="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-12 py-20 relative">
      <div class="absolute w-[800px] h-[800px] bg-radial from-primary/30 to-transparent rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/40 rounded-full text-primary-light text-sm mb-8 relative">
        <span class="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
        直连顶级模型 V8
      </div>
      
      <h1 class="text-6xl font-extrabold text-center mb-6 relative">
        下一代 <span class="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">AI 能力</span><br>
        触手可及
      </h1>
      
      <p class="text-xl text-white/60 text-center max-w-xl leading-relaxed mb-12 relative">
        通过统一 API 接口，无缝访问 GPT-4、Claude、Gemini、DeepSeek 等顶级大模型。稳定、快速、值得信赖。
      </p>
      
      <div class="flex gap-4 relative">
        <button 
          class="px-8 py-3.5 bg-gradient-to-r from-primary to-secondary rounded-xl text-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
          @click="showLoginModal = true"
        >
          立即开始
        </button>
        <NuxtLink 
          to="/docs"
          class="px-8 py-3.5 bg-white/10 border border-white/20 rounded-xl text-lg font-semibold hover:bg-white/15 hover:border-white/30 transition-all backdrop-blur-sm"
        >
          查看文档
        </NuxtLink>
      </div>
    </div>

    <!-- 特性卡片 -->
    <div class="px-12 py-20 max-w-[1200px] mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold mb-4">为什么选择 COCO CLAW</h2>
        <p class="text-white/60">我们专注于提供最稳定、最快速的模型直连服务</p>
      </div>
      
      <div class="grid grid-cols-3 gap-6">
        <div 
          v-for="feature in features" 
          :key="feature.title"
          class="bg-white/5 border border-primary/20 rounded-2xl p-8 transition-all duration-300 hover:bg-white/8 hover:border-primary/40 hover:-translate-y-1 cursor-pointer"
          @click="feature.action && feature.action()"
        >
          <div 
            class="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
            :style="{ background: feature.bgColor }"
          >
            <component :is="feature.icon" class="w-6 h-6" :style="{ color: feature.iconColor }" />
          </div>
          <h3 class="text-lg font-semibold mb-3">{{ feature.title }}</h3>
          <p class="text-white/60 text-sm leading-relaxed">{{ feature.desc }}</p>
        </div>
      </div>
    </div>

    <!-- 模型轮播 -->
    <ModelCarousel 
      v-if="models.length"
      :models="models"
      :current-slide="currentSlide"
      @prev="slideCarousel(-1)"
      @next="slideCarousel(1)"
      @goto="goToSlide"
      @select="handleModelSelect"
    />

    <!-- FAQ -->
    <div class="px-12 py-20 max-w-[800px] mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold">常见问题</h2>
      </div>
      
      <div 
        v-for="(faq, index) in faqs" 
        :key="index"
        class="bg-white/5 border border-primary/20 rounded-xl mb-3 overflow-hidden"
      >
        <button 
          class="w-full px-6 py-5 text-left text-sm flex justify-between items-center hover:bg-white/5 transition-colors"
          @click="toggleFaq(index)"
        >
          <span>{{ faq.question }}</span>
          <span 
            class="text-white/50 text-xl transition-transform duration-200"
            :class="{ 'rotate-45': openFaq === index }"
          >+</span>
        </button>
        <div 
          class="overflow-hidden transition-all duration-300"
          :style="{ maxHeight: openFaq === index ? '200px' : '0' }"
        >
          <p class="px-6 pb-5 text-white/60 text-sm leading-relaxed">{{ faq.answer }}</p>
        </div>
      </div>
    </div>

    <!-- 登录弹窗 -->
    <LoginModal v-model="showLoginModal" />
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import ModelCarousel from '~/components/ModelCarousel.vue'
import LoginModal from '~/components/LoginModal.vue'

const showLoginModal = ref(false)
const openFaq = ref<number | null>(null)

const { getModels } = useApi()
const models = ref<any[]>([])
const currentSlide = ref(0)

const features = [
  {
    title: '毫秒级响应',
    desc: '优化的网络架构，确保您的请求以最快速度送达目标模型',
    bgColor: 'rgba(99, 102, 241, 0.15)',
    iconColor: '#6366f1',
    icon: h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' })
    ]),
    action: () => navigateTo('/models')
  },
  {
    title: '企业级安全',
    desc: '端到端加密，严格的数据保护措施，您的隐私数据绝不会泄露',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    iconColor: '#10b981',
    icon: h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' })
    ])
  },
  {
    title: '透明计费',
    desc: '按实际使用量计费，随时查看消费明细，绝无隐藏费用',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    iconColor: '#f59e0b',
    icon: h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('path', { d: 'M12 6v6l4 2' })
    ])
  }
]

const faqs = [
  {
    question: 'COCO CLAW 和直接在官网使用有什么区别？',
    answer: 'COCO CLAW 提供统一的 API 接口和计费体系，您无需管理多个平台的账户。我们还针对中国大陆地区进行了网络优化，提供更低的延迟和更高的稳定性。'
  },
  {
    question: '如何获取 API 密钥？',
    answer: '注册并登录后，进入控制台的「API 密钥」页面，点击「创建密钥」即可生成。'
  },
  {
    question: '充值后可以退款吗？',
    answer: '未使用的余额可以在充值后 7 天内申请退款，需扣除 5% 手续费。'
  }
]

const toggleFaq = (index: number) => {
  openFaq.value = openFaq.value === index ? null : index
}

const slideCarousel = (direction: number) => {
  const totalSlides = Math.ceil(models.value.length / 3)
  currentSlide.value += direction
  if (currentSlide.value < 0) currentSlide.value = totalSlides - 1
  if (currentSlide.value >= totalSlides) currentSlide.value = 0
}

const goToSlide = (index: number) => {
  currentSlide.value = index
}

const handleModelSelect = (model: any) => {
  navigateTo('/models')
}

const loadModels = async () => {
  models.value = await getModels()
}

// Auto-play
let autoPlayInterval: NodeJS.Timeout | null = null

const startAutoPlay = () => {
  autoPlayInterval = setInterval(() => {
    slideCarousel(1)
  }, 4000)
}

onMounted(() => {
  loadModels()
  startAutoPlay()
})

onUnmounted(() => {
  if (autoPlayInterval) clearInterval(autoPlayInterval)
})

useHead({
  title: 'COCO CLAW - 直连顶级模型'
})
</script>
