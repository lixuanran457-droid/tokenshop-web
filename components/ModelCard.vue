<template>
  <div class="bg-white/5 border border-primary/20 rounded-2xl p-6 transition-all duration-300 hover:bg-white/8 hover:border-primary/40 hover:-translate-y-0.5 cursor-pointer">
    <div class="flex items-center gap-4 mb-4">
      <div 
        class="model-logo"
        :style="{ background: `${model.color}20` }"
        v-html="modelLogos[model.providerClass as keyof typeof modelLogos]"
      ></div>
      <div class="text-lg font-semibold">{{ model.name }}</div>
    </div>
    <div class="text-white/50 text-sm mb-3">{{ model.provider }}</div>
    <div class="text-white/70 text-sm leading-relaxed mb-4">{{ model.desc }}</div>
    <div class="text-primary text-sm font-medium">{{ model.price }}/1K tokens</div>
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

defineProps<{
  model: Model
}>()

const modelLogos: Record<string, string> = {
  openai: `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#10a37f"/><path d="M20 8C13.373 8 8 13.373 8 20s5.373 12 12 12 12-5.373 12-12S26.627 8 20 8zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S10 25.523 10 20 14.477 10 20 10z" fill="#fff"/><circle cx="20" cy="20" r="4" fill="#fff"/></svg>`,
  anthropic: `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#d97706"/><path d="M12 28l6-8-2-2-4 5V15h4v-2H10v10l2 3z" fill="#fff"/><path d="M22 13v12l-2 3 2 2 4-5v-8h-4z" fill="#fff"/><circle cx="26" cy="13" r="3" fill="#fff"/></svg>`,
  google: `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#4285f4"/><path d="M20 8v10h7.5c-.67 3-2.54 5.54-5.36 7.24l4.86 5.76C30.78 28.36 35 24.41 35 19.5 35 13.15 29.83 8 23.5 8H20z" fill="#fff"/><path d="M13.5 20.5c0-1.83.49-3.56 1.33-5.06l-4.33-5.13C8.42 12.44 7.5 15.97 7.5 20c7.5 0 10.5-7.5 13.5-7.5H17.5v-4.5c-5.5 0-10 4.5-10 12.5z" fill="#fff"/></svg>`,
  kimi: `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#8b5cf6"/><path d="M20 10l-8 14h5v8l3-5 3 5v-8h5l-8-14z" fill="#fff"/></svg>`,
  zhipu: `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#00d4aa"/><path d="M12 14l8 12 8-12h-5v12h-6V14h-5z" fill="#fff"/></svg>`,
  deepseek: `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#1e40af"/><path d="M15 12h10v3H15v-3zm0 6h10v3H15v-3zm0 6h7v3h-7v-3z" fill="#fff"/><circle cx="28" cy="28" r="4" fill="#60a5fa"/></svg>`
}
</script>
