<script setup lang="ts">
import { inject } from 'vue'
import { inBrowser } from 'vitepress'

const openAIModal = inject<(query?: string) => void>('openAIModal')

function callOpenAI() {
  openAIModal?.()
}

function openSearch() {
  if (!inBrowser) return
  document.querySelector('.VPNavBarSearch button')?.click()
}

function scrollToTopics() {
  if (!inBrowser) return
  document.getElementById('topics-section')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section class="find-ways">
    <div class="find-ways-inner">
      <h2 class="find-ways-title">三种方式，找到你要的答案</h2>
      <div class="find-ways-grid">
        <!-- 搜索文档 -->
        <button class="way-card" @click="openSearch" aria-label="打开搜索">
          <span class="way-icon">🔍</span>
          <h3 class="way-name">搜索文档</h3>
          <p class="way-desc">关键词直达答案</p>
        </button>
        <!-- AI 智能问答（高亮） -->
        <button class="way-card way-card--ai" @click="callOpenAI" aria-label="打开 AI 问答">
          <span class="way-icon">🤖</span>
          <h3 class="way-name">AI 智能问答</h3>
          <p class="way-desc">用自然语言提问，秒级获得专业解答</p>
        </button>
        <!-- 按主题浏览 -->
        <button class="way-card" @click="scrollToTopics" aria-label="浏览主题列表">
          <span class="way-icon">📚</span>
          <h3 class="way-name">按主题浏览</h3>
          <p class="way-desc">9 大专题，系统分类</p>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.find-ways {
  padding: 64px 24px;
}

.find-ways-inner {
  max-width: 900px;
  margin: 0 auto;
}

.find-ways-title {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 40px;
}

.find-ways-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}

.way-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 20px;
  border-radius: 16px;
  border: 1.5px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  cursor: pointer;
  text-align: center;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.way-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 20px rgba(0, 184, 184, 0.12);
}

.way-card--ai {
  background: #0f172a;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 24px rgba(0, 184, 184, 0.18);
}

.way-card--ai:hover {
  box-shadow: 0 6px 32px rgba(0, 184, 184, 0.28);
}

.way-icon {
  font-size: 2rem;
  margin-bottom: 12px;
}

.way-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 8px;
}

.way-card--ai .way-name {
  color: #fff;
}

.way-desc {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.5;
}

.way-card--ai .way-desc {
  color: #6ee7e7;
}

@media (max-width: 768px) {
  .find-ways-grid {
    grid-template-columns: 1fr;
  }
}
</style>
