<template>
  <div class="models-carousel-section py-16 relative overflow-hidden">
    <div class="max-w-[1400px] mx-auto px-12">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-bold">热门模型</h2>
        <div class="flex gap-3">
          <button 
            class="w-11 h-11 rounded-full bg-white/10 border border-primary/30 text-white flex items-center justify-center hover:bg-primary/30 hover:border-primary transition-all"
            @click="$emit('prev')"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button 
            class="w-11 h-11 rounded-full bg-white/10 border border-primary/30 text-white flex items-center justify-center hover:bg-primary/30 hover:border-primary transition-all"
            @click="$emit('next')"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div 
        class="overflow-hidden -mx-12 px-12"
        ref="carouselRef"
        @mousedown="onDragStart"
        @mousemove="onDragMove"
        @mouseup="onDragEnd"
        @mouseleave="onDragEnd"
        @touchstart="onTouchStart"
        @touchend="onTouchEnd"
      >
        <div 
          class="flex gap-6 transition-transform duration-500 ease-out cursor-grab"
          :style="{ transform: `translateX(-${offset}px)` }"
          style="cursor: grab"
        >
          <div 
            v-for="model in models" 
            :key="model.id"
            class="flex-none w-[calc(33.333%-16px)] min-w-[320px]"
            @click="$emit('select', model)"
          >
            <div class="bg-white/5 border border-primary/20 rounded-2xl p-6 transition-all duration-300 hover:bg-white/8 hover:border-primary/40 hover:-translate-y-1">
              <div class="flex items-center gap-4 mb-4">
                <div 
                  class="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden"
                  :style="{ background: `${model.color}20` }"
                  v-html="modelLogos[model.providerClass as keyof typeof modelLogos]"
                ></div>
                <div>
                  <div class="text-lg font-semibold">{{ model.name }}</div>
                  <div class="text-white/50 text-sm">{{ model.provider }}</div>
                </div>
              </div>
              <div class="text-white/70 text-sm leading-relaxed mb-4">{{ model.desc }}</div>
              <div class="flex justify-between items-center">
                <div class="text-primary font-medium">{{ model.price }}/1K tokens</div>
                <div class="px-2.5 py-1 bg-primary/20 rounded-lg text-xs text-primary-light">{{ model.provider }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 指示器 -->
      <div class="flex justify-center gap-2 mt-8">
        <div 
          v-for="i in totalSlides" 
          :key="i"
          :class="['w-2 h-2 rounded-full cursor-pointer transition-all duration-300', currentSlide === i - 1 ? 'bg-primary w-6 rounded' : 'bg-white/30']"
          @click="$emit('goto', i - 1)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Model {
  id: string
  name: string
  provider: string
  providerClass: string
  desc: string
  color: string
  price: string
}

const props = defineProps<{
  models: Model[]
  currentSlide: number
}>()

const emit = defineEmits<{
  prev: []
  next: []
  goto: [index: number]
  select: [model: Model]
}>()

const carouselRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)

const cardsPerView = ref(3)
const cardWidth = 336 + 24 // card width + gap

const totalSlides = computed(() => Math.ceil(props.models.length / cardsPerView.value))

const offset = computed(() => props.currentSlide * cardsPerView.value * cardWidth)

const modelLogos: Record<string, string> = {
  openai: `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#10a37f"/><circle cx="20" cy="20" r="4" fill="#fff"/></svg>`,
  anthropic: `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#d97706"/><path d="M12 28l6-8-2-2-4 5V15h4v-2H10v10l2 3z" fill="#fff"/></svg>`,
  google: `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#4285f4"/><path d="M20 8v10h7.5c-.67 3-2.54 5.54-5.36 7.24l4.86 5.76C30.78 28.36 35 24.41 35 19.5 35 13.15 29.83 8 23.5 8H20z" fill="#fff"/></svg>`,
  kimi: `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#8b5cf6"/><path d="M20 10l-8 14h5v8l3-5 3 5v-8h5l-8-14z" fill="#fff"/></svg>`,
  zhipu: `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#00d4aa"/><path d="M12 14l8 12 8-12h-5v12h-6V14h-5z" fill="#fff"/></svg>`,
  deepseek: `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#1e40af"/><path d="M15 12h10v3H15v-3zm0 6h10v3H15v-3zm0 6h7v3h-7v-3z" fill="#fff"/></svg>`
}

const onDragStart = (e: MouseEvent) => {
  isDragging.value = true
  startX.value = e.pageX - (carouselRef.value?.offsetLeft || 0)
  scrollLeft.value = offset.value
}

const onDragMove = (e: MouseEvent) => {
  if (!isDragging.value) return
  e.preventDefault()
  const x = e.pageX - (carouselRef.value?.offsetLeft || 0)
  const walk = (x - startX.value) * 1.5
  const newOffset = scrollLeft.value - walk
  // Calculate which slide to snap to
  const slideWidth = cardsPerView.value * cardWidth
  const slideIndex = Math.round(newOffset / slideWidth)
  emit('goto', Math.max(0, Math.min(slideIndex, totalSlides.value - 1)))
}

const onDragEnd = () => {
  isDragging.value = false
}

let touchStartX = 0
let touchEndX = 0

const onTouchStart = (e: TouchEvent) => {
  touchStartX = e.changedTouches[0].screenX
}

const onTouchEnd = (e: TouchEvent) => {
  touchEndX = e.changedTouches[0].screenX
  const diff = touchStartX - touchEndX
  if (Math.abs(diff) > 50) {
    if (diff > 0) emit('next')
    else emit('prev')
  }
}

onMounted(() => {
  const updateCardsPerView = () => {
    const width = window.innerWidth
    if (width < 768) cardsPerView.value = 1
    else if (width < 1024) cardsPerView.value = 2
    else cardsPerView.value = 3
  }
  updateCardsPerView()
  window.addEventListener('resize', updateCardsPerView)
})
</script>
