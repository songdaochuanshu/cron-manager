export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  app: {
    head: {
      title: '小爪定时任务管理台',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '东方文人风格的定时任务管理平台' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=ZCOOL+XiaoWei&display=swap' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  nitro: {
    routeRules: {
      '/api/**': { cors: true }
    }
  },
  runtimeConfig: {
    openclawGatewayUrl: process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:18789',
    openclawToken: process.env.OPENCLAW_TOKEN || '',
    public: {
      appName: '小爪定时任务管理台'
    }
  }
})
