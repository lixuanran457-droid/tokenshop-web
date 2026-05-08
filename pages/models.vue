<template>
  <div class="px-12 py-12 max-w-[1400px] mx-auto">
    <h1 class="text-3xl font-bold mb-8">支持的模型</h1>
    
    <!-- 筛选按钮 -->
    <div class="flex gap-3 mb-8 flex-wrap">
      <button 
        v-for="filter in filters" 
        :key="filter.value"
        :class="[
          'px-5 py-2.5 text-sm rounded-lg transition-all duration-200',
          activeFilter === filter.value 
            ? 'bg-primary/30 border border-primary text-white' 
            : 'bg-white/5 border border-primary/30 text-white/70 hover:bg-primary/20 hover:border-primary/50'
        ]"
        @click="setFilter(filter.value)"
      >
        {{ filter.label }}
      </button>
    </div>
    
    <!-- 模型网格 -->
    <div class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
      <ModelCard 
        v-for="model in filteredModels" 
        :key="model.id"
        :model="model"
      />
    </div>
    
    <!-- 空状态 -->
    <div v-if="filteredModels.length === 0" class="text-center py-20">
      <p class="text-white/60">暂无模型</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import ModelCard from '~/components/ModelCard.vue'

const { getModels } = useApi()
const models = ref<any[]>([])
const activeFilter = ref('all')

const filters = [
  { label: '全部', value: 'all' },
  { label: 'OpenAI', value: 'openai' },
  { label: 'Anthropic', value: 'anthropic' },
  { label: 'Google', value: 'google' },
  { label: 'DeepSeek', value: 'deepseek' },
  { label: 'Moonshot', value: 'kimi' },
  { label: '智谱AI', value: 'zhipu' }
]

const filteredModels = computed(() => {
  if (activeFilter.value === 'all') return models.value
  return models.value.filter(m => m.providerClass === activeFilter.value)
})

const setFilter = (value: string) => {
  activeFilter.value = value
}

const loadModels = async () => {
  models.value = await getModels()
}

onMounted(() => {
  loadModels()
})

useHead({
  title: '支持的模型 - COCO CLAW'
})
</script>
