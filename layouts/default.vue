<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="bg-orb bg-orb-1"></div>
      <div class="bg-orb bg-orb-2"></div>
      <div class="bg-orb bg-orb-3"></div>
      <div class="bg-grid"></div>
    </div>

    <!-- PC端导航栏 - 移动端隐藏 -->
    <nav class="fixed top-0 left-0 right-0 h-16 bg-[rgba(15,12,41,0.8)] backdrop-blur-xl border-b border-primary/20 z-50 max-md:hidden">
      <div class="max-w-[1400px] mx-auto h-full px-4 md:px-12 flex items-center justify-between">
        <!-- 左侧 -->
        <div class="flex items-center gap-4 md:gap-12">
          <NuxtLink to="/" class="flex items-center gap-2.5 text-lg font-bold cursor-pointer">
            <span class="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent tracking-wide">
              COCO CLAW
            </span>
          </NuxtLink>
          
          <div class="hidden md:flex items-center gap-2">
            <NuxtLink 
              v-for="link in navLinks" 
              :key="link.path"
              :to="link.path"
              :class="[
                'px-4 py-2 text-sm rounded-lg transition-all duration-200',
                isActive(link.path) 
                  ? 'text-white bg-primary/20' 
                  : 'text-white/70 hover:text-white hover:bg-primary/20'
              ]"
            >
              {{ link.name }}
            </NuxtLink>
            <button 
              class="px-3.5 py-2 text-sm rounded-full flex items-center gap-1.5 transition-all duration-200"
              style="background: linear-gradient(135deg, rgba(168,85,247,0.3), rgba(99,102,241,0.3)); border: 1px solid rgba(168,85,247,0.5); color: #c084fc;"
              @click="goToAdmin"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
              管理
            </button>
          </div>
        </div>

        <!-- 右侧 -->
        <div class="flex items-center gap-4">
          <button 
            class="px-5 py-2 text-sm font-medium rounded-lg border border-primary/50 text-white/90 hover:border-primary hover:bg-primary/10 transition-all duration-200"
            @click="showLoginModal = true"
          >
            登录
          </button>
          <button 
            class="px-5 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-primary/30 transition-all duration-200"
            @click="showLoginModal = true"
          >
            注册
          </button>
        </div>
      </div>
    </nav>

    <!-- 移动端顶部导航 -->
    <nav class="fixed top-0 left-0 right-0 h-14 bg-[rgba(15,12,41,0.95)] backdrop-blur-xl border-b border-primary/20 z-50 md:hidden">
      <div class="h-full px-4 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2 text-lg font-bold">
          <span class="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
            COCO CLAW
          </span>
        </NuxtLink>
        <button 
          class="p-2 text-white/70 hover:text-white"
          @click="showLoginModal = true"
        >
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </button>
      </div>
    </nav>

    <!-- 主内容 -->
    <main class="pt-16 md:pt-16 relative z-10 pb-20 md:pb-0">
      <slot />
      
      <!-- PC端页脚 - 移动端隐藏 -->
      <footer class="bg-[rgba(15,12,41,0.8)] border-t border-primary/20 py-12 text-center max-md:hidden">
        <div class="flex justify-center gap-8 mb-6">
          <a href="#" class="text-white/60 hover:text-white text-sm transition-colors">关于我们</a>
          <a href="#" class="text-white/60 hover:text-white text-sm transition-colors">服务条款</a>
          <a href="#" class="text-white/60 hover:text-white text-sm transition-colors">隐私政策</a>
          <a href="#" class="text-white/60 hover:text-white text-sm transition-colors">帮助中心</a>
          <a href="#" class="text-white/60 hover:text-white text-sm transition-colors">联系我们</a>
        </div>
        <div class="text-white/40 text-sm">© 2026 COCO CLAW. All rights reserved.</div>
      </footer>
    </main>

    <!-- 移动端底部 TabBar -->
    <div class="fixed bottom-0 left-0 right-0 bg-[rgba(15,12,41,0.98)] backdrop-blur-xl border-t border-primary/20 z-50 md:hidden">
      <div class="flex items-center justify-around py-2 px-2">
        <NuxtLink 
          v-for="tab in tabBarItems" 
          :key="tab.path"
          :to="tab.path"
          class="flex flex-col items-center py-1 px-3 rounded-lg transition-all"
          :class="isActive(tab.path) ? 'text-primary' : 'text-white/50'"
        >
          <component :is="tab.icon" class="w-6 h-6" />
          <span class="text-[10px] mt-0.5">{{ tab.name }}</span>
        </NuxtLink>
      </div>
    </div>

    <!-- 登录弹窗 -->
    <LoginModal v-model="showLoginModal" />
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import LoginModal from '~/components/LoginModal.vue'

const route = useRoute()
const showLoginModal = ref(false)

const navLinks = [
  { name: '首页', path: '/' },
  { name: '模型', path: '/models' },
  { name: '充值', path: '/pricing' },
  { name: '控制台', path: '/console' },
  { name: '文档', path: '/docs' }
]

// 移动端 TabBar 图标
const HomeIcon = h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
  h('path', { d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }),
  h('polyline', { points: '9 22 9 12 15 12 15 22' })
])

const ModelsIcon = h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
  h('rect', { x: '3', y: '3', width: '7', height: '7' }),
  h('rect', { x: '14', y: '3', width: '7', height: '7' }),
  h('rect', { x: '14', y: '14', width: '7', height: '7' }),
  h('rect', { x: '3', y: '14', width: '7', height: '7' })
])

const PricingIcon = h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
  h('line', { x1: '12', y1: '1', x2: '12', y2: '23' }),
  h('path', { d: 'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' })
])

const ConsoleIcon = h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
  h('rect', { x: '2', y: '3', width: '20', height: '14', rx: '2', ry: '2' }),
  h('line', { x1: '8', y1: '21', x2: '16', y2: '21' }),
  h('line', { x1: '12', y1: '17', x2: '12', y2: '21' })
])

const tabBarItems = [
  { name: '首页', path: '/', icon: HomeIcon },
  { name: '模型', path: '/models', icon: ModelsIcon },
  { name: '充值', path: '/pricing', icon: PricingIcon },
  { name: '控制台', path: '/console', icon: ConsoleIcon }
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const goToAdmin = () => {
  navigateTo('/console')
  setTimeout(() => {
    const event = new CustomEvent('navigate-console', { detail: 'modelAdmin' })
    window.dispatchEvent(event)
  }, 100)
}
</script>
