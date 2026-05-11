<!-- docs/.vitepress/theme/components/sections/HeroSection.vue -->
<script setup lang="ts">
import { ref, inject } from 'vue'
import { inBrowser } from 'vitepress'

const openAIModal = inject<(query?: string) => void>('openAIModal')

const query = ref('')

function handleSearch() {
  openAIModal?.(query.value.trim() || undefined)
}

function scrollToTopics() {
  if (!inBrowser) return
  document.getElementById('topics-section')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section class="hero">
    <div class="hero-inner">
      <div class="hero-badge">长桥官方帮助中心 · AI 智答 · 持续更新</div>
      <h1 class="hero-h1">
        有问题，直接问<br>
        <span class="hero-accent">答案在这里</span>
      </h1>
      <p class="hero-sub">
        覆盖 A 股、期权、ETF、合规等 9 大主题的专业文档库，搭配 AI 问答助手，<br>
        让每一个金融问题都有迹可查。
      </p>
      <div class="hero-search-wrap">
        <input
          v-model="query"
          type="text"
          class="hero-input"
          placeholder="输入关键词或问题，如「如何打开杠杆」"
          aria-label="搜索关键词"
          @keydown.enter="handleSearch"
        />
        <button class="hero-search-btn" @click="handleSearch">搜索</button>
      </div>
      <div class="hero-actions">
        <button class="hero-btn-primary" @click="openAIModal?.()">
          ⚡ 向AI提问
        </button>
        <button class="hero-btn-outline" @click="scrollToTopics">
          浏览所有文档
        </button>
      </div>
    </div>
  </section>
</template>
