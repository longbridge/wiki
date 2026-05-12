<script setup lang="ts">
import { ref, inject } from 'vue'
import { useRouter } from 'vitepress'
import { hotSearchTags } from '../../data/featured-asks'
import UiInput from '../ui/Input.vue'
import UiButton from '../ui/Button.vue'

const openAIModal = inject<(q: string) => void>('openAIModal', () => {})
const router = useRouter()

const inputValue = ref('')
const searchPlaceholder = '输入关键词或直接提问，如"港股交易费用怎么算"'

function submit() {
  const q = inputValue.value.trim()
  if (!q) return
  openAIModal(q)
  inputValue.value = ''
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    submit()
  }
}

function askHot(tag: { q: string; initialPrompt: string }) {
  openAIModal(tag.initialPrompt)
}

function browseAllDocs() {
  router.go('/zh-CN/')
}
</script>

<template>
  <section class="ask-hero">
    <!-- 背景渐变装饰 -->
    <div class="ask-hero__bg" aria-hidden="true" />

    <div class="ask-hero__inner">
      <!-- 顶部 badge -->
      <div class="ask-hero__badge">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
        </svg>
        长桥帮助中心&nbsp;·&nbsp;AI 原生&nbsp;·&nbsp;每日同步
      </div>

      <!-- 主标题：两行 -->
      <div class="ask-hero__heading">
        <h1 class="ask-hero__title">
          <span class="ask-hero__title-dark">有问题，直接问</span>
          <span class="ask-hero__title-brand">答案在这里</span>
        </h1>
        <p class="ask-hero__subtitle">
          覆盖港股、美股、新加坡等市场的专业文档库，搭配<br />
          AI 问答助手，让每一个金融问题都有迹可查。
        </p>
      </div>

      <!-- 搜索区 -->
      <div class="ask-hero__search-area">
        <!-- 搜索栏 -->
        <div class="ask-hero__search-bar">
          <svg
            class="ask-hero__search-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <UiInput
            v-model="inputValue"
            :placeholder="searchPlaceholder"
            class="ask-hero__search-input"
            @keydown="handleKeydown"
          />
          <UiButton
            size="search"
            class="ask-hero__search-btn"
            @click="submit"
          >
            搜索
          </UiButton>
        </div>

        <!-- 热搜标签 -->
        <div class="ask-hero__hot-row">
          <svg
            class="ask-hero__hot-icon"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
          <span class="ask-hero__hot-label">热搜：</span>
          <UiButton
            v-for="tag in hotSearchTags"
            :key="tag.q"
            variant="outline"
            size="pill-sm"
            @click="askHot(tag)"
          >
            {{ tag.q }}
          </UiButton>
        </div>
      </div>

      <!-- CTA 按钮组 -->
      <div class="ask-hero__cta">
        <UiButton variant="brand" size="pill" @click="openAIModal('')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
          </svg>
          向 AI 提问
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </UiButton>
        <UiButton variant="outline" size="pill" @click="browseAllDocs">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          浏览所有文档
        </UiButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ─── 基础 ─── */
.ask-hero {
  position: relative;
  overflow: hidden;
  background: var(--vp-c-bg);
  padding: 96px 48px 88px;
  text-align: center;
}

/* 背景渐变装饰（顶部中心向下扩散的淡青绿晕光） */
.ask-hero__bg {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 900px;
  height: 560px;
  background: radial-gradient(
    ellipse 70% 60% at 50% 0%,
    rgba(0, 184, 184, 0.10) 0%,
    rgba(0, 240, 196, 0.05) 40%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
}

/* 内容区 z-index 提到背景之上 */
.ask-hero__inner {
  position: relative;
  z-index: 1;
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

/* ─── Badge ─── */
.ask-hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border: 1px solid rgba(0, 184, 184, 0.35);
  border-radius: 99px;
  background: rgba(0, 184, 184, 0.06);
  font-size: 13px;
  font-weight: 400;
  color: var(--vp-c-brand-1);
  line-height: 1;
}

/* ─── 标题 ─── */
.ask-hero__heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.ask-hero__title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin: 0;
  font-size: clamp(52px, 8vw, 88px);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.03em;
}

.ask-hero__title-dark {
  color: var(--vp-c-text-1);
}

.ask-hero__title-brand {
  color: var(--vp-c-brand-1);
}

.ask-hero__subtitle {
  margin: 0;
  font-size: 16px;
  line-height: 1.75;
  color: var(--vp-c-text-2);
  max-width: 520px;
}

/* ─── 搜索区 ─── */
.ask-hero__search-area {
  width: 100%;
  max-width: 620px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

/* 搜索栏容器 —— 负责整体外边框和视觉形状 */
.ask-hero__search-bar {
  display: flex;
  align-items: center;
  width: 100%;
  height: 56px;
  padding: 0 6px 0 20px;
  gap: 8px;
  border: 1px solid var(--vp-c-border);
  border-radius: 99px;
  background: var(--vp-c-bg);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: border-color 150ms ease-out, box-shadow 150ms ease-out;
}

.ask-hero__search-bar:focus-within {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px rgba(0, 184, 184, 0.10);
}

/* 搜索图标 */
.ask-hero__search-icon {
  flex-shrink: 0;
  color: var(--vp-c-text-3);
}

/* 覆盖 UiInput 的边框/背景 —— 在 search-bar 容器内做裸输入框 */
.ask-hero__search-input {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  border-radius: 0 !important;
  height: 100%;
  padding: 0 4px !important;
  flex: 1;
  min-width: 0;
  font-size: 15px !important;
}

/* 搜索按钮 —— 覆盖圆角到稍圆的矩形 */
.ask-hero__search-btn {
  flex-shrink: 0;
  border-radius: 99px !important;
  font-weight: 600;
}

/* ─── 热搜行 ─── */
.ask-hero__hot-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.ask-hero__hot-icon {
  color: var(--vp-c-text-3);
  flex-shrink: 0;
}

.ask-hero__hot-label {
  font-size: 13px;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}

/* ─── CTA ─── */
.ask-hero__cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

/* ─── 响应式 ─── */
@media (max-width: 768px) {
  .ask-hero {
    padding: 72px 20px 64px;
  }

  .ask-hero__search-area {
    max-width: 100%;
  }

  .ask-hero__subtitle {
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .ask-hero {
    padding: 56px 16px 56px;
  }

  .ask-hero__search-bar {
    height: 52px;
    padding: 0 5px 0 16px;
  }

  .ask-hero__cta {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
