// Auth composable
interface User {
  id: string
  phone?: string
  email?: string
  balance: number
  username?: string
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
  
  /**
   * 统一登录接口
   * @param account 账号（手机号或邮箱）
   * @param loginType 登录方式: password-密码登录, code-验证码登录
   * @param accountType 账号类型: phone-手机号, email-邮箱
   * @param password 密码（密码登录时必填）
   * @param code 验证码（验证码登录时必填）
   */
  const login = async (
    account: string, 
    loginType: 'password' | 'code',
    accountType: 'phone' | 'email',
    password?: string,
    code?: string
  ) => {
    try {
      const res = await $fetch<{ accessToken: string; user: User }>(`${config.public.apiBaseUrl}/auth/login`, {
        method: 'POST',
        body: { account, loginType, accountType, password, code }
      })
      authState.token = res.accessToken
      authState.user = res.user
      authState.isLoggedIn = true
      if (process.client) {
        localStorage.setItem('token', res.accessToken)
      }
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.data?.message || error.message }
    }
  }

  /**
   * 发送验证码
   * @param account 账号（手机号或邮箱）
   * @param type 类型: login-登录, register-注册
   */
  const sendVerifyCode = async (account: string, type: 'login' | 'register') => {
    try {
      await $fetch(`${config.public.apiBaseUrl}/auth/sendCode`, {
        method: 'POST',
        body: { phoneOrEmail: account, type }
      })
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.data?.message || error.message }
    }
  }

  /**
   * 注册
   * @param account 账号（手机号或邮箱）
   * @param accountType 账号类型: phone-手机号, email-邮箱
   * @param password 密码
   * @param code 验证码
   * @param username 用户名（可选）
   */
  const register = async (
    account: string,
    accountType: 'phone' | 'email',
    password: string,
    code: string,
    username?: string
  ) => {
    try {
      const res = await $fetch<{ accessToken: string; user: User }>(`${config.public.apiBaseUrl}/auth/register`, {
        method: 'POST',
        body: { 
          phone: accountType === 'phone' ? account : undefined,
          email: accountType === 'email' ? account : undefined,
          password,
          code,
          username,
          registerType: accountType
        }
      })
      authState.token = res.accessToken
      authState.user = res.user
      authState.isLoggedIn = true
      if (process.client) {
        localStorage.setItem('token', res.accessToken)
      }
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.data?.message || error.message }
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
          const res = await $fetch<{ data: { user: User } }>(`${config.public.apiBaseUrl}/user/info`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          authState.user = res.data.user
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
    login,
    register,
    sendVerifyCode,
    logout,
    checkAuth
  }
}
