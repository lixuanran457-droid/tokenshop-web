<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="modelValue" 
        class="fixed inset-0 bg-black/70 flex items-center justify-center z-[200] p-4"
        @click.self="closeModal"
      >
        <div 
          class="bg-[#1a1a2e] border border-primary/30 rounded-2xl p-6 md:p-10 w-full max-w-md relative animate-fade-in"
          @click.stop
        >
          <!-- 关闭按钮 -->
          <button 
            class="absolute top-4 right-4 text-white/50 hover:text-white text-2xl transition-colors"
            @click="closeModal"
          >
            ×
          </button>

          <!-- 标题 -->
          <h2 class="text-2xl font-bold text-center mb-6">
            {{ isRegister ? '注册' : '登录' }}
          </h2>

          <!-- 账号类型切换 -->
          <div class="flex gap-2 mb-6">
            <button 
              :class="['flex-1 py-2.5 text-sm transition-all border-b-2 rounded-t-lg', activeAccountType === 'phone' ? 'text-white border-primary bg-primary/10' : 'text-white/50 border-transparent hover:text-white/80']"
              @click="activeAccountType = 'phone'"
            >
              手机号
            </button>
            <button 
              :class="['flex-1 py-2.5 text-sm transition-all border-b-2 rounded-t-lg', activeAccountType === 'email' ? 'text-white border-primary bg-primary/10' : 'text-white/50 border-transparent hover:text-white/80']"
              @click="activeAccountType = 'email'"
            >
              邮箱
            </button>
          </div>

          <!-- 表单 -->
          <form class="space-y-4" @submit.prevent="isRegister ? handleRegister() : handleLogin()">
            <!-- 账号 -->
            <div>
              <label class="block text-sm text-white/70 mb-2">{{ activeAccountType === 'phone' ? '手机号' : '邮箱' }}</label>
              <input 
                v-model="form.account"
                :type="activeAccountType === 'phone' ? 'tel' : 'email'"
                :placeholder="activeAccountType === 'phone' ? '请输入手机号' : '请输入邮箱'"
                class="w-full px-4 py-3 bg-white/5 border border-primary/30 rounded-lg text-white text-sm focus:outline-none focus:border-primary"
              >
            </div>

            <!-- 密码（登录时可选验证码登录则不显示） -->
            <div v-if="!isRegister || loginMode === 'password'">
              <label class="block text-sm text-white/70 mb-2">{{ isRegister ? '设置密码' : '密码' }}</label>
              <input 
                v-model="form.password"
                type="password" 
                :placeholder="isRegister ? '设置密码（6-32位）' : '请输入密码'"
                class="w-full px-4 py-3 bg-white/5 border border-primary/30 rounded-lg text-white text-sm focus:outline-none focus:border-primary"
              >
            </div>

            <!-- 验证码（注册必须 / 登录可选） -->
            <div v-if="isRegister || loginMode === 'code'">
              <label class="block text-sm text-white/70 mb-2">验证码</label>
              <div class="flex gap-3">
                <input 
                  v-model="form.code"
                  type="text" 
                  placeholder="请输入验证码"
                  class="flex-1 px-4 py-3 bg-white/5 border border-primary/30 rounded-lg text-white text-sm focus:outline-none focus:border-primary"
                >
                <button 
                  type="button"
                  class="px-3 md:px-4 py-3 bg-primary/20 border border-primary/30 rounded-lg text-primary-light text-xs md:text-sm whitespace-nowrap hover:bg-primary/30 transition-colors disabled:opacity-50"
                  :disabled="countdown > 0"
                  @click="handleSendCode"
                >
                  {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                </button>
              </div>
            </div>

            <!-- 登录模式切换（仅登录时显示） -->
            <div v-if="!isRegister" class="text-center">
              <button 
                type="button"
                class="text-sm text-primary-light hover:underline"
                @click="toggleLoginMode"
              >
                {{ loginMode === 'password' ? '使用验证码登录' : '使用密码登录' }}
              </button>
            </div>

            <!-- 提交按钮 -->
            <button 
              type="submit"
              class="w-full py-3.5 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50"
              :disabled="loading"
            >
              {{ loading ? '处理中...' : (isRegister ? '注册' : '登录') }}
            </button>
          </form>

          <!-- 注册/登录切换 -->
          <div class="mt-4 text-center text-sm text-white/60">
            {{ isRegister ? '已有账号？' : '没有账号？' }}
            <button 
              class="text-primary-light hover:underline ml-1"
              @click="isRegister = !isRegister; resetForm()"
            >
              {{ isRegister ? '去登录' : '立即注册' }}
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

const { login, register, sendVerifyCode } = useAuth()

const isRegister = ref(false)
const loading = ref(false)
const countdown = ref(0)
const loginMode = ref<'password' | 'code'>('password')
const activeAccountType = ref<'phone' | 'email'>('phone')

const form = reactive({
  account: '',
  password: '',
  code: ''
})

const closeModal = () => {
  emit('update:modelValue', false)
}

const resetForm = () => {
  form.account = ''
  form.password = ''
  form.code = ''
  loginMode.value = 'password'
}

const toggleLoginMode = () => {
  loginMode.value = loginMode.value === 'password' ? 'code' : 'password'
  form.password = ''
  form.code = ''
}

// 判断账号类型
const getAccountType = (): 'phone' | 'email' => {
  return activeAccountType.value
}

// 判断是否手机号
const isPhone = (value: string) => {
  return /^1[3-9]\d{9}$/.test(value)
}

// 自动判断账号类型
const autoDetectAccountType = () => {
  if (form.account) {
    if (isPhone(form.account)) {
      activeAccountType.value = 'phone'
    } else if (form.account.includes('@')) {
      activeAccountType.value = 'email'
    }
  }
}

const handleSendCode = async () => {
  if (!form.account) {
    alert('请输入账号')
    return
  }
  
  autoDetectAccountType()
  const type = isRegister.value ? 'register' : 'login'
  const result = await sendVerifyCode(form.account, type)
  
  if (result.success) {
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) clearInterval(timer)
    }, 1000)
  } else {
    alert(result.error || '发送失败')
  }
}

const handleLogin = async () => {
  if (!form.account || (!form.password && loginMode.value === 'password') || (!form.code && loginMode.value === 'code')) {
    alert('请填写完整信息')
    return
  }

  autoDetectAccountType()
  loading.value = true

  try {
    const result = await login(
      form.account,
      loginMode.value,
      activeAccountType.value,
      loginMode.value === 'password' ? form.password : undefined,
      loginMode.value === 'code' ? form.code : undefined
    )

    if (result.success) {
      closeModal()
      alert('登录成功')
    } else {
      alert(result.error || '登录失败')
    }
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  if (!form.account || !form.password || !form.code) {
    alert('请填写完整信息')
    return
  }

  if (form.password.length < 6 || form.password.length > 32) {
    alert('密码长度应为6-32位')
    return
  }

  loading.value = true

  try {
    const result = await register(
      form.account,
      activeAccountType.value,
      form.password,
      form.code
    )

    if (result.success) {
      closeModal()
      alert('注册成功')
    } else {
      alert(result.error || '注册失败')
    }
  } finally {
    loading.value = false
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
