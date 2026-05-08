// API composable
interface Model {
  id: string
  name: string
  provider: string
  providerClass: string
  desc: string
  color: string
  price: string
}

interface Package {
  id: string
  amount: number
  credits: number
  validMonths: number
  features: string[]
  popular?: boolean
}

interface UsageStats {
  monthlySpend: number
  monthlyRequests: number
  tokenConsumed: number
  balance: number
}

interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth()

  const getModels = async (provider?: string): Promise<Model[]> => {
    try {
      const params = provider && provider !== 'all' ? { provider } : {}
      const res = await $fetch<ApiResponse<Model[]>>(`${config.public.apiBaseUrl}/models`, { params })
      return res.data || []
    } catch {
      // Return mock data if API not available
      return getMockModels(provider)
    }
  }

  const getPackages = async (): Promise<Package[]> => {
    try {
      const res = await $fetch<ApiResponse<Package[]>>(`${config.public.apiBaseUrl}/packages`)
      return res.data || []
    } catch {
      return getMockPackages()
    }
  }

  const createOrder = async (packageId: string, paymentMethod: string) => {
    try {
      const res = await $fetch(`${config.public.apiBaseUrl}/orders`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token.value}` },
        body: { packageId, paymentMethod }
      })
      return { success: true, data: res }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const getUsageStats = async (): Promise<UsageStats> => {
    try {
      const res = await $fetch<ApiResponse<UsageStats>>(`${config.public.apiBaseUrl}/usage/stats`, {
        headers: { Authorization: `Bearer ${token.value}` }
      })
      return res.data
    } catch {
      return getMockUsageStats()
    }
  }

  const getUsageRecords = async (page = 1, limit = 20) => {
    try {
      const res = await $fetch<ApiResponse<{ records: any[]; total: number }>>(`${config.public.apiBaseUrl}/usage/records`, {
        headers: { Authorization: `Bearer ${token.value}` },
        params: { page, limit }
      })
      return res.data
    } catch {
      return { records: [], total: 0 }
    }
  }

  const getApiKeys = async () => {
    try {
      const res = await $fetch(`${config.public.apiBaseUrl}/keys`, {
        headers: { Authorization: `Bearer ${token.value}` }
      })
      return { success: true, data: res }
    } catch {
      return { success: false, data: [] }
    }
  }

  const createApiKey = async (name: string) => {
    try {
      const res = await $fetch(`${config.public.apiBaseUrl}/keys`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token.value}` },
        body: { name }
      })
      return { success: true, data: res }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Mock data helpers
  const getMockModels = (provider?: string): Model[] => {
    const models: Model[] = [
      { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', providerClass: 'openai', desc: 'OpenAI 最新旗舰模型，支持多模态', color: '#10a37f', price: '¥0.1' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', providerClass: 'openai', desc: '高速版 GPT-4，上下文 128K', color: '#10a37f', price: '¥0.3' },
      { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', providerClass: 'anthropic', desc: 'Anthropic 最强模型，编程能力强', color: '#d97706', price: '¥0.1' },
      { id: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro', provider: 'Google', providerClass: 'google', desc: 'Google 旗舰模型，超长上下文', color: '#4285f4', price: '¥0.05' },
      { id: 'gemini-3.1-flash', name: 'Gemini 3.1 Flash', provider: 'Google', providerClass: 'google', desc: '高速响应优化版', color: '#4285f4', price: '¥0.01' },
      { id: 'deepseek-v4-pro', name: 'DeepSeek V4-Pro', provider: 'DeepSeek', providerClass: 'deepseek', desc: '开源旗舰 MoE 模型', color: '#1e40af', price: '¥0.1' },
      { id: 'deepseek-v4-flash', name: 'DeepSeek V4-Flash', provider: 'DeepSeek', providerClass: 'deepseek', desc: '高速轻量版', color: '#1e40af', price: '¥0.025' },
      { id: 'kimi-k2.6', name: 'Kimi K2.6', provider: 'Moonshot AI', providerClass: 'kimi', desc: '月之暗面最强开源模型', color: '#8b5cf6', price: '¥0.02' },
      { id: 'glm-5.1', name: 'GLM-5.1', provider: '智谱AI', providerClass: 'zhipu', desc: '智谱最强开源模型', color: '#00d4aa', price: '¥0.08' }
    ]
    if (!provider || provider === 'all') return models
    return models.filter(m => m.providerClass === provider)
  }

  const getMockPackages = (): Package[] => [
    { id: 'pkg-10', amount: 10, credits: 10, validMonths: 6, features: ['有效期 6 个月'] },
    { id: 'pkg-50', amount: 50, credits: 50, validMonths: 12, features: ['有效期 12 个月'], popular: true },
    { id: 'pkg-100', amount: 100, credits: 100, validMonths: 12, features: ['有效期 12 个月'] },
    { id: 'pkg-500', amount: 500, credits: 500, validMonths: 24, features: ['专属客服支持', '有效期 24 个月'] }
  ]

  const getMockUsageStats = (): UsageStats => ({
    monthlySpend: 0,
    monthlyRequests: 0,
    tokenConsumed: 0,
    balance: 0
  })

  return {
    getModels,
    getPackages,
    createOrder,
    getUsageStats,
    getUsageRecords,
    getApiKeys,
    createApiKey
  }
}
