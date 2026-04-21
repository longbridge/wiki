# P0 内容基础层 (Line B) 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 Longbridge Docs 的内容基础设施从"静态文档站"升级为"帮助中心内容底座"——包括设计令牌系统、8 个核心内容组件、首页产品化重构、分类落地页模板，以及文档详情页升级。

**Architecture:** 所有组件以 `Lb` 前缀命名并在 `theme/index.ts` 全局注册，可在任何 Markdown 文件中直接使用。首页使用 `HomePage` 复合组件替换当前 `HomeCards.vue`。主题层面扩展 CSS 令牌系统，支持 light/dark 双主题跟随系统。P0 不引入任何后端或 AI 依赖，纯前端组件。

**Tech Stack:** VitePress 1.6, Vue 3.5, UnoCSS 0.61.9, TypeScript

---

## 文件结构总览

### 新建文件
```
docs/.vitepress/theme/tokens.css                          设计令牌（渐变/表面/阴影/排版变量）
docs/.vitepress/theme/components/LbCallout.vue            提示框（info/warning/danger/tip）
docs/.vitepress/theme/components/LbSteps.vue              步骤指引容器
docs/.vitepress/theme/components/LbStep.vue               单个步骤
docs/.vitepress/theme/components/LbVideo.vue              视频嵌入（src/poster/caption）
docs/.vitepress/theme/components/LbScreenshot.vue         截图展示（带热区标注）
docs/.vitepress/theme/components/LbRateTable.vue          费率结构化表格（可切换维度）
docs/.vitepress/theme/components/LbCalculator.vue         港股费率计算器（样板实现）
docs/.vitepress/theme/components/LbAppDeepLink.vue        App 深链跳转按钮
docs/.vitepress/theme/components/HomePage/index.vue       首页主组件
docs/.vitepress/theme/components/HomePage/AskBox.vue      提问框（AI 入口占位）
docs/.vitepress/theme/components/HomePage/TaskEntry.vue   任务化入口（开户/入金/…）
docs/.vitepress/theme/components/HomePage/DomainGrid.vue  加权领域网格（16 个分类）
docs/.vitepress/theme/components/CategoryLanding.vue      分类落地页模板
docs/.vitepress/theme/components/ArticleHeader.vue        文章详情页顶部增强条
docs/superpowers/specs/2026-04-21-help-center-vision.md   产品规格文档（从 plan 提取）
```

### 修改文件
```
docs/.vitepress/theme/vars.css             扩展品牌/表面/渐变令牌，集成 tokens.css
docs/.vitepress/theme/index.ts             注册所有新组件
docs/.vitepress/config.mts                 添加 appearance: 'auto'，移除强制暗色
docs/zh-CN/index.md                        切换为 <HomePage />
docs/.vitepress/theme/layouts/Layout.vue   插入 <ArticleHeader />
```

---

## Task 1: 建立功能分支

**Files:**
- 无（git 操作）

- [ ] **Step 1: 创建功能分支**

```bash
git checkout -b feat/p0-content-foundation
```

Expected: Switched to a new branch 'feat/p0-content-foundation'

---

## Task 2: 扩展设计令牌系统

**Files:**
- Create: `docs/.vitepress/theme/tokens.css`
- Modify: `docs/.vitepress/theme/vars.css`

- [ ] **Step 1: 创建 tokens.css**

```css
/* docs/.vitepress/theme/tokens.css */
/* Longbridge 设计令牌 — 表面、渐变、阴影、排版 */

:root {
  /* 渐变 */
  --lb-grad-mint:    linear-gradient(135deg, #00b8b8 0%, #00d4a8 100%);
  --lb-grad-ocean:   linear-gradient(135deg, #0066cc 0%, #00b8b8 100%);
  --lb-grad-sunset:  linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  --lb-grad-violet:  linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
  --lb-grad-hero:    linear-gradient(160deg, #e8fffe 0%, #f0fff8 40%, #ffffff 100%);

  /* 表面 */
  --lb-bg:           var(--vp-c-bg);
  --lb-bg-soft:      var(--vp-c-bg-soft);
  --lb-bg-mute:      var(--vp-c-bg-mute);
  --lb-border:       var(--vp-c-divider);
  --lb-border-soft:  color-mix(in oklab, var(--vp-c-divider) 50%, transparent);

  /* 卡片 */
  --lb-card-bg:      var(--vp-c-bg-soft);
  --lb-card-border:  var(--vp-c-divider);
  --lb-card-radius:  12px;
  --lb-card-shadow:  0 1px 4px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.04);
  --lb-card-shadow-hover: 0 4px 16px rgba(0,0,0,.10), 0 8px 32px rgba(0,0,0,.06);

  /* 文字 */
  --lb-text:         var(--vp-c-text-1);
  --lb-text-soft:    var(--vp-c-text-2);
  --lb-text-mute:    var(--vp-c-text-3);

  /* 间距 */
  --lb-space-xs:     4px;
  --lb-space-sm:     8px;
  --lb-space-md:     16px;
  --lb-space-lg:     24px;
  --lb-space-xl:     40px;
  --lb-space-2xl:    64px;

  /* 圆角 */
  --lb-radius-sm:    6px;
  --lb-radius-md:    10px;
  --lb-radius-lg:    16px;
  --lb-radius-xl:    24px;
  --lb-radius-full:  9999px;

  /* 过渡 */
  --lb-transition:   all 0.2s ease;
}

.dark {
  --lb-grad-hero:    linear-gradient(160deg, #0a1628 0%, #0d1f1f 40%, #111827 100%);
  --lb-card-bg:      rgba(255,255,255,0.04);
  --lb-card-border:  rgba(255,255,255,0.08);
  --lb-card-shadow:  0 1px 4px rgba(0,0,0,.3), 0 4px 16px rgba(0,0,0,.2);
  --lb-card-shadow-hover: 0 4px 16px rgba(0,0,0,.4), 0 8px 32px rgba(0,0,0,.3);
}
```

- [ ] **Step 2: 更新 vars.css，引入 appearance 支持并移除旧的暗色强制**

```css
/* docs/.vitepress/theme/vars.css */
@import './tokens.css';

/* Longbridge 品牌色覆盖 VitePress 默认靛蓝色 */

:root {
  --vp-c-brand-1: #00b8b8;
  --vp-c-brand-2: #1ac7c7;
  --vp-c-brand-3: #33cdcd;
  --vp-c-brand-soft: rgba(0, 184, 184, 0.12);
}

.dark {
  --vp-c-brand-1: #00f0c4;
  --vp-c-brand-2: #32eadc;
  --vp-c-brand-3: #2ed4c7;
  --vp-c-brand-soft: rgba(0, 240, 196, 0.12);
}
```

- [ ] **Step 3: 确认 config.mts 中启用 appearance: 'auto'**

在 `docs/.vitepress/config.mts` 的 `defineConfig({...})` 第一层加入：

```ts
appearance: 'auto',
```

（如已有 `appearance` 字段则改为 `'auto'`；如无则在 `ignoreDeadLinks` 下面新增一行）

- [ ] **Step 4: 启动 dev server 验证令牌系统**

```bash
bun dev
```

打开 http://localhost:5173，切换浏览器系统颜色模式，确认 hero 背景渐变随主题切换。

- [ ] **Step 5: Commit**

```bash
git add docs/.vitepress/theme/tokens.css docs/.vitepress/theme/vars.css docs/.vitepress/config.mts
git commit -m "feat(theme): add design token system and enable appearance auto"
```

---

## Task 3: LbCallout 提示框组件

**Files:**
- Create: `docs/.vitepress/theme/components/LbCallout.vue`
- Modify: `docs/.vitepress/theme/index.ts`

用法示例：
```md
<Callout type="warning" title="注意">港股交易时间以香港交易所为准。</Callout>
```

- [ ] **Step 1: 创建 LbCallout.vue**

```vue
<!-- docs/.vitepress/theme/components/LbCallout.vue -->
<script setup lang="ts">
defineProps<{
  type?: 'info' | 'tip' | 'warning' | 'danger'
  title?: string
}>()
</script>

<template>
  <div class="lb-callout" :class="`lb-callout--${type ?? 'info'}`">
    <div v-if="title" class="lb-callout__title">{{ title }}</div>
    <div class="lb-callout__body"><slot /></div>
  </div>
</template>

<style scoped>
.lb-callout {
  border-radius: var(--lb-radius-md);
  padding: var(--lb-space-md);
  margin: var(--lb-space-lg) 0;
  border-left: 3px solid;
  background: var(--lb-bg-soft);
}

.lb-callout--info    { border-color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }
.lb-callout--tip     { border-color: #10b981;              background: rgba(16,185,129,.08); }
.lb-callout--warning { border-color: #f59e0b;              background: rgba(245,158,11,.08); }
.lb-callout--danger  { border-color: #ef4444;              background: rgba(239,68,68,.08); }

.lb-callout__title {
  font-weight: 600;
  margin-bottom: var(--lb-space-xs);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.lb-callout--info    .lb-callout__title { color: var(--vp-c-brand-1); }
.lb-callout--tip     .lb-callout__title { color: #10b981; }
.lb-callout--warning .lb-callout__title { color: #f59e0b; }
.lb-callout--danger  .lb-callout__title { color: #ef4444; }

.lb-callout__body { color: var(--lb-text); font-size: 0.95rem; line-height: 1.6; }
</style>
```

- [ ] **Step 2: 注册到 index.ts**

打开 `docs/.vitepress/theme/index.ts`，在 import 区和 `enhanceApp` 中各加一行：

```ts
import LbCallout from './components/LbCallout.vue'
// ...其他 import

enhanceApp({ app }) {
  app.component('LbCallout', LbCallout)
  // ...其他已有注册
}
```

- [ ] **Step 3: 验证组件**

临时在任意 Markdown 文件中加入并检查渲染：

```md
<Callout type="warning" title="测试">内容。</Callout>
```

确认四种类型颜色正确，暗色模式下对比度合格后移除测试代码。

- [ ] **Step 4: Commit**

```bash
git add docs/.vitepress/theme/components/LbCallout.vue docs/.vitepress/theme/index.ts
git commit -m "feat(components): add LbCallout component"
```

---

## Task 4: LbSteps / LbStep 步骤指引组件

**Files:**
- Create: `docs/.vitepress/theme/components/LbSteps.vue`
- Create: `docs/.vitepress/theme/components/LbStep.vue`
- Modify: `docs/.vitepress/theme/index.ts`

用法示例：
```md
<Steps>
  <Step title="打开长桥 App">点击底部「市场」标签。</Step>
  <Step title="选择港股">搜索股票代码。</Step>
</Steps>
```

- [ ] **Step 1: 创建 LbStep.vue**

```vue
<!-- docs/.vitepress/theme/components/LbStep.vue -->
<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <li class="lb-step">
    <div class="lb-step__header">
      <span class="lb-step__number"></span>
      <span class="lb-step__title">{{ title }}</span>
    </div>
    <div class="lb-step__body"><slot /></div>
  </li>
</template>

<style scoped>
.lb-step {
  display: flex;
  flex-direction: column;
  gap: var(--lb-space-xs);
  padding: var(--lb-space-md) 0;
  position: relative;
}

.lb-step__header {
  display: flex;
  align-items: center;
  gap: var(--lb-space-sm);
}

.lb-step__number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  counter-increment: lb-step-counter;
}

.lb-step__number::before {
  content: counter(lb-step-counter);
}

.lb-step__title {
  font-weight: 600;
  font-size: 1rem;
  color: var(--lb-text);
}

.lb-step__body {
  padding-left: 32px;
  color: var(--lb-text-soft);
  font-size: 0.95rem;
  line-height: 1.6;
}
</style>
```

- [ ] **Step 2: 创建 LbSteps.vue**

```vue
<!-- docs/.vitepress/theme/components/LbSteps.vue -->
<template>
  <ol class="lb-steps">
    <slot />
  </ol>
</template>

<style scoped>
.lb-steps {
  list-style: none;
  padding: 0;
  margin: var(--lb-space-lg) 0;
  counter-reset: lb-step-counter;
  border-left: 2px solid var(--lb-border);
  padding-left: var(--lb-space-lg);
}
</style>
```

- [ ] **Step 3: 注册到 index.ts**

```ts
import LbSteps from './components/LbSteps.vue'
import LbStep from './components/LbStep.vue'
// ...

app.component('LbSteps', LbSteps)
app.component('LbStep', LbStep)
```

- [ ] **Step 4: Commit**

```bash
git add docs/.vitepress/theme/components/LbSteps.vue docs/.vitepress/theme/components/LbStep.vue docs/.vitepress/theme/index.ts
git commit -m "feat(components): add LbSteps/LbStep components"
```

---

## Task 5: LbVideo 视频嵌入组件

**Files:**
- Create: `docs/.vitepress/theme/components/LbVideo.vue`
- Modify: `docs/.vitepress/theme/index.ts`

用法示例：
```md
<Video src="https://cdn.example.com/demo.mp4" poster="/img/thumb.jpg" caption="长桥 App 下单演示" />
```

- [ ] **Step 1: 创建 LbVideo.vue**

```vue
<!-- docs/.vitepress/theme/components/LbVideo.vue -->
<script setup lang="ts">
defineProps<{
  src: string
  poster?: string
  caption?: string
  autoplay?: boolean
}>()
</script>

<template>
  <figure class="lb-video">
    <div class="lb-video__wrapper">
      <video
        :src="src"
        :poster="poster"
        :autoplay="autoplay"
        controls
        playsinline
        class="lb-video__player"
      />
    </div>
    <figcaption v-if="caption" class="lb-video__caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.lb-video {
  margin: var(--lb-space-lg) 0;
}

.lb-video__wrapper {
  border-radius: var(--lb-radius-lg);
  overflow: hidden;
  background: #000;
  box-shadow: var(--lb-card-shadow);
  aspect-ratio: 16/9;
}

.lb-video__player {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.lb-video__caption {
  text-align: center;
  font-size: 0.875rem;
  color: var(--lb-text-mute);
  margin-top: var(--lb-space-sm);
}
</style>
```

- [ ] **Step 2: 注册到 index.ts**

```ts
import LbVideo from './components/LbVideo.vue'
app.component('LbVideo', LbVideo)
```

- [ ] **Step 3: Commit**

```bash
git add docs/.vitepress/theme/components/LbVideo.vue docs/.vitepress/theme/index.ts
git commit -m "feat(components): add LbVideo component"
```

---

## Task 6: LbScreenshot 截图热区组件

**Files:**
- Create: `docs/.vitepress/theme/components/LbScreenshot.vue`
- Modify: `docs/.vitepress/theme/index.ts`

用法示例（`spots` 是热区数组，x/y 是相对图片的百分比位置）：
```md
<Screenshot
  src="/img/trade-order.png"
  alt="下单页面"
  :spots="[
    { x: 72, y: 38, label: '输入股数' },
    { x: 50, y: 85, label: '点击买入' }
  ]"
/>
```

- [ ] **Step 1: 创建 LbScreenshot.vue**

```vue
<!-- docs/.vitepress/theme/components/LbScreenshot.vue -->
<script setup lang="ts">
defineProps<{
  src: string
  alt?: string
  spots?: Array<{ x: number; y: number; label: string }>
  caption?: string
}>()
</script>

<template>
  <figure class="lb-screenshot">
    <div class="lb-screenshot__frame">
      <img :src="src" :alt="alt ?? '截图'" class="lb-screenshot__img" loading="lazy" />
      <template v-if="spots">
        <div
          v-for="(spot, i) in spots"
          :key="i"
          class="lb-screenshot__spot"
          :style="{ left: `${spot.x}%`, top: `${spot.y}%` }"
        >
          <span class="lb-screenshot__dot">{{ i + 1 }}</span>
          <span class="lb-screenshot__tooltip">{{ spot.label }}</span>
        </div>
      </template>
    </div>
    <figcaption v-if="caption" class="lb-screenshot__caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.lb-screenshot {
  margin: var(--lb-space-lg) 0;
}

.lb-screenshot__frame {
  position: relative;
  border-radius: var(--lb-radius-lg);
  overflow: hidden;
  box-shadow: var(--lb-card-shadow);
  display: inline-block;
  width: 100%;
}

.lb-screenshot__img {
  display: block;
  width: 100%;
  height: auto;
}

.lb-screenshot__spot {
  position: absolute;
  transform: translate(-50%, -50%);
}

.lb-screenshot__dot {
  width: 24px;
  height: 24px;
  background: var(--vp-c-brand-1);
  color: white;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  position: relative;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0,0,0,.3);
}

.lb-screenshot__tooltip {
  display: none;
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,.85);
  color: white;
  font-size: 0.8rem;
  padding: 4px 10px;
  border-radius: var(--lb-radius-sm);
  white-space: nowrap;
  z-index: 10;
}

.lb-screenshot__spot:hover .lb-screenshot__tooltip {
  display: block;
}

.lb-screenshot__caption {
  text-align: center;
  font-size: 0.875rem;
  color: var(--lb-text-mute);
  margin-top: var(--lb-space-sm);
}
</style>
```

- [ ] **Step 2: 注册到 index.ts**

```ts
import LbScreenshot from './components/LbScreenshot.vue'
app.component('LbScreenshot', LbScreenshot)
```

- [ ] **Step 3: Commit**

```bash
git add docs/.vitepress/theme/components/LbScreenshot.vue docs/.vitepress/theme/index.ts
git commit -m "feat(components): add LbScreenshot with hotspot annotations"
```

---

## Task 7: LbRateTable 费率结构化表格

**Files:**
- Create: `docs/.vitepress/theme/components/LbRateTable.vue`
- Modify: `docs/.vitepress/theme/index.ts`

用法示例：
```md
<RateTable
  :dimensions="['港股', '美股', 'A股']"
  :rows="[
    { item: '佣金', hk: '0.03%，最低 3 HKD', us: 'USD 0.005/股', cn: '0.025%' },
    { item: '平台费', hk: '0.03%，最低 3 HKD', us: 'USD 0.005/股', cn: '免' },
    { item: '印花税', hk: '0.13%', us: '无', cn: '0.1%（卖出）' }
  ]"
  :keys="['hk','us','cn']"
/>
```

- [ ] **Step 1: 创建 LbRateTable.vue**

```vue
<!-- docs/.vitepress/theme/components/LbRateTable.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  dimensions: string[]
  rows: Array<Record<string, string>>
  keys: string[]
}>()

const active = ref(0)
</script>

<template>
  <div class="lb-rate-table">
    <div class="lb-rate-table__tabs" role="tablist">
      <button
        v-for="(dim, i) in dimensions"
        :key="dim"
        :class="['lb-rate-table__tab', { 'is-active': active === i }]"
        role="tab"
        :aria-selected="active === i"
        @click="active = i"
      >{{ dim }}</button>
    </div>

    <div class="lb-rate-table__content">
      <table>
        <thead>
          <tr>
            <th>费用项目</th>
            <th>{{ dimensions[active] }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.item">
            <td class="lb-rate-table__item">{{ row.item }}</td>
            <td>{{ row[keys[active]] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.lb-rate-table {
  border: 1px solid var(--lb-border);
  border-radius: var(--lb-radius-lg);
  overflow: hidden;
  margin: var(--lb-space-lg) 0;
}

.lb-rate-table__tabs {
  display: flex;
  border-bottom: 1px solid var(--lb-border);
  background: var(--lb-bg-soft);
}

.lb-rate-table__tab {
  flex: 1;
  padding: var(--lb-space-sm) var(--lb-space-md);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--lb-text-soft);
  cursor: pointer;
  background: transparent;
  border: none;
  transition: var(--lb-transition);
}

.lb-rate-table__tab.is-active {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  font-weight: 600;
}

.lb-rate-table__content table {
  width: 100%;
  border-collapse: collapse;
}

.lb-rate-table__content td,
.lb-rate-table__content th {
  padding: 10px 16px;
  font-size: 0.9rem;
  border-bottom: 1px solid var(--lb-border-soft);
  text-align: left;
}

.lb-rate-table__content th {
  font-weight: 600;
  color: var(--lb-text-soft);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: var(--lb-bg-soft);
}

.lb-rate-table__item { font-weight: 500; color: var(--lb-text); }
.lb-rate-table__content tr:last-child td { border-bottom: none; }
</style>
```

- [ ] **Step 2: 注册到 index.ts**

```ts
import LbRateTable from './components/LbRateTable.vue'
app.component('LbRateTable', LbRateTable)
```

- [ ] **Step 3: Commit**

```bash
git add docs/.vitepress/theme/components/LbRateTable.vue docs/.vitepress/theme/index.ts
git commit -m "feat(components): add LbRateTable structured rate component"
```

---

## Task 8: LbCalculator 港股费率计算器

**Files:**
- Create: `docs/.vitepress/theme/components/LbCalculator.vue`
- Modify: `docs/.vitepress/theme/index.ts`

港股交易费用计算器，内置真实费率参数作为样板实现。用法：
```md
<Calculator market="hk" />
```

- [ ] **Step 1: 创建 LbCalculator.vue**

```vue
<!-- docs/.vitepress/theme/components/LbCalculator.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'

defineProps<{ market?: string }>()

const price = ref<number | null>(null)
const shares = ref<number | null>(null)

const HK_RATES = {
  commission: { rate: 0.0003, min: 3 },          // 佣金 0.03%，最低 3 HKD
  platformFee: { rate: 0.0003, min: 3 },          // 平台费 0.03%，最低 3 HKD
  stampDuty: { rate: 0.0013 },                    // 印花税 0.13%
  tradingFee: { rate: 0.000005436, min: 0.01 },   // 交易费 0.00005436%
  clearingFee: { rate: 0.00002, min: 0.01, max: 100 }, // 结算费 0.002%
}

const result = computed(() => {
  if (!price.value || !shares.value || price.value <= 0 || shares.value <= 0) return null

  const value = price.value * shares.value
  const r = HK_RATES

  const commission   = Math.max(value * r.commission.rate, r.commission.min)
  const platformFee  = Math.max(value * r.platformFee.rate, r.platformFee.min)
  const stampDuty    = Math.ceil(value * r.stampDuty.rate)  // 向上取整
  const tradingFee   = Math.max(value * r.tradingFee.rate, r.tradingFee.min)
  const clearingFee  = Math.min(Math.max(value * r.clearingFee.rate, r.clearingFee.min), r.clearingFee.max)
  const total        = commission + platformFee + stampDuty + tradingFee + clearingFee

  return {
    tradeValue: value.toFixed(2),
    commission: commission.toFixed(2),
    platformFee: platformFee.toFixed(2),
    stampDuty: stampDuty.toFixed(2),
    tradingFee: tradingFee.toFixed(4),
    clearingFee: clearingFee.toFixed(4),
    total: total.toFixed(2),
    costRate: ((total / value) * 100).toFixed(4),
  }
})

function fmt(n: string) {
  return Number(n).toLocaleString('zh-HK', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
}
</script>

<template>
  <div class="lb-calc">
    <div class="lb-calc__header">港股交易费用计算器</div>
    <div class="lb-calc__inputs">
      <label class="lb-calc__field">
        <span class="lb-calc__label">股价（HKD）</span>
        <input v-model.number="price" type="number" min="0" step="0.01" placeholder="例如 168.00" class="lb-calc__input" />
      </label>
      <label class="lb-calc__field">
        <span class="lb-calc__label">股数（股）</span>
        <input v-model.number="shares" type="number" min="0" step="100" placeholder="例如 1000" class="lb-calc__input" />
      </label>
    </div>

    <transition name="fade">
      <div v-if="result" class="lb-calc__result">
        <div class="lb-calc__summary">
          <span class="lb-calc__total-label">预估总费用</span>
          <span class="lb-calc__total-value">HKD {{ fmt(result.total) }}</span>
          <span class="lb-calc__rate">费率约 {{ result.costRate }}%（交易额 HKD {{ fmt(result.tradeValue) }}）</span>
        </div>
        <table class="lb-calc__breakdown">
          <tr><td>佣金</td><td>HKD {{ fmt(result.commission) }}</td></tr>
          <tr><td>平台费</td><td>HKD {{ fmt(result.platformFee) }}</td></tr>
          <tr><td>印花税</td><td>HKD {{ fmt(result.stampDuty) }}</td></tr>
          <tr><td>交易费</td><td>HKD {{ fmt(result.tradingFee) }}</td></tr>
          <tr><td>结算费</td><td>HKD {{ fmt(result.clearingFee) }}</td></tr>
        </table>
        <p class="lb-calc__disclaimer">以上为参考估算，实际费用以成交确认为准。印花税买卖双向收取，按每笔向上取整。</p>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.lb-calc {
  border: 1px solid var(--lb-border);
  border-radius: var(--lb-radius-lg);
  padding: var(--lb-space-lg);
  margin: var(--lb-space-lg) 0;
  background: var(--lb-card-bg);
}

.lb-calc__header {
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: var(--lb-space-md);
  color: var(--lb-text);
}

.lb-calc__inputs {
  display: flex;
  gap: var(--lb-space-md);
  flex-wrap: wrap;
  margin-bottom: var(--lb-space-md);
}

.lb-calc__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 180px;
}

.lb-calc__label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--lb-text-soft);
}

.lb-calc__input {
  border: 1px solid var(--lb-border);
  border-radius: var(--lb-radius-md);
  padding: 8px 12px;
  font-size: 0.95rem;
  background: var(--lb-bg);
  color: var(--lb-text);
  outline: none;
  transition: var(--lb-transition);
  width: 100%;
}

.lb-calc__input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.lb-calc__result {
  border-top: 1px solid var(--lb-border);
  padding-top: var(--lb-space-md);
}

.lb-calc__summary {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: var(--lb-space-md);
}

.lb-calc__total-label { font-size: 0.85rem; color: var(--lb-text-mute); }
.lb-calc__total-value { font-size: 1.5rem; font-weight: 700; color: var(--vp-c-brand-1); }
.lb-calc__rate { font-size: 0.8rem; color: var(--lb-text-mute); }

.lb-calc__breakdown {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.lb-calc__breakdown td {
  padding: 6px 0;
  border-bottom: 1px solid var(--lb-border-soft);
}

.lb-calc__breakdown td:last-child { text-align: right; color: var(--lb-text-soft); }

.lb-calc__disclaimer {
  font-size: 0.8rem;
  color: var(--lb-text-mute);
  margin-top: var(--lb-space-sm);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
```

- [ ] **Step 2: 注册到 index.ts**

```ts
import LbCalculator from './components/LbCalculator.vue'
app.component('LbCalculator', LbCalculator)
```

- [ ] **Step 3: Commit**

```bash
git add docs/.vitepress/theme/components/LbCalculator.vue docs/.vitepress/theme/index.ts
git commit -m "feat(components): add LbCalculator HK stock fee calculator"
```

---

## Task 9: LbAppDeepLink App 深链按钮

**Files:**
- Create: `docs/.vitepress/theme/components/LbAppDeepLink.vue`
- Modify: `docs/.vitepress/theme/index.ts`

用法示例：
```md
<AppDeepLink href="longbridge://trade/order?symbol=700.HK" label="在 App 中下单港股" />
```

- [ ] **Step 1: 创建 LbAppDeepLink.vue**

```vue
<!-- docs/.vitepress/theme/components/LbAppDeepLink.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  href: string
  label: string
  qrFallback?: boolean
}>()

const showQr = ref(false)
const qrUrl = computed(() => `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(props.href)}`)

function handleClick() {
  // 尝试打开 App deep link；如果 3 秒后页面还在，说明没有 App，显示 QR
  if (props.qrFallback) {
    const t = Date.now()
    window.location.href = props.href
    setTimeout(() => {
      if (Date.now() - t < 3100) showQr.value = true
    }, 3000)
  } else {
    window.location.href = props.href
  }
}
</script>

<template>
  <div class="lb-deeplink">
    <button class="lb-deeplink__btn" @click="handleClick">
      <svg class="lb-deeplink__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
        <path d="M12 18h.01"/>
      </svg>
      {{ label }}
    </button>
    <transition name="fade">
      <div v-if="showQr" class="lb-deeplink__qr">
        <p>在手机上扫码打开</p>
        <img :src="qrUrl" alt="二维码" width="160" height="160" />
      </div>
    </transition>
  </div>
</template>

<style scoped>
.lb-deeplink {
  margin: var(--lb-space-md) 0;
  display: inline-flex;
  flex-direction: column;
  gap: var(--lb-space-sm);
}

.lb-deeplink__btn {
  display: inline-flex;
  align-items: center;
  gap: var(--lb-space-sm);
  padding: 10px 20px;
  background: var(--lb-grad-mint);
  color: white;
  border: none;
  border-radius: var(--lb-radius-full);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--lb-transition);
  box-shadow: 0 2px 8px rgba(0,184,184,.3);
}

.lb-deeplink__btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0,184,184,.4);
}

.lb-deeplink__icon {
  width: 18px;
  height: 18px;
}

.lb-deeplink__qr {
  padding: var(--lb-space-md);
  border: 1px solid var(--lb-border);
  border-radius: var(--lb-radius-lg);
  background: var(--lb-card-bg);
  text-align: center;
  font-size: 0.875rem;
  color: var(--lb-text-soft);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
```

注意：在 `<script setup>` 中使用了 `computed`，需要在组件顶部加上 `import { ref, computed } from 'vue'`。完整的 script setup 块应为：

```ts
import { ref, computed } from 'vue'
const props = defineProps<{ ... }>()
```

- [ ] **Step 2: 注册到 index.ts**

```ts
import LbAppDeepLink from './components/LbAppDeepLink.vue'
app.component('LbAppDeepLink', LbAppDeepLink)
```

- [ ] **Step 3: Commit**

```bash
git add docs/.vitepress/theme/components/LbAppDeepLink.vue docs/.vitepress/theme/index.ts
git commit -m "feat(components): add LbAppDeepLink deep link button"
```

---

## Task 10: 首页重构 — AskBox 提问框

**Files:**
- Create: `docs/.vitepress/theme/components/HomePage/AskBox.vue`

这是首页的核心 CTA 组件，P0 阶段是静态占位（输入框 + 热门问题标签），不接 AI 后端，点击直接跳搜索。

- [ ] **Step 1: 创建 AskBox.vue**

```vue
<!-- docs/.vitepress/theme/components/HomePage/AskBox.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { withBase } from 'vitepress'

const query = ref('')

const hotTopics = [
  { label: '港股交易时间', q: '港股交易时间' },
  { label: '入金到账时间', q: '入金多久到账' },
  { label: '美股税务申报', q: '美股分红税如何申报' },
  { label: '期权开通条件', q: '如何开通期权交易' },
  { label: '新股认购流程', q: '打新股的完整流程' },
]

function search(q?: string) {
  const term = q ?? query.value.trim()
  if (!term) return
  // P0：直接跳 VitePress 本地搜索（通过 URL hash 触发）
  window.location.href = withBase(`/?search=${encodeURIComponent(term)}`)
}
</script>

<template>
  <div class="ask-box">
    <div class="ask-box__input-wrap">
      <svg class="ask-box__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        v-model="query"
        type="text"
        class="ask-box__input"
        placeholder="问我任何关于长桥的问题…"
        @keydown.enter="search()"
      />
      <button v-if="query" class="ask-box__submit" @click="search()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
    <div class="ask-box__hot">
      <span class="ask-box__hot-label">热门：</span>
      <button
        v-for="topic in hotTopics"
        :key="topic.q"
        class="ask-box__chip"
        @click="search(topic.q)"
      >{{ topic.label }}</button>
    </div>
  </div>
</template>

<style scoped>
.ask-box {
  max-width: 640px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--lb-space-md);
}

.ask-box__input-wrap {
  display: flex;
  align-items: center;
  background: var(--lb-bg);
  border: 1.5px solid var(--lb-border);
  border-radius: var(--lb-radius-full);
  padding: 0 var(--lb-space-md);
  gap: var(--lb-space-sm);
  transition: var(--lb-transition);
  box-shadow: var(--lb-card-shadow);
}

.ask-box__input-wrap:focus-within {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 4px var(--vp-c-brand-soft);
}

.ask-box__icon {
  width: 18px;
  height: 18px;
  color: var(--lb-text-mute);
  flex-shrink: 0;
}

.ask-box__input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 1rem;
  color: var(--lb-text);
  padding: 14px 0;
  min-width: 0;
}

.ask-box__input::placeholder { color: var(--lb-text-mute); }

.ask-box__submit {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: var(--lb-transition);
}

.ask-box__submit svg { width: 16px; height: 16px; }
.ask-box__submit:hover { background: var(--vp-c-brand-2); }

.ask-box__hot {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--lb-space-xs);
}

.ask-box__hot-label {
  font-size: 0.8rem;
  color: var(--lb-text-mute);
  flex-shrink: 0;
}

.ask-box__chip {
  font-size: 0.8rem;
  padding: 4px 12px;
  border-radius: var(--lb-radius-full);
  border: 1px solid var(--lb-border);
  background: var(--lb-bg-soft);
  color: var(--lb-text-soft);
  cursor: pointer;
  transition: var(--lb-transition);
}

.ask-box__chip:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}
</style>
```

- [ ] **Step 2: Commit（暂存，稍后集成到 HomePage）**

```bash
git add docs/.vitepress/theme/components/HomePage/
git commit -m "feat(homepage): add AskBox component"
```

---

## Task 11: 首页重构 — TaskEntry 任务化入口

**Files:**
- Create: `docs/.vitepress/theme/components/HomePage/TaskEntry.vue`

- [ ] **Step 1: 创建 TaskEntry.vue**

```vue
<!-- docs/.vitepress/theme/components/HomePage/TaskEntry.vue -->
<script setup lang="ts">
import { withBase } from 'vitepress'

const tasks = [
  { id: 'open-account',   label: '开户',   icon: '👤', path: '/account/opening/open-account' },
  { id: 'deposit',        label: '入金',   icon: '💰', path: '/deposit/' },
  { id: 'stock-trade',    label: '交易',   icon: '📈', path: '/stock-trading/' },
  { id: 'ipo',            label: '打新股', icon: '⭐', path: '/ipo/' },
  { id: 'tax',            label: '报税',   icon: '📋', path: '/compliance-and-tax/' },
  { id: 'withdrawal',     label: '出金',   icon: '🏦', path: '/withdrawal/' },
]
</script>

<template>
  <div class="task-entry">
    <h2 class="task-entry__title">我正在做…</h2>
    <p class="task-entry__sub">选择你现在要做的事，直接跳转到对应指引</p>
    <div class="task-entry__grid">
      <a
        v-for="task in tasks"
        :key="task.id"
        :href="withBase(task.path)"
        class="task-entry__card"
      >
        <span class="task-entry__icon">{{ task.icon }}</span>
        <span class="task-entry__label">{{ task.label }}</span>
        <svg class="task-entry__arrow" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
    </div>
  </div>
</template>

<style scoped>
.task-entry {
  text-align: center;
}

.task-entry__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--lb-text);
  margin-bottom: var(--lb-space-xs);
}

.task-entry__sub {
  font-size: 0.9rem;
  color: var(--lb-text-mute);
  margin-bottom: var(--lb-space-lg);
}

.task-entry__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--lb-space-md);
  max-width: 720px;
  margin: 0 auto;
}

@media (max-width: 640px) {
  .task-entry__grid { grid-template-columns: repeat(2, 1fr); }
}

.task-entry__card {
  display: flex;
  align-items: center;
  gap: var(--lb-space-sm);
  padding: var(--lb-space-md);
  background: var(--lb-card-bg);
  border: 1px solid var(--lb-card-border);
  border-radius: var(--lb-card-radius);
  text-decoration: none;
  color: var(--lb-text);
  font-weight: 500;
  transition: var(--lb-transition);
  box-shadow: var(--lb-card-shadow);
}

.task-entry__card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--lb-card-shadow-hover);
  transform: translateY(-2px);
}

.task-entry__icon { font-size: 1.25rem; }
.task-entry__label { flex: 1; text-align: left; }

.task-entry__arrow {
  width: 16px;
  height: 16px;
  color: var(--lb-text-mute);
  transition: var(--lb-transition);
}

.task-entry__card:hover .task-entry__arrow { color: var(--vp-c-brand-1); }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add docs/.vitepress/theme/components/HomePage/TaskEntry.vue
git commit -m "feat(homepage): add TaskEntry task-based navigation"
```

---

## Task 12: 首页重构 — DomainGrid 加权领域网格

**Files:**
- Create: `docs/.vitepress/theme/components/HomePage/DomainGrid.vue`

16 个分类按重要性加权显示，核心分类（账户/资金/交易）视觉层级高于次级分类。

- [ ] **Step 1: 创建 DomainGrid.vue**

```vue
<!-- docs/.vitepress/theme/components/HomePage/DomainGrid.vue -->
<script setup lang="ts">
import { withBase } from 'vitepress'

interface Domain {
  id: string
  label: string
  desc: string
  path: string
  weight: 'primary' | 'secondary' | 'tertiary'
  icon: string
  hot: string[]
}

const domains: Domain[] = [
  {
    id: 'getting-started', label: '新手入门', weight: 'primary',
    desc: '注册、开户、首次交易全流程',
    path: '/getting-started/', icon: '⚡',
    hot: ['如何注册长桥账户', '开户需要什么材料', '首次入金流程'],
  },
  {
    id: 'account', label: '开户与账户', weight: 'primary',
    desc: '账户类型、开户流程、账户管理',
    path: '/account/', icon: '👤',
    hot: ['账户类型有哪些', '如何升级账户', '账户冻结如何处理'],
  },
  {
    id: 'deposit', label: '入金', weight: 'primary',
    desc: '入金方式、到账时间、最低金额',
    path: '/deposit/', icon: '💳',
    hot: ['入金多久到账', '港股账户如何入金', '最低入金金额'],
  },
  {
    id: 'stock-trading', label: '股票交易', weight: 'primary',
    desc: '交易规则、订单类型、交易费用',
    path: '/stock-trading/', icon: '📈',
    hot: ['港股交易时间', '限价单和市价单区别', '港股交易费用明细'],
  },
  {
    id: 'withdrawal', label: '出金', weight: 'secondary',
    desc: '出金流程与到账时间',
    path: '/withdrawal/', icon: '🏦',
    hot: ['出金多久到账', '出金手续费', '出金限额'],
  },
  {
    id: 'transfers-and-fx', label: '资金划转与换汇', weight: 'secondary',
    desc: '账户间划转、货币兑换',
    path: '/transfers-and-fx/', icon: '🔄',
    hot: ['如何换汇', '换汇汇率', '账户间划转'],
  },
  {
    id: 'derivatives', label: '衍生品', weight: 'secondary',
    desc: '期权、窝轮、牛熊证',
    path: '/derivatives/', icon: '📊',
    hot: ['如何开通期权', '期权基本概念', '期权到期处理'],
  },
  {
    id: 'ipo', label: '新股认购', weight: 'secondary',
    desc: 'IPO 认购、中签、资金冻结',
    path: '/ipo/', icon: '⭐',
    hot: ['如何参与打新', '资金何时解冻', '中签率如何看'],
  },
  {
    id: 'margin', label: '融资融券', weight: 'secondary',
    desc: '保证金交易、融资利率',
    path: '/margin/', icon: '💹',
    hot: ['融资利率是多少', '如何开通融资', '强制平仓规则'],
  },
  {
    id: 'funds-and-wealth', label: '基金与理财', weight: 'secondary',
    desc: '公募基金、余额通',
    path: '/funds-and-wealth/', icon: '🌱',
    hot: ['如何购买基金', '余额通收益率', '基金赎回时间'],
  },
  {
    id: 'market-data', label: '行情数据', weight: 'tertiary',
    desc: '实时行情、历史数据、数据权限',
    path: '/market-data/', icon: '📡',
    hot: ['如何订阅行情', '免费行情包括哪些', '历史数据下载'],
  },
  {
    id: 'portfolio-and-statements', label: '资产与账单', weight: 'tertiary',
    desc: '持仓、盈亏、账单导出',
    path: '/portfolio-and-statements/', icon: '📄',
    hot: ['如何查看持仓', '账单如何导出', '盈亏计算规则'],
  },
  {
    id: 'rewards', label: '活动与奖励', weight: 'tertiary',
    desc: '邀请返佣、任务中心、兑换商城',
    path: '/rewards/', icon: '🎁',
    hot: ['邀请好友奖励', '任务中心在哪', '奖励如何兑换'],
  },
  {
    id: 'compliance-and-tax', label: '合规与税务', weight: 'tertiary',
    desc: 'CRS、税务申报、合规文件',
    path: '/compliance-and-tax/', icon: '🛡️',
    hot: ['美股分红税申报', 'W-8BEN 如何填写', 'CRS 是什么'],
  },
  {
    id: 'troubleshooting', label: '故障排查', weight: 'tertiary',
    desc: '常见错误、登录问题、功能异常',
    path: '/troubleshooting/', icon: '🔧',
    hot: ['下单失败怎么办', '登录异常排查', '无法入金原因'],
  },
  {
    id: 'app-guide', label: 'App 导览', weight: 'tertiary',
    desc: 'App 功能介绍、界面导航',
    path: '/app-guide/', icon: '📱',
    hot: ['App 主要功能', '长桥 AI 功能', '自选股设置'],
  },
]

const primaryDomains   = domains.filter(d => d.weight === 'primary')
const secondaryDomains = domains.filter(d => d.weight === 'secondary')
const tertiaryDomains  = domains.filter(d => d.weight === 'tertiary')
</script>

<template>
  <div class="domain-grid">
    <h2 class="domain-grid__title">深入了解</h2>
    <p class="domain-grid__sub">按主题浏览所有帮助内容</p>

    <!-- 核心分类（大卡片） -->
    <div class="domain-grid__primary">
      <a
        v-for="d in primaryDomains"
        :key="d.id"
        :href="withBase(d.path)"
        class="domain-card domain-card--primary"
      >
        <span class="domain-card__icon">{{ d.icon }}</span>
        <div class="domain-card__content">
          <div class="domain-card__label">{{ d.label }}</div>
          <div class="domain-card__desc">{{ d.desc }}</div>
        </div>
        <svg class="domain-card__arrow" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
    </div>

    <!-- 次级分类（中卡片） -->
    <div class="domain-grid__secondary">
      <a
        v-for="d in secondaryDomains"
        :key="d.id"
        :href="withBase(d.path)"
        class="domain-card domain-card--secondary"
      >
        <span class="domain-card__icon">{{ d.icon }}</span>
        <div class="domain-card__label">{{ d.label }}</div>
        <div class="domain-card__desc">{{ d.desc }}</div>
      </a>
    </div>

    <!-- 第三级分类（小卡片） -->
    <div class="domain-grid__tertiary">
      <a
        v-for="d in tertiaryDomains"
        :key="d.id"
        :href="withBase(d.path)"
        class="domain-card domain-card--tertiary"
      >
        <span class="domain-card__icon">{{ d.icon }}</span>
        <span class="domain-card__label">{{ d.label }}</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.domain-grid {
  text-align: center;
}

.domain-grid__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--lb-text);
  margin-bottom: var(--lb-space-xs);
}

.domain-grid__sub {
  font-size: 0.9rem;
  color: var(--lb-text-mute);
  margin-bottom: var(--lb-space-xl);
}

/* 大卡片区 */
.domain-grid__primary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--lb-space-md);
  margin-bottom: var(--lb-space-lg);
}

@media (max-width: 640px) {
  .domain-grid__primary { grid-template-columns: 1fr; }
}

/* 中卡片区 */
.domain-grid__secondary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--lb-space-md);
  margin-bottom: var(--lb-space-lg);
}

@media (max-width: 768px) {
  .domain-grid__secondary { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .domain-grid__secondary { grid-template-columns: 1fr; }
}

/* 小卡片区 */
.domain-grid__tertiary {
  display: flex;
  flex-wrap: wrap;
  gap: var(--lb-space-sm);
  justify-content: center;
}

/* 卡片基础样式 */
.domain-card {
  background: var(--lb-card-bg);
  border: 1px solid var(--lb-card-border);
  border-radius: var(--lb-card-radius);
  text-decoration: none;
  color: var(--lb-text);
  transition: var(--lb-transition);
  box-shadow: var(--lb-card-shadow);
  text-align: left;
}

.domain-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--lb-card-shadow-hover);
  transform: translateY(-2px);
}

/* 大卡片 */
.domain-card--primary {
  display: flex;
  align-items: center;
  gap: var(--lb-space-md);
  padding: var(--lb-space-lg);
}

.domain-card--primary .domain-card__icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.domain-card--primary .domain-card__content { flex: 1; }

.domain-card--primary .domain-card__label {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 2px;
}

.domain-card--primary .domain-card__desc {
  font-size: 0.85rem;
  color: var(--lb-text-soft);
}

.domain-card__arrow {
  width: 18px;
  height: 18px;
  color: var(--lb-text-mute);
  flex-shrink: 0;
  transition: var(--lb-transition);
}

.domain-card:hover .domain-card__arrow { color: var(--vp-c-brand-1); }

/* 中卡片 */
.domain-card--secondary {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--lb-space-xs);
  padding: var(--lb-space-md);
}

.domain-card--secondary .domain-card__icon { font-size: 1.5rem; }
.domain-card--secondary .domain-card__label { font-weight: 600; font-size: 0.9rem; }
.domain-card--secondary .domain-card__desc { font-size: 0.8rem; color: var(--lb-text-soft); }

/* 小卡片 */
.domain-card--tertiary {
  display: flex;
  align-items: center;
  gap: var(--lb-space-xs);
  padding: 8px 16px;
  border-radius: var(--lb-radius-full);
  font-size: 0.875rem;
  font-weight: 500;
}

.domain-card--tertiary .domain-card__icon { font-size: 1rem; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add docs/.vitepress/theme/components/HomePage/DomainGrid.vue
git commit -m "feat(homepage): add DomainGrid weighted domain navigation"
```

---

## Task 13: 首页重构 — HomePage 主组件 + 替换 index.md

**Files:**
- Create: `docs/.vitepress/theme/components/HomePage/index.vue`
- Modify: `docs/.vitepress/theme/index.ts`
- Modify: `docs/zh-CN/index.md`

- [ ] **Step 1: 创建 HomePage/index.vue**

```vue
<!-- docs/.vitepress/theme/components/HomePage/index.vue -->
<script setup lang="ts">
import AskBox from './AskBox.vue'
import TaskEntry from './TaskEntry.vue'
import DomainGrid from './DomainGrid.vue'
</script>

<template>
  <div class="home-page">
    <!-- Hero -->
    <section class="home-hero">
      <div class="home-hero__bg" aria-hidden="true" />
      <div class="home-hero__content">
        <p class="home-hero__eyebrow">长桥帮助中心</p>
        <h1 class="home-hero__title">找到你需要的答案</h1>
        <p class="home-hero__sub">账户、资金、交易、合规——每个问题都有答案</p>
        <AskBox />
      </div>
    </section>

    <!-- 任务化入口 -->
    <section class="home-section">
      <div class="home-inner">
        <TaskEntry />
      </div>
    </section>

    <!-- 分隔线 -->
    <div class="home-divider" />

    <!-- 领域网格 -->
    <section class="home-section">
      <div class="home-inner">
        <DomainGrid />
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
}

.home-hero {
  position: relative;
  padding: var(--lb-space-2xl) var(--lb-space-lg);
  text-align: center;
  overflow: hidden;
}

.home-hero__bg {
  position: absolute;
  inset: 0;
  background: var(--lb-grad-hero);
  z-index: 0;
}

.home-hero__content {
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--lb-space-md);
}

.home-hero__eyebrow {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--vp-c-brand-1);
}

.home-hero__title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  line-height: 1.2;
  color: var(--lb-text);
  margin: 0;
}

.home-hero__sub {
  font-size: 1.1rem;
  color: var(--lb-text-soft);
  margin: 0;
}

.home-section {
  padding: var(--lb-space-2xl) var(--lb-space-lg);
}

.home-inner {
  max-width: 1024px;
  margin: 0 auto;
}

.home-divider {
  height: 1px;
  background: var(--lb-border);
  margin: 0 var(--lb-space-lg);
}

@media (max-width: 768px) {
  .home-hero { padding: var(--lb-space-xl) var(--lb-space-md); }
  .home-section { padding: var(--lb-space-xl) var(--lb-space-md); }
}
</style>
```

- [ ] **Step 2: 注册 HomePage 到 index.ts**

```ts
import HomePage from './components/HomePage/index.vue'
app.component('HomePage', HomePage)
```

- [ ] **Step 3: 更新 docs/zh-CN/index.md**

将文件内容替换为：

```md
---
layout: page
sidebar: false
---

<HomePage />
```

- [ ] **Step 4: 启动 dev server 验证首页**

```bash
bun dev
```

打开 http://localhost:5173 验证：
- Hero 渐变背景跟随 light/dark 主题
- AskBox 搜索框显示，热门标签可点击
- TaskEntry 6 个任务卡片正常显示，点击能跳转
- DomainGrid 三层卡片按权重区分视觉层级
- 响应式布局在 375px 宽度下正常

- [ ] **Step 5: Commit**

```bash
git add docs/.vitepress/theme/components/HomePage/ docs/.vitepress/theme/index.ts docs/zh-CN/index.md
git commit -m "feat(homepage): replace HomeCards with product-centric HomePage"
```

---

## Task 14: CategoryLanding 分类落地页模板

**Files:**
- Create: `docs/.vitepress/theme/components/CategoryLanding.vue`
- Modify: `docs/.vitepress/theme/index.ts`

每个 16 分类的 `index.md` 可以使用这个模板，自动展示该分类下的子页面和简介。

- [ ] **Step 1: 创建 CategoryLanding.vue**

```vue
<!-- docs/.vitepress/theme/components/CategoryLanding.vue -->
<script setup lang="ts">
import { withBase, useData } from 'vitepress'

interface Article {
  title: string
  desc?: string
  path: string
  icon?: string
}

const props = defineProps<{
  title: string
  description?: string
  icon?: string
  articles: Article[]
  relatedLinks?: Array<{ label: string; path: string }>
}>()
</script>

<template>
  <div class="cat-landing">
    <!-- 分类头部 -->
    <div class="cat-landing__header">
      <div v-if="icon" class="cat-landing__icon">{{ icon }}</div>
      <div class="cat-landing__meta">
        <h1 class="cat-landing__title">{{ title }}</h1>
        <p v-if="description" class="cat-landing__desc">{{ description }}</p>
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="cat-landing__articles">
      <a
        v-for="article in articles"
        :key="article.path"
        :href="withBase(article.path)"
        class="cat-landing__article"
      >
        <div class="cat-landing__article-icon">{{ article.icon ?? '📄' }}</div>
        <div class="cat-landing__article-content">
          <div class="cat-landing__article-title">{{ article.title }}</div>
          <div v-if="article.desc" class="cat-landing__article-desc">{{ article.desc }}</div>
        </div>
        <svg class="cat-landing__arrow" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
    </div>

    <!-- 相关链接 -->
    <div v-if="relatedLinks?.length" class="cat-landing__related">
      <h3 class="cat-landing__related-title">相关内容</h3>
      <div class="cat-landing__related-links">
        <a
          v-for="link in relatedLinks"
          :key="link.path"
          :href="withBase(link.path)"
          class="cat-landing__related-link"
        >{{ link.label }} →</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cat-landing {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--lb-space-xl) var(--lb-space-lg);
}

.cat-landing__header {
  display: flex;
  align-items: flex-start;
  gap: var(--lb-space-lg);
  margin-bottom: var(--lb-space-xl);
  padding-bottom: var(--lb-space-xl);
  border-bottom: 1px solid var(--lb-border);
}

.cat-landing__icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.cat-landing__title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--lb-text);
  margin: 0 0 var(--lb-space-xs);
}

.cat-landing__desc {
  font-size: 1rem;
  color: var(--lb-text-soft);
  margin: 0;
  line-height: 1.6;
}

.cat-landing__articles {
  display: flex;
  flex-direction: column;
  gap: var(--lb-space-sm);
  margin-bottom: var(--lb-space-xl);
}

.cat-landing__article {
  display: flex;
  align-items: center;
  gap: var(--lb-space-md);
  padding: var(--lb-space-md);
  background: var(--lb-card-bg);
  border: 1px solid var(--lb-card-border);
  border-radius: var(--lb-card-radius);
  text-decoration: none;
  color: var(--lb-text);
  transition: var(--lb-transition);
}

.cat-landing__article:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--lb-card-shadow-hover);
}

.cat-landing__article-icon { font-size: 1.25rem; flex-shrink: 0; }
.cat-landing__article-content { flex: 1; }
.cat-landing__article-title { font-weight: 500; }
.cat-landing__article-desc { font-size: 0.85rem; color: var(--lb-text-soft); margin-top: 2px; }

.cat-landing__arrow {
  width: 16px;
  height: 16px;
  color: var(--lb-text-mute);
  transition: var(--lb-transition);
}

.cat-landing__article:hover .cat-landing__arrow { color: var(--vp-c-brand-1); }

.cat-landing__related-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--lb-text-soft);
  margin-bottom: var(--lb-space-sm);
}

.cat-landing__related-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--lb-space-sm);
}

.cat-landing__related-link {
  font-size: 0.875rem;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  padding: 6px 14px;
  border: 1px solid var(--vp-c-brand-soft);
  border-radius: var(--lb-radius-full);
  background: var(--vp-c-brand-soft);
  transition: var(--lb-transition);
}

.cat-landing__related-link:hover { background: var(--vp-c-brand-1); color: white; }
</style>
```

- [ ] **Step 2: 注册到 index.ts**

```ts
import CategoryLanding from './components/CategoryLanding.vue'
app.component('CategoryLanding', CategoryLanding)
```

- [ ] **Step 3: 为一个分类（入门）创建使用示例**

更新 `docs/zh-CN/getting-started/index.md`：

```md
---
layout: page
sidebar: false
---

<CategoryLanding
  title="新手入门"
  description="长桥账户注册、开户、首次入金和交易的完整指引，帮你快速上手。"
  icon="⚡"
  :articles="[
    { title: '注册与登录', desc: '下载 App、注册账户、手机验证', path: '/getting-started/registration', icon: '📱' },
  ]"
  :relatedLinks="[
    { label: '开户与账户', path: '/account/' },
    { label: '入金指引', path: '/deposit/' }
  ]"
/>
```

（注意：`/getting-started/` 下实际文章列表需参照当前 `docs/zh-CN/getting-started/` 目录，手动补全 `articles` 数组。）

- [ ] **Step 4: Commit**

```bash
git add docs/.vitepress/theme/components/CategoryLanding.vue docs/.vitepress/theme/index.ts docs/zh-CN/getting-started/index.md
git commit -m "feat(components): add CategoryLanding template"
```

---

## Task 15: ArticleHeader 文章详情页增强条

**Files:**
- Create: `docs/.vitepress/theme/components/ArticleHeader.vue`
- Modify: `docs/.vitepress/theme/layouts/Layout.vue`

每篇文章顶部增加：适用市场标签、最后更新时间、AI 摘要占位（P0 静态）。

文章 frontmatter 约定：
```yaml
---
title: 港股交易费用
appliesTo: [hk, us]   # 适用市场
lastVerifiedAt: 2026-04-01
---
```

- [ ] **Step 1: 创建 ArticleHeader.vue**

```vue
<!-- docs/.vitepress/theme/components/ArticleHeader.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, page } = useData()

const markets = computed(() => {
  const raw = frontmatter.value.appliesTo
  if (!Array.isArray(raw)) return []
  return raw.map((m: string) => ({
    id: m,
    label: ({ hk: '港股', us: '美股', cn: 'A股', sg: '新加坡' } as Record<string, string>)[m] ?? m.toUpperCase(),
  }))
})

const lastVerified = computed(() => frontmatter.value.lastVerifiedAt as string | undefined)

const isExpired = computed(() => {
  if (!lastVerified.value) return false
  const then = new Date(lastVerified.value)
  const now = new Date()
  const months = (now.getFullYear() - then.getFullYear()) * 12 + now.getMonth() - then.getMonth()
  return months > 6
})
</script>

<template>
  <div v-if="markets.length || lastVerified" class="article-header">
    <div class="article-header__inner">
      <div v-if="markets.length" class="article-header__markets">
        <span
          v-for="m in markets"
          :key="m.id"
          class="article-header__market-tag"
        >{{ m.label }}</span>
      </div>
      <div v-if="lastVerified" class="article-header__verified" :class="{ 'is-expired': isExpired }">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="article-header__icon">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
        </svg>
        <span>{{ isExpired ? '内容可能已过期 · ' : '' }}最后审校：{{ lastVerified }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-header {
  border-bottom: 1px solid var(--lb-border);
  margin-bottom: var(--lb-space-lg);
  padding-bottom: var(--lb-space-md);
}

.article-header__inner {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--lb-space-sm);
}

.article-header__market-tag {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: var(--lb-radius-full);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border: 1px solid color-mix(in oklab, var(--vp-c-brand-1) 30%, transparent);
}

.article-header__verified {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: var(--lb-text-mute);
  margin-left: auto;
}

.article-header__verified.is-expired {
  color: #f59e0b;
}

.article-header__icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}
</style>
```

- [ ] **Step 2: 在 Layout.vue 的 `#doc-top` 插槽中添加 ArticleHeader**

修改 `docs/.vitepress/theme/layouts/Layout.vue`：

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Breadcrumb from '../components/Breadcrumb/index.vue'
import DocBackground from '../components/DocBackground.vue'
import ArticleHeader from '../components/ArticleHeader.vue'

const { frontmatter } = useData()
const isDocPage = computed(() => {
  const layout = frontmatter.value.layout
  return !layout || layout === 'doc'
})
</script>

<template>
  <DefaultTheme.Layout>
    <template #layout-top>
      <DocBackground v-if="isDocPage" />
    </template>
    <template #doc-top>
      <Breadcrumb />
      <ArticleHeader />
    </template>
  </DefaultTheme.Layout>
</template>
```

- [ ] **Step 3: Commit**

```bash
git add docs/.vitepress/theme/components/ArticleHeader.vue docs/.vitepress/theme/layouts/Layout.vue
git commit -m "feat(article): add ArticleHeader with market tags and verification date"
```

---

## Task 16: 统一导出 index.ts，整理注册顺序

**Files:**
- Modify: `docs/.vitepress/theme/index.ts`

- [ ] **Step 1: 写最终完整的 index.ts**

```ts
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './vars.css'
import './sidebar.css'
import Layout from './layouts/Layout.vue'

// 首页
import HomePage from './components/HomePage/index.vue'

// 内容组件
import LbCallout from './components/LbCallout.vue'
import LbSteps from './components/LbSteps.vue'
import LbStep from './components/LbStep.vue'
import LbVideo from './components/LbVideo.vue'
import LbScreenshot from './components/LbScreenshot.vue'
import LbRateTable from './components/LbRateTable.vue'
import LbCalculator from './components/LbCalculator.vue'
import LbAppDeepLink from './components/LbAppDeepLink.vue'

// 页面模板
import CategoryLanding from './components/CategoryLanding.vue'

// 遗留组件（保留兼容性）
import HomeCards from './components/HomeCards.vue'
import HomeCardsA from './components/HomeCards_A.vue'
import HomeCardsB from './components/HomeCards_B.vue'
import HomeCardsC from './components/HomeCards_C.vue'
import Tabs from './components/Tabs.vue'
import TabItem from './components/TabItem.vue'
import LinkGraph from './components/LinkGraph.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    // 首页
    app.component('HomePage', HomePage)

    // 内容组件
    app.component('LbCallout', LbCallout)
    app.component('LbSteps', LbSteps)
    app.component('LbStep', LbStep)
    app.component('LbVideo', LbVideo)
    app.component('LbScreenshot', LbScreenshot)
    app.component('LbRateTable', LbRateTable)
    app.component('LbCalculator', LbCalculator)
    app.component('LbAppDeepLink', LbAppDeepLink)

    // 页面模板
    app.component('CategoryLanding', CategoryLanding)

    // 遗留组件
    app.component('HomeCards', HomeCards)
    app.component('HomeCardsA', HomeCardsA)
    app.component('HomeCardsB', HomeCardsB)
    app.component('HomeCardsC', HomeCardsC)
    app.component('Tabs', Tabs)
    app.component('TabItem', TabItem)
    app.component('LinkGraph', LinkGraph)
  },
} satisfies Theme
```

- [ ] **Step 2: 最终验证**

```bash
bun dev
```

验证清单：
1. 首页（http://localhost:5173）：Hero + AskBox + TaskEntry + DomainGrid 正常
2. 任意文章页（如 http://localhost:5173/account/opening/open-account）：ArticleHeader 仅在有 `appliesTo` 或 `lastVerifiedAt` frontmatter 时显示
3. 切换 light/dark 主题：所有组件颜色正确
4. 浏览器宽度缩至 375px：首页卡片为 2 列或 1 列，不溢出

- [ ] **Step 3: 最终 Commit**

```bash
git add docs/.vitepress/theme/index.ts
git commit -m "refactor(theme): consolidate all component registrations in index.ts"
```

---

## Task 17: 提交 PR

- [ ] **Step 1: 推送分支**

```bash
git push -u origin feat/p0-content-foundation
```

- [ ] **Step 2: 创建 PR**

```bash
gh pr create \
  --title "feat: P0 content foundation — component library + homepage rebuild" \
  --body "$(cat <<'EOF'
## Summary

- 新增设计令牌系统 (`tokens.css`)，支持 light/dark 双主题
- 新增 8 个内容组件：LbCallout / LbSteps / LbVideo / LbScreenshot / LbRateTable / LbCalculator / LbAppDeepLink
- 产品化首页重构：AskBox 提问框 + TaskEntry 任务入口 + DomainGrid 加权领域网格
- 新增 CategoryLanding 分类落地页模板
- 新增 ArticleHeader 文章顶部增强条（市场标签 + 审校时间）
- 启用 `appearance: 'auto'` 跟随系统主题

## Test plan

- [ ] 首页 light/dark 主题切换正常
- [ ] AskBox 热门标签点击跳转搜索
- [ ] TaskEntry 6 个任务卡片链接正确
- [ ] DomainGrid 三层卡片样式符合预期
- [ ] LbCalculator 港股费率计算结果正确
- [ ] ArticleHeader 仅在有相关 frontmatter 时显示
- [ ] 移动端（375px）响应式布局正常
EOF
)"
```

---

## 自检

### Spec 覆盖检查

| Spec 要求 | 覆盖任务 |
|---|---|
| 设计令牌系统 | Task 2 |
| appearance: auto | Task 2 |
| Callout 组件 | Task 3 |
| Steps 组件 | Task 4 |
| Video 组件 | Task 5 |
| Screenshot + 热区 | Task 6 |
| RateTable 可切换维度 | Task 7 |
| Calculator 港股样板 | Task 8 |
| AppDeepLink 按钮 | Task 9 |
| 首页 AskBox 提问框 | Task 10 |
| 首页任务化入口 | Task 11 |
| 首页领域加权网格 | Task 12 |
| 首页主组件替换 | Task 13 |
| 分类落地页模板 | Task 14 |
| 文章顶部增强条 | Task 15 |
| index.ts 整合 | Task 16 |

### 未覆盖（留 P1）
- 结构化知识源 schema（Markdown + JSON 双写）
- Playbook 进度条
- 段落级反馈
- 底部"还没解决"追问区
- AI 能力接口层（等 provider 确定后单独计划）
