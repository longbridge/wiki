<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, inBrowser } from 'vitepress'
import { useAIModal } from '../composables/useAIModal'

const route = useRoute()
const { openAIModal } = useAIModal()

const NAV_TABS = [
  { label: '快速开始',  path: '/getting-started/' },
  { label: '股票投资',  path: '/stock-trading/' },
  { label: '期权衍生品', path: '/derivatives/' },
  { label: '基金与ETF', path: '/funds-and-wealth/' },
  { label: '合规监管',  path: '/compliance-and-tax/' },
  { label: '量化与数据', path: '/market-data/' },
]

const activeTab = computed(() => {
  const p = route.path
  return NAV_TABS.find(t => p.startsWith(t.path))?.path ?? null
})

function openSearch() {
  if (!inBrowser) return
  document.dispatchEvent(new KeyboardEvent('keydown', { key: '/', bubbles: true }))
}
</script>

<template>
  <nav class="hn-root" aria-label="主导航">
    <!-- 第一行 -->
    <div class="hn-top-bar">
      <div class="hn-container">
        <!-- Logo -->
        <a href="/" class="hn-logo" aria-label="Longbridge Docs 首页">
          <img
            src="https://assets.wbrks.com/assets/logo/logo-without-title-lb.svg"
            alt="Longbridge"
            class="hn-logo-icon"
          />
          <span class="hn-logo-text">Longbridge <span class="hn-logo-docs">docs</span></span>
        </a>

        <!-- 搜索 + Ask AI -->
        <div class="hn-center">
          <button class="hn-search-btn" @click="openSearch" aria-label="搜索文档">
            <svg class="hn-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="7" cy="7" r="4.5"/>
              <path d="m10.5 10.5 2.5 2.5" stroke-linecap="round"/>
            </svg>
            <span class="hn-search-label">搜索文档</span>
            <kbd class="hn-kbd">/</kbd>
          </button>
          <button class="hn-askai-btn" @click="openAIModal()" aria-label="向 AI 提问">
            <span>Ask AI</span>
            <svg class="hn-icon hn-sparkle" viewBox="0 0 16 16" fill="none">
              <path d="M8 1v3M8 12v3M1 8h3M12 8h3M3.22 3.22l2.12 2.12M10.66 10.66l2.12 2.12M3.22 12.78l2.12-2.12M10.66 5.34l2.12-2.12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
          <button class="hn-icon-btn" aria-label="历史记录">
            <svg class="hn-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="8" cy="8" r="6.5"/>
              <path d="M8 5v3.5l2 1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- 登录 + 注册 -->
        <div class="hn-auth">
          <a href="https://longbridgeapp.com/login" class="hn-login" target="_blank" rel="noopener">登录</a>
          <a href="https://longbridgeapp.com/register" class="hn-register" target="_blank" rel="noopener">免费注册</a>
        </div>
      </div>
    </div>

    <!-- 第二行：主题分类导航 -->
    <div class="hn-bottom-bar">
      <div class="hn-bottom-inner">
        <div class="hn-tabs" role="tablist">
          <a
            v-for="tab in NAV_TABS"
            :key="tab.path"
            :href="tab.path"
            class="hn-tab"
            :class="{ 'hn-tab--active': activeTab === tab.path }"
            role="tab"
            :aria-selected="activeTab === tab.path"
          >{{ tab.label }}</a>
        </div>
        <div class="hn-extra-links">
          <a href="https://open.longbridge.com" class="hn-extra-btn" target="_blank" rel="noopener">
            API 文档
            <svg class="hn-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M6 4H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-2M9 4h3v3M9 7l3-3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
          <a href="/docs/" class="hn-extra-btn">
            帮助
            <svg class="hn-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="m4 6 4 4 4-4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>
