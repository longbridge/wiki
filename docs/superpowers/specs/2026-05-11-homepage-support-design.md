# 首页改版设计文档 — HomeSupport

**日期：** 2026-05-11
**来源：** Figma `cBCEXqoNoTBRzWmBj7L9ay` node `1:2`
**范围：** 替换 `zh-CN/index.md` 使用的 `HomeCards.vue`，`HomeCards.vue` 本体保留不删。

---

## 1. 目标

将当前营销风格首页改版为以「找答案」为核心的支持文档首页，对标 Figma 设计稿，同时整合已有 AI 问答后端能力。

**不在范围内：**
- 修改 VitePress 全局 NavBar 配置
- 改动 en / zh-HK 语言的首页（沿用 HomeCards.vue）
- 最火热榜 Section（Figma 有，本次不实现）

---

## 2. 页面结构

```
zh-CN/index.md
  layout: page
  sidebar: false
  → <HomeSupport />
      ├── HeroSection.vue
      ├── FindWaysSection.vue
      ├── AIFeatureSection.vue
      ├── TopicsGrid.vue
      └── FooterCTA.vue
          (共用) AIModal.vue  ← 全局浮层，由 provide/inject 驱动
```

### 各 Section 职责

| 组件 | 内容 | 交互 |
|------|------|------|
| `HeroSection.vue` | 大字标题「有问题，直接问 / 答案在这里」、副标题、搜索框、「向AI提问」+ 「浏览所有文档」按钮 | 搜索框回车 → 打开 AIModal（query 预填）；「向AI提问」→ 打开 AIModal（空 query）；「浏览所有文档」→ 页面内平滑滚动至 TopicsGrid |
| `FindWaysSection.vue` | 「三种方式，找到你要的答案」三卡片：搜索文档 / AI 智能问答（高亮）/ 按主题浏览 | AI 智能问答卡片点击 → 打开 AIModal；搜索文档点击 → VitePress 搜索；按主题浏览 → 滚动到 TopicsGrid |
| `AIFeatureSection.vue` | 左文右图：自然语言提问介绍文案 + AI 对话截图；特性列表（3条）；「立即体验 AI 助手」按钮 | 按钮点击 → 打开 AIModal |
| `TopicsGrid.vue` | 3×3 专题卡片网格，每张卡片含图标、分类名、文档数量、「浏览文档 →」链接 | 点击卡片 → 导航至对应分类首页 |
| `FooterCTA.vue` | 底部召唤区：大标题 + 「向AI提问」+「浏览文档库」按钮 + 三项统计数据 | 与 Hero 一致 |
| `AIModal.vue` | 全屏/居中浮层，包含对话历史列表、输入框、发送按钮、关闭按钮 | 接收初始 query，调用后端 AI API（SSE 流式） |

---

## 3. 9 大专题配置

固定顺序，动态文档数量（构建时计算）：

```ts
// HomeSupport.vue 内的配置
const TOPICS = [
  { key: 'getting-started',        icon: '⚡', label: '新手入门' },
  { key: 'account',                icon: '👤', label: '开户与账户' },
  { key: 'deposit',                icon: '⬇️', label: '入金' },
  { key: 'withdrawal',             icon: '⬆️', label: '出金' },
  { key: 'transfers-and-fx',       icon: '↔️', label: '资金划转与换汇' },
  { key: 'stock-trading',          icon: '📈', label: '股票交易' },
  { key: 'compliance-and-tax',     icon: '🛡️', label: '合规与税务' },
  { key: 'rewards',                icon: '🎁', label: '活动与奖励' },
  { key: 'portfolio-and-statements', icon: '📋', label: '资产与账单' },
]
```

---

## 4. 文档数量数据流

使用 VitePress build-time data loader，**零运行时开销**：

```
docs/.vitepress/theme/composables/topic-counts.data.ts
  ↓ createContentLoader('zh-CN/**/*.md') 按目录统计
  ↓ 生成静态 JSON { "account": 12, "deposit": 8, … }
  ↓ TopicsGrid.vue 通过 useData() 读取
```

文件路径：`docs/.vitepress/topic-counts.data.ts`（VitePress data loader 需位于 source root 下，由 TopicsGrid.vue 直接 import）

---

## 5. AI Modal 状态管理

```ts
// HomeSupport.vue 提供
provide('openAIModal', (query?: string) => {
  modalOpen.value = true
  initialQuery.value = query ?? ''
})

// 各子组件注入
const openAIModal = inject('openAIModal')
```

**后端通信：** 调用已有 AI API，支持 SSE 流式输出。具体 endpoint 及请求格式在实现阶段由后端同学确认后填入 `AIModal.vue`。

---

## 6. 文件变更清单

### 新增文件

```
docs/.vitepress/theme/components/
├── HomeSupport.vue                      ← 入口编排组件
├── sections/
│   ├── HeroSection.vue
│   ├── FindWaysSection.vue
│   ├── AIFeatureSection.vue
│   ├── TopicsGrid.vue
│   └── FooterCTA.vue
├── AIModal.vue                          ← 全局 AI 对话浮层
docs/.vitepress/
└── topic-counts.data.ts                 ← 构建时文档数量 loader（source root 级别）
```

### 修改文件

```
docs/.vitepress/theme/index.ts           ← 注册 HomeSupport 组件
docs/zh-CN/index.md                      ← <HomeCards /> → <HomeSupport />
```

### 保留不动

```
docs/.vitepress/theme/components/HomeCards.vue   ← en/zh-HK 仍使用
docs/en/index.md
docs/zh-HK/index.md
```

---

## 7. 样式约定

- 品牌主色沿用 `--vp-c-brand-1: #00b8b8`，深色模式 `#00f0c4`
- 新组件内的 CSS 使用 `<style scoped>`，不污染全局
- 响应式断点复用 VitePress 内置：`@media (max-width: 768px)`
- Hero 背景沿用现有 `HomeBackground.vue` 渐变组件（已有）

---

## 8. 不确定项（实现前需确认）

1. **AI API endpoint + 请求/响应格式** — 后端确认后填入 `AIModal.vue`
2. **AIFeatureSection 中的 AI 对话截图** — 是用真实截图还是 SVG 插画
