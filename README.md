# COCO CLAW Web

AI API 平台的 C 端页面，基于 Nuxt.js 3.x 构建。

## 技术栈

- **框架**: Nuxt.js 3.x
- **样式**: TailwindCSS
- **UI 组件**: Vant 4.x
- **语言**: TypeScript

## 页面结构

1. **首页** (`/`) - Hero区域、热门模型轮播、特性卡片、FAQ问答
2. **模型页** (`/models`) - 模型筛选、模型卡片网格
3. **充值页** (`/pricing`) - 余额展示、套餐卡片、支付方式
4. **控制台** (`/console`) - 概览统计、API密钥管理、使用统计、消费记录
5. **文档页** (`/docs`) - 左侧导航、章节内容

## 功能特性

- 深色渐变主题设计
- 响应式布局
- 模型轮播（支持拖拽、触摸滑动、自动播放）
- 模型筛选功能
- 充值套餐选择
- 支付方式切换
- 登录弹窗（手机号/邮箱）
- 页面切换动画

## 安装运行

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 项目结构

```
tokenshop-web/
├── assets/
│   └── css/
│       └── main.css          # 全局样式
├── components/
│   ├── LoginModal.vue         # 登录弹窗组件
│   ├── ModelCard.vue          # 模型卡片组件
│   └── ModelCarousel.vue      # 模型轮播组件
├── composables/
│   ├── useApi.ts              # API 请求组合式函数
│   └── useAuth.ts             # 认证组合式函数
├── layouts/
│   └── default.vue            # 默认布局（导航栏+页脚）
├── pages/
│   ├── index.vue              # 首页
│   ├── models.vue             # 模型页
│   ├── pricing.vue            # 充值页
│   ├── console.vue            # 控制台
│   └── docs.vue               # 文档页
├── plugins/
│   └── vant.ts                # Vant 插件
├── app.vue                    # 应用入口
├── nuxt.config.ts             # Nuxt 配置
├── package.json               # 依赖配置
├── tailwind.config.js         # TailwindCSS 配置
└── tsconfig.json              # TypeScript 配置
```

## API 对接

项目使用 `$fetch` 调用后端 API，API 基础 URL 通过 `runtimeConfig` 配置：

```typescript
// nuxt.config.ts
runtimeConfig: {
  public: {
    apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://api.cococlaw.com/v1'
  }
}
```

### API 接口

| 页面 | 接口 | 方法 | 说明 |
|------|------|------|------|
| 首页/模型页 | `/api/models` | GET | 获取模型列表 |
| 充值页 | `/api/packages` | GET | 获取套餐列表 |
| 充值页 | `/api/orders` | POST | 创建订单 |
| 控制台 | `/api/user/info` | GET | 获取用户信息 |
| 控制台 | `/api/keys` | GET/POST | API 密钥管理 |
| 控制台 | `/api/usage/stats` | GET | 使用统计 |
| 控制台 | `/api/usage/records` | GET | 消费记录 |

## 环境变量

创建 `.env` 文件：

```env
NUXT_PUBLIC_API_BASE_URL=https://api.cococlaw.com/v1
```

## 许可证

MIT License
