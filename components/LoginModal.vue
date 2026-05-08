<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="modelValue" 
        class="fixed inset-0 bg-black/70 flex items-center justify-center z-[200] p-4"
        @click.self="closeModal"
      >
        <div 
          class="bg-[#1a1a2e] border border-primary/30 rounded-2xl p-10 w-full max-w-md relative animate-fade-in"
          @click.stop
        >
          <!-- 关闭按钮 -->
          <button 
            class="absolute top-4 right-4 text-white/50 hover:text-white text-2xl transition-colors"
            @click="closeModal"
          >
            ×
          </button>

          <!-- 标签切换 -->
          <div class="flex gap-2 mb-6">
            <button 
              :class="['flex-1 py-3 text-sm transition-all border-b-2', activeTab === 'phone' ? 'text-white border-primary' : 'text-white/50 border-transparent hover:text-white/80']"
              @click="activeTab = 'phone'"
            >
              手机号
            </button>
            <button 
              :class="['flex-1 py-3 text-sm transition-all border-b-2', activeTab === 'email' ? 'text-white border-primary' : 'text-white/50 border-transparent hover:text-white/80']"
              @click="activeTab = 'email'"
            >
              邮箱
            </button>
          </div>

          <!-- 手机号登录 -->
          <div v-show="activeTab === 'phone'" class="space-y-4">
            <div>
              <label class="block text-sm text-white/70 mb-2">手机号</label>
              <input 
                v-model="phoneForm.phone"
                type="tel" 
                placeholder="请输入手机号"
                class="w-full px-4 py-3 bg-white/5 border border-primary/30 rounded-lg text-white text-sm focus:outline-none focus:border-primary"
              >
            </div>
            <div>
              <label class="block text-sm text-white/70 mb-2">验证码</label>
              <div class="flex gap-3">
                <input 
                  v-model="phoneForm.code"
                  type="text" 
                  placeholder="请输入验证码"
                  class="flex-1 px-4 py-3 bg-white/5 border border-primary/30 rounded-lg text-white text-sm focus:outline-none focus:border-primary"
                >
                <button 
                  class="px-4 py-3 bg-primary/20 border border-primary/30 rounded-lg text-primary-light text-sm whitespace-nowrap hover:bg-primary/30 transition-colors"
                  :disabled="countdown > 0"
                  @click="sendCode"
                >
                  {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                </button>
              </div>
            </div>
            <button 
              class="w-full py-3.5 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
              @click="handlePhoneLogin"
            >
              登录
            </button>
          </div>

          <!-- 邮箱登录 -->
          <div v-show="activeTab === 'email'" class="space-y-4">
            <div>
              <label class="block text-sm text-white/70 mb-2">邮箱</label>
              <input 
                v-model="emailForm.email"
                type="email" 
                placeholder="请输入邮箱"
                class="w-full px-4 py-3 bg-white/5 border border-primary/30 rounded-lg text-white text-sm focus:outline-none focus:border-primary"
              >
            </div>
            <div>
              <label class="block text-sm text-white/70 mb-2">密码</label>
              <input 
                v-model="emailForm.password"
                type="password" 
                placeholder="请输入密码"
                class="w-full px-4 py-3 bg-white/5 border border-primary/30 rounded-lg text-white text-sm focus:outline-none focus:border-primary"
              >
            </div>
            <button 
              class="w-full py-3.5 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
              @click="handleEmailLogin"
            >
              登录
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const { loginWithPhone, loginWithEmail, sendVerifyCode } = useAuth()

const activeTab = ref<'phone' | 'email'>('phone')
const countdown = ref(0)

const phoneForm = reactive({
  phone: '',
  code: ''
})

const emailForm = reactive({
  email: '',
  password: ''
})

const closeModal = () => {
  emit('update:modelValue', false)
}

const sendCode = async () => {
  if (!phoneForm.phone) {
    alert('请输入手机号')
    return
  }
  const result = await sendVerifyCode(phoneForm.phone)
  if (result.success) {
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) clearInterval(timer)
    }, 1000)
  }
}

const handlePhoneLogin = async () => {
  if (!phoneForm.phone || !phoneForm.code) {
    alert('请填写完整信息')
    return
  }
  const result = await loginWithPhone(phoneForm.phone, phoneForm.code)
  if (result.success) {
    closeModal()
    alert('登录成功')
  } else {
    alert(result.error || '登录失败')
  }
}

const handleEmailLogin = async () => {
  if (!emailForm.email || !emailForm.password) {
    alert('请填写完整信息')
    return
  }
  const result = await loginWithEmail(emailForm.email, emailForm.password)
  if (result.success) {
    closeModal()
    alert('登录成功')
  } else {
    alert(result.error || '登录失败')
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from > div {
  transform: scale(0.95);
  opacity: 0;
}
</style>
