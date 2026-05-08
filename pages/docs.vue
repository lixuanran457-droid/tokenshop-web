<template>
  <div class="flex min-h-[calc(100vh-64px)]">
    <!-- 左侧导航 -->
    <div class="w-[260px] bg-[rgba(15,12,41,0.6)] border-r border-primary/20 py-8 px-6 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
      <h3 class="text-xs text-white/40 uppercase tracking-wider mb-4">目录</h3>
      <nav class="space-y-1">
        <button 
          v-for="section in sections" 
          :key="section.id"
          :class="[
            'w-full px-3.5 py-2.5 text-sm rounded-lg text-left transition-all duration-200',
            activeSection === section.id ? 'bg-primary/20 text-white' : 'text-white/60 hover:bg-primary/10 hover:text-white'
          ]"
          @click="activeSection = section.id"
        >
          {{ section.name }}
        </button>
      </nav>
    </div>

    <!-- 内容区 -->
    <div class="flex-1 p-12 max-w-[900px]">
      <!-- 简介 -->
      <div v-show="activeSection === 'intro'" class="animate-fade-in">
        <h1 class="text-3xl font-bold mb-6">COCO CLAW API 简介</h1>
        <p class="text-white/70 leading-relaxed mb-6">
          COCO CLAW 提供统一的 API 接口，让您可以轻松访问多种顶级大模型，包括 GPT-4、Claude、Gemini、DeepSeek 等。
        </p>
        
        <h2 class="text-xl font-semibold mt-8 mb-4">核心优势</h2>
        <p class="text-white/70 leading-relaxed">
          • 统一接口：一次对接，访问所有模型<br>
          • 稳定快速：针对中国大陆优化的网络<br>
          • 透明计费：按实际使用量计费<br>
          • 技术支持：7×24 小时客服支持
        </p>
        
        <h2 class="text-xl font-semibold mt-8 mb-4">基础 URL</h2>
        <div class="code-block">
          <code>https://api.cococlaw.com/v1</code>
        </div>
        
        <h2 class="text-xl font-semibold mt-8 mb-4">认证方式</h2>
        <p class="text-white/70 leading-relaxed mb-4">所有 API 请求都需要在 Header 中携带您的 API 密钥：</p>
        <div class="code-block">
          <code>Authorization: Bearer YOUR_API_KEY</code>
        </div>
      </div>

      <!-- 快速开始 -->
      <div v-show="activeSection === 'quickstart'" class="animate-fade-in">
        <h1 class="text-3xl font-bold mb-6">快速开始</h1>
        <p class="text-white/70 leading-relaxed mb-6">
          只需三个简单步骤，即可开始使用 COCO CLAW API。
        </p>
        
        <h2 class="text-xl font-semibold mt-8 mb-4">步骤 1：注册账户</h2>
        <p class="text-white/70 leading-relaxed">
          访问 COCO CLAW 网站，点击注册按钮，填写手机号或邮箱完成注册。
        </p>
        
        <h2 class="text-xl font-semibold mt-8 mb-4">步骤 2：获取 API 密钥</h2>
        <p class="text-white/70 leading-relaxed">
          登录后进入控制台，点击「API 密钥」页面，创建您的第一个密钥。
        </p>
        
        <h2 class="text-xl font-semibold mt-8 mb-4">步骤 3：开始调用</h2>
        <div class="code-block">
          <code>
            curl https://api.cococlaw.com/v1/chat/completions \<br>
            -H "Authorization: Bearer YOUR_API_KEY" \<br>
            -H "Content-Type: application/json" \<br>
            -d '{"model": "gpt-4o", "messages": [{"role": "user", "content": "Hello!"}]}'
          </code>
        </div>
      </div>

      <!-- 认证 -->
      <div v-show="activeSection === 'auth'" class="animate-fade-in">
        <h1 class="text-3xl font-bold mb-6">认证方式</h1>
        <p class="text-white/70 leading-relaxed mb-6">
          COCO CLAW 使用 API 密钥进行认证。
        </p>
        
        <h2 class="text-xl font-semibold mt-8 mb-4">获取 API 密钥</h2>
        <p class="text-white/70 leading-relaxed">
          登录后进入控制台 → API 密钥 → 创建密钥。
        </p>
        
        <h2 class="text-xl font-semibold mt-8 mb-4">安全提示</h2>
        <p class="text-white/70 leading-relaxed">
          • 不要在公开场合分享您的 API 密钥<br>
          • 定期更换密钥<br>
          • 如密钥泄露，请立即删除并重新创建
        </p>
      </div>

      <!-- 模型接口 -->
      <div v-show="activeSection === 'api'" class="animate-fade-in">
        <h1 class="text-3xl font-bold mb-6">模型接口</h1>
        <p class="text-white/70 leading-relaxed mb-6">
          COCO CLAW 支持以下模型：
        </p>
        
        <h2 class="text-xl font-semibold mt-8 mb-4">聊天补全</h2>
        <div class="code-block">
          <code>POST /v1/chat/completions</code>
        </div>
        
        <h2 class="text-xl font-semibold mt-8 mb-4">支持的模型</h2>
        <p class="text-white/70 leading-relaxed">
          • gpt-4o, gpt-4, gpt-3.5-turbo (OpenAI)<br>
          • claude-3-opus, claude-3-sonnet, claude-3-haiku (Anthropic)<br>
          • gemini-pro, gemini-3.1-flash (Google)<br>
          • deepseek-chat, deepseek-coder (DeepSeek)<br>
          • moonshot-v1 (Moonshot)<br>
          • glm-5, glm-4 (智谱AI)
        </p>
      </div>

      <!-- 代码示例 -->
      <div v-show="activeSection === 'examples'" class="animate-fade-in">
        <h1 class="text-3xl font-bold mb-6">代码示例</h1>
        
        <h2 class="text-xl font-semibold mt-8 mb-4">Python 示例</h2>
        <div class="code-block">
          <code>
            from openai import OpenAI<br><br>
            client = OpenAI(<br>
            &nbsp;&nbsp;api_key="YOUR_API_KEY",<br>
            &nbsp;&nbsp;base_url="https://api.cococlaw.com/v1"<br>
            )<br><br>
            response = client.chat.completions.create(<br>
            &nbsp;&nbsp;model="gpt-4o",<br>
            &nbsp;&nbsp;messages=[{"role": "user", "content": "Hello!"}]<br>
            )
          </code>
        </div>
      </div>

      <!-- 计费说明 -->
      <div v-show="activeSection === 'billing'" class="animate-fade-in">
        <h1 class="text-3xl font-bold mb-6">计费说明</h1>
        
        <h2 class="text-xl font-semibold mt-8 mb-4">计费方式</h2>
        <p class="text-white/70 leading-relaxed mb-6">
          COCO CLAW 按实际使用量计费，采用后付费模式。
        </p>
        
        <h2 class="text-xl font-semibold mt-8 mb-4">免费额度</h2>
        <p class="text-white/70 leading-relaxed mb-6">
          新用户注册即送 5 元免费体验额度。
        </p>
        
        <h2 class="text-xl font-semibold mt-8 mb-4">充值方式</h2>
        <p class="text-white/70 leading-relaxed">
          支持微信支付、支付宝、信用卡（Visa/MasterCard）及银行转账。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const activeSection = ref('intro')

const sections = [
  { id: 'intro', name: '简介' },
  { id: 'quickstart', name: '快速开始' },
  { id: 'auth', name: '认证' },
  { id: 'api', name: '模型接口' },
  { id: 'examples', name: '代码示例' },
  { id: 'billing', name: '计费说明' }
]

useHead({
  title: '文档 - COCO CLAW'
})
</script>
