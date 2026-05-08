<template>
  <div class="flex min-h-[calc(100vh-64px)]">
    <!-- 侧边栏 -->
    <div class="w-60 bg-[rgba(15,12,41,0.6)] border-r border-primary/20 py-6 px-4">
      <nav class="space-y-1">
        <button 
          v-for="item in navItems" 
          :key="item.id"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200',
            activeNav === item.id ? 'bg-primary/30 text-white' : 'text-white/70 hover:bg-primary/20 hover:text-white'
          ]"
          @click="activeNav = item.id"
        >
          <component :is="item.icon" class="w-5 h-5 opacity-70" />
          {{ item.name }}
        </button>
      </nav>
    </div>

    <!-- 主内容 -->
    <div class="flex-1 p-8 overflow-y-auto">
      <!-- 概览 -->
      <div v-show="activeNav === 'overview'">
        <div class="mb-8">
          <h1 class="text-2xl font-bold mb-2">概览</h1>
          <p class="text-white/60 text-sm">查看您的账户状态和使用情况</p>
        </div>
        
        <div class="grid grid-cols-4 gap-5 mb-8">
          <div class="bg-white/5 border border-primary/20 rounded-xl p-6">
            <div class="text-white/60 text-sm mb-2">本月消费</div>
            <div class="text-3xl font-bold">¥{{ stats.monthlySpend.toFixed(2) }}</div>
            <div class="text-emerald-400 text-sm mt-2">较上月 +0%</div>
          </div>
          <div class="bg-white/5 border border-primary/20 rounded-xl p-6">
            <div class="text-white/60 text-sm mb-2">本月请求</div>
            <div class="text-3xl font-bold">{{ stats.monthlyRequests }}</div>
            <div class="text-emerald-400 text-sm mt-2">较上月 +0%</div>
          </div>
          <div class="bg-white/5 border border-primary/20 rounded-xl p-6">
            <div class="text-white/60 text-sm mb-2">Token 消耗</div>
            <div class="text-3xl font-bold">{{ stats.tokenConsumed }}</div>
          </div>
          <div class="bg-white/5 border border-primary/20 rounded-xl p-6">
            <div class="text-white/60 text-sm mb-2">账户余额</div>
            <div class="text-3xl font-bold">¥{{ stats.balance.toFixed(2) }}</div>
          </div>
        </div>

        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-4">快速操作</h2>
          <div class="grid grid-cols-3 gap-6">
            <div class="bg-white/5 border border-primary/20 rounded-xl p-6 cursor-pointer hover:bg-white/8 hover:border-primary/40 transition-all" @click="activeNav = 'apikeys'">
              <h3 class="font-semibold mb-2">创建 API 密钥</h3>
              <p class="text-white/60 text-sm">生成新的访问凭证</p>
            </div>
            <div class="bg-white/5 border border-primary/20 rounded-xl p-6 cursor-pointer hover:bg-white/8 hover:border-primary/40 transition-all" @click="navigateTo('/pricing')">
              <h3 class="font-semibold mb-2">充值余额</h3>
              <p class="text-white/60 text-sm">为账户充值积分</p>
            </div>
            <div class="bg-white/5 border border-primary/20 rounded-xl p-6 cursor-pointer hover:bg-white/8 hover:border-primary/40 transition-all" @click="navigateTo('/docs')">
              <h3 class="font-semibold mb-2">查看文档</h3>
              <p class="text-white/60 text-sm">API 使用指南</p>
            </div>
          </div>
        </div>
      </div>

      <!-- API 密钥 -->
      <div v-show="activeNav === 'apikeys'">
        <div class="mb-8">
          <h1 class="text-2xl font-bold mb-2">API 密钥</h1>
          <p class="text-white/60 text-sm">管理您的 API 访问凭证</p>
        </div>
        <div class="bg-white/5 border border-primary/20 rounded-xl p-12 text-center">
          <p class="text-white/60 mb-4">登录后即可管理您的 API 密钥</p>
          <button class="px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all" @click="showLoginModal = true">
            去登录
          </button>
        </div>
      </div>

      <!-- 使用统计 -->
      <div v-show="activeNav === 'usage'">
        <div class="mb-8">
          <h1 class="text-2xl font-bold mb-2">使用统计</h1>
          <p class="text-white/60 text-sm">查看您的 API 使用情况</p>
        </div>
        <div class="grid grid-cols-4 gap-5">
          <div class="bg-white/5 border border-primary/20 rounded-xl p-6">
            <div class="text-white/60 text-sm mb-2">今日请求</div>
            <div class="text-3xl font-bold">0</div>
          </div>
          <div class="bg-white/5 border border-primary/20 rounded-xl p-6">
            <div class="text-white/60 text-sm mb-2">今日 Token</div>
            <div class="text-3xl font-bold">0</div>
          </div>
          <div class="bg-white/5 border border-primary/20 rounded-xl p-6">
            <div class="text-white/60 text-sm mb-2">成功率</div>
            <div class="text-3xl font-bold">--</div>
          </div>
          <div class="bg-white/5 border border-primary/20 rounded-xl p-6">
            <div class="text-white/60 text-sm mb-2">平均延迟</div>
            <div class="text-3xl font-bold">--</div>
          </div>
        </div>
      </div>

      <!-- 消费记录 -->
      <div v-show="activeNav === 'records'">
        <div class="mb-8">
          <h1 class="text-2xl font-bold mb-2">消费记录</h1>
          <p class="text-white/60 text-sm">查看您的消费明细</p>
        </div>
        <div class="bg-white/5 border border-primary/20 rounded-xl p-12 text-center">
          <p class="text-white/60">暂无消费记录</p>
        </div>
      </div>

      <!-- 账户设置 -->
      <div v-show="activeNav === 'settings'">
        <div class="mb-8">
          <h1 class="text-2xl font-bold mb-2">账户设置</h1>
          <p class="text-white/60 text-sm">管理您的账户信息</p>
        </div>
        <div class="bg-white/5 border border-primary/20 rounded-xl p-12 text-center">
          <p class="text-white/60 mb-4">登录后即可管理您的账户</p>
          <button class="px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all" @click="showLoginModal = true">
            去登录
          </button>
        </div>
      </div>

      <!-- 模型管理 -->
      <div v-show="activeNav === 'modelAdmin'">
        <div class="mb-8">
          <h1 class="text-2xl font-bold mb-2">模型管理</h1>
          <p class="text-white/60 text-sm">启用或禁用可用模型</p>
        </div>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
          <ModelCard 
            v-for="model in models" 
            :key="model.id"
            :model="model"
          />
        </div>
      </div>

      <!-- 帮助与支持 -->
      <div v-show="activeNav === 'help'">
        <div class="mb-8">
          <h1 class="text-2xl font-bold mb-2">帮助与支持</h1>
          <p class="text-white/60 text-sm">获取帮助和联系客服</p>
        </div>
        <div class="grid grid-cols-3 gap-6">
          <div class="bg-white/5 border border-primary/20 rounded-xl p-6">
            <h3 class="font-semibold mb-2">在线文档</h3>
            <p class="text-white/60 text-sm">查看详细的使用文档和 API 参考</p>
          </div>
          <div class="bg-white/5 border border-primary/20 rounded-xl p-6">
            <h3 class="font-semibold mb-2">工单支持</h3>
            <p class="text-white/60 text-sm">提交工单获取技术支持</p>
          </div>
          <div class="bg-white/5 border border-primary/20 rounded-xl p-6">
            <h3 class="font-semibold mb-2">邮件联系</h3>
            <p class="text-white/60 text-sm">support@cococlaw.com</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 登录弹窗 -->
    <LoginModal v-model="showLoginModal" />
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import ModelCard from '~/components/ModelCard.vue'
import LoginModal from '~/components/LoginModal.vue'

const { getModels, getUsageStats } = useApi()
const showLoginModal = ref(false)
const activeNav = ref('overview')
const models = ref<any[]>([])

const stats = ref({
  monthlySpend: 0,
  monthlyRequests: 0,
  tokenConsumed: 0,
  balance: 0
})

const navItems = [
  { 
    id: 'overview', 
    name: '概览', 
    icon: h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('rect', { x: '3', y: '3', width: '7', height: '7' }),
      h('rect', { x: '14', y: '3', width: '7', height: '7' }),
      h('rect', { x: '14', y: '14', width: '7', height: '7' }),
      h('rect', { x: '3', y: '14', width: '7', height: '7' })
    ])
  },
  { 
    id: 'apikeys', 
    name: 'API 密钥', 
    icon: h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4' })
    ])
  },
  { 
    id: 'usage', 
    name: '使用统计', 
    icon: h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M18 20V10' }),
      h('path', { d: 'M12 20V4' }),
      h('path', { d: 'M6 20v-6' })
    ])
  },
  { 
    id: 'records', 
    name: '消费记录', 
    icon: h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
      h('path', { d: 'M14 2v6h6' }),
      h('path', { d: 'M16 13H8' }),
      h('path', { d: 'M16 17H8' })
    ])
  },
  { 
    id: 'settings', 
    name: '账户设置', 
    icon: h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '3' }),
      h('path', { d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' })
    ])
  },
  { 
    id: 'modelAdmin', 
    name: '模型管理', 
    icon: h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M12 2L2 7l10 5 10-5-10-5z' }),
      h('path', { d: 'M2 17l10 5 10-5' }),
      h('path', { d: 'M2 12l10 5 10-5' })
    ])
  },
  { 
    id: 'help', 
    name: '帮助与支持', 
    icon: h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('path', { d: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' }),
      h('line', { x1: '12', y1: '17', x2: '12.01', y2: '17' })
    ])
  }
]

const loadData = async () => {
  models.value = await getModels()
  stats.value = await getUsageStats()
}

// Handle navigation from layout
onMounted(() => {
  loadData()
  
  window.addEventListener('navigate-console', ((e: CustomEvent) => {
    activeNav.value = e.detail
  }) as EventListener)
})

useHead({
  title: '控制台 - COCO CLAW'
})
</script>
