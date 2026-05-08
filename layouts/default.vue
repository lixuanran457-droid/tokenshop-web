<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="bg-orb bg-orb-1"></div>
      <div class="bg-orb bg-orb-2"></div>
      <div class="bg-orb bg-orb-3"></div>
      <div class="bg-grid"></div>
    </div>

    <!-- 导航栏 -->
    <nav class="fixed top-0 left-0 right-0 h-16 bg-[rgba(15,12,41,0.8)] backdrop-blur-xl border-b border-primary/20 z-50">
      <div class="max-w-[1400px] mx-auto h-full px-12 flex items-center justify-between">
        <!-- 左侧 -->
        <div class="flex items-center gap-12">
          <NuxtLink to="/" class="flex items-center gap-2.5 text-lg font-bold cursor-pointer">
            <span class="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent tracking-wide">
              COCO CLAW
            </span>
          </NuxtLink>
          
          <div class="flex items-center gap-2">
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

    <!-- 主内容 -->
    <main class="pt-16 relative z-10">
      <slot />
      
      <!-- 页脚 -->
      <footer class="bg-[rgba(15,12,41,0.8)] border-t border-primary/20 py-12 text-center">
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

    <!-- 登录弹窗 -->
    <LoginModal v-model="showLoginModal" />
  </div>
</template>

<script setup lang="ts">
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
