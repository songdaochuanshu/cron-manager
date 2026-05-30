# 🐾 小爪定时任务管理台

东方文人风格的定时任务管理平台，基于 Nuxt 3 全栈架构。

## 技术栈

- **Nuxt 3** — Vue 3 全栈框架
- **Nitro** — 内置服务端，API Routes 一体化
- **Noto Serif SC / ZCOOL XiaoWei** — 宋体/小薇字体
- **水墨丹青配色** — 墨色、宣纸、朱砂、青瓷

## 特色

- 📊 总览仪表盘 — 任务统计一览
- 📋 任务管理 — 创建/编辑/启停/手动触发
- 📜 执行日志 — 查看所有任务执行记录
- 🎨 东方文人风 UI — 水墨丹青，素雅大方

## 快速开始

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入 OpenClaw Gateway 地址和 Token

# 开发模式
npm run dev

# 构建
npm run build

# 预览
npm run preview
```

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `OPENCLAW_GATEWAY_URL` | OpenClaw Gateway 地址 | `http://localhost:18789` |
| `OPENCLAW_TOKEN` | OpenClaw API Token | — |

## 项目结构

```
cron-manager/
├── assets/css/          # 全局样式（东方文人风）
├── components/          # Vue 组件
│   └── CreateJobForm.vue
├── composables/         # 组合式函数
│   └── useCronApi.ts
├── layouts/             # 布局
│   └── default.vue
├── pages/               # 页面（自动生成路由）
│   ├── index.vue        # 总览
│   ├── jobs/
│   │   ├── index.vue    # 任务列表
│   │   └── [id].vue     # 任务详情
│   └── logs.vue         # 执行日志
├── server/              # 服务端 API
│   └── api/cron/        # Cron API 代理
├── nuxt.config.ts       # Nuxt 配置
└── package.json
```

## 部署

### Cloudflare Pages

```bash
npm run build
# 输出目录: .output/public
```

### Node.js 服务

```bash
npm run build
node .output/server/index.mjs
```

---

_东方文人风 · 水墨丹青 · 小爪出品 🐾_
