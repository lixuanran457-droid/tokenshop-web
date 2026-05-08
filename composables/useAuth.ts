// Auth composable
interface User {
  id: string
  phone?: string
  email?: string
  balance: number
}

interface AuthState {
  user: User | null
  token: string | null
  isLoggedIn: boolean
}

const authState = reactive<AuthState>({
  user: null,
  token: null,
  isLoggedIn: false
})

export const useAuth = () => {
  const config = useRuntimeConfig()
  
  const loginWithPhone = async (phone: string, code: string) => {
    try {
      const res = await $fetch<{ token: string; user: User }>(`${config.public.apiBaseUrl}/auth/login/phone`, {
        method: 'POST',
        body: { phone, code }
      })
      authState.token = res.token
      authState.user = res.user
      authState.isLoggedIn = true
      if (process.client) {
        localStorage.setItem('token', res.token)
      }
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const loginWithEmail = async (email: string, password: string) => {
    try {
      const res = await $fetch<{ token: string; user: User }>(`${config.public.apiBaseUrl}/auth/login/email`, {
        method: 'POST',
        body: { email, password }
      })
      authState.token = res.token
      authState.user = res.user
      authState.isLoggedIn = true
      if (process.client) {
        localStorage.setItem('token', res.token)
      }
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const sendVerifyCode = async (phone: string) => {
    try {
      await $fetch(`${config.public.apiBaseUrl}/auth/send-code`, {
        method: 'POST',
        body: { phone }
      })
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    authState.user = null
    authState.token = null
    authState.isLoggedIn = false
    if (process.client) {
      localStorage.removeItem('token')
    }
  }

  const checkAuth = async () => {
    if (process.client) {
      const token = localStorage.getItem('token')
      if (token) {
        authState.token = token
        try {
          const res = await $fetch<{ user: User }>(`${config.public.apiBaseUrl}/user/info`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          authState.user = res.user
          authState.isLoggedIn = true
        } catch {
          logout()
        }
      }
    }
  }

  return {
    user: computed(() => authState.user),
    isLoggedIn: computed(() => authState.isLoggedIn),
    token: computed(() => authState.token),
    loginWithPhone,
    loginWithEmail,
    sendVerifyCode,
    logout,
    checkAuth
  }
}
