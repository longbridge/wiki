<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, inBrowser } from 'vitepress'
import { NAV_TABS } from '../../../.vitepress/tabs.config'
import { useAIModal } from '../composables/useAIModal'
import { useColorMode } from '../composables/useColorMode'

const route = useRoute()
const { modalOpen, toggleAIModal } = useAIModal()
const { isDark, toggle: toggleColorMode } = useColorMode()

const activeTab = computed(() => {
  const p = route.path
  const tab = NAV_TABS.find(t =>
    p === t.path || t.categories.some(c => p.startsWith('/' + c + '/'))
  )
  return tab?.path ?? null
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
          <button class="hn-askai-btn" @click="toggleAIModal()" aria-label="向 AI 提问">
            <span>Ask AI</span>
            <svg class="hn-icon hn-sparkle" viewBox="0 0 16 16" fill="none">
              <path d="M8 1v3M8 12v3M1 8h3M12 8h3M3.22 3.22l2.12 2.12M10.66 10.66l2.12 2.12M3.22 12.78l2.12-2.12M10.66 5.34l2.12-2.12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <!-- 右侧操作区 -->
        <div class="hn-actions">
          <!-- Developer Platform 入口（小屏隐藏） -->
          <a
            href="https://open.longbridge.co"
            class="hn-dev-platform"
            target="_blank"
            rel="noopener"
            aria-label="Longbridge Developer Platform"
          >
            Developer Platform
            <svg class="hn-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M6 4H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-2M9 4h3v3M9 7l3-3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>

          <!-- 主题切换 -->
          <button
            class="hn-icon-btn"
            :title="isDark ? '切换到亮色模式' : '切换到暗色模式'"
            :aria-label="isDark ? '切换到亮色模式' : '切换到暗色模式'"
            @click="toggleColorMode"
          >
            <svg v-if="!isDark" class="hn-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
              <circle cx="8" cy="8" r="3"/>
              <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.22 3.22l1.06 1.06M11.72 11.72l1.06 1.06M3.22 12.78l1.06-1.06M11.72 4.28l1.06-1.06"/>
            </svg>
            <svg v-else class="hn-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M13 9A7 7 0 0 1 7 3c0-.49.05-.97.14-1.43A7.001 7.001 0 1 0 14.43 8.86A7.03 7.03 0 0 1 13 9z"/>
            </svg>
          </button>

          <!-- Assistant 抽屉切换 -->
          <button
            class="hn-icon-btn"
            :title="modalOpen ? '关闭 AI 助手' : '打开 AI 助手'"
            :aria-label="modalOpen ? '关闭 AI 助手' : '打开 AI 助手'"
            :class="{ 'hn-icon-btn--active': modalOpen }"
            @click="toggleAIModal"
          >
            <svg v-if="modalOpen" class="hn-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
              <path d="M12 4L4 12M4 4l8 8"/>
            </svg>
            <svg v-else class="hn-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="2" width="14" height="12" rx="2"/>
              <path d="M10 2v12"/>
            </svg>
          </button>

          <!-- 登录 -->
          <a href="https://longbridgeapp.com/login" class="hn-register" target="_blank" rel="noopener">登录</a>
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
      </div>
    </div>
  </nav>
</template>
