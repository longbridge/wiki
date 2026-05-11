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

<style scoped>
/* ── 根节点 ── */
.hn-root {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--vp-c-bg);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

/* ── 第一行 ── */
.hn-top-bar {
  height: 52px;
  display: flex;
  align-items: center;
}
.hn-container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

/* Logo */
.hn-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  flex-shrink: 0;
}
.hn-logo-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}
.hn-logo-text {
  font-size: 17px;
  font-weight: 700;
  color: #0d0d0d;
  letter-spacing: -0.5px;
  white-space: nowrap;
  line-height: 1;
}
.hn-logo-docs {
  font-weight: 400;
  color: #666;
}

/* 搜索 + AI 中间区域 */
.hn-center {
  display: flex;
  align-items: center;
  gap: 6px;
}
.hn-search-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 33px;
  padding: 0 13px;
  background: #fafafa;
  border: 1px solid rgba(0, 0, 0, 0.09);
  border-radius: 9999px;
  cursor: pointer;
  color: #888;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  transition: border-color 0.15s;
}
.hn-search-btn:hover { border-color: rgba(0, 0, 0, 0.2); }
.hn-search-label { font-size: 13px; }
.hn-kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 17px;
  min-width: 18px;
  padding: 0 4px;
  background: #ebebeb;
  border-radius: 5px;
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  color: #888;
  letter-spacing: 0.2px;
}
.hn-askai-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 33px;
  padding: 0 13px;
  background: #fafafa;
  border: 1px solid rgba(0, 0, 0, 0.09);
  border-radius: 9999px;
  cursor: pointer;
  color: #0d0d0d;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  transition: border-color 0.15s;
}
.hn-askai-btn:hover { border-color: rgba(0, 0, 0, 0.2); }
.hn-sparkle { color: #18e299; }
.hn-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #fafafa;
  border: 1px solid rgba(0, 0, 0, 0.09);
  border-radius: 16px;
  cursor: pointer;
  color: #666;
  padding: 0;
  transition: border-color 0.15s;
}
.hn-icon-btn:hover { border-color: rgba(0, 0, 0, 0.2); }
.hn-icon { width: 12px; height: 12px; flex-shrink: 0; }

/* 登录 + 注册 */
.hn-auth {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.hn-login {
  height: 32px;
  padding: 0 14px;
  border-radius: 9999px;
  border: none;
  background: transparent;
  color: #666;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: color 0.15s;
}
.hn-login:hover { color: #0d0d0d; }
.hn-register {
  height: 33px;
  padding: 0 17px;
  border-radius: 9999px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: #0d0d0d;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  display: flex;
  align-items: center;
  white-space: nowrap;
  transition: opacity 0.15s;
}
.hn-register:hover { opacity: 0.85; }

/* ── 第二行 ── */
.hn-bottom-bar {
  height: 40px;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
}
.hn-bottom-inner {
  width: 100%;
  max-width: 1551px;
  padding: 0 159.5px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.hn-tabs {
  display: flex;
  align-items: center;
  height: 100%;
}
.hn-tab {
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: 40px;
  font-size: 13px;
  color: #666;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  transition: color 0.15s;
  font-weight: 400;
  box-sizing: border-box;
}
.hn-tab:hover { color: #0d0d0d; }
.hn-tab--active {
  color: #18e299;
  border-bottom-color: #18e299;
  font-weight: 500;
}
.hn-extra-links {
  display: flex;
  align-items: center;
  gap: 4px;
}
.hn-extra-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 8px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #666;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}
.hn-extra-btn:hover { background: rgba(0,0,0,0.04); color: #0d0d0d; }

/* ── 深色模式 ── */
.dark .hn-root {
  border-bottom-color: rgba(255, 255, 255, 0.08);
  background: var(--vp-c-bg);
}
.dark .hn-logo-text { color: #f0f0f0; }
.dark .hn-logo-docs { color: #999; }
.dark .hn-search-btn,
.dark .hn-askai-btn,
.dark .hn-icon-btn {
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.1);
  color: #aaa;
}
.dark .hn-search-btn:hover,
.dark .hn-askai-btn:hover,
.dark .hn-icon-btn:hover { border-color: rgba(255,255,255,0.25); }
.dark .hn-askai-btn { color: #f0f0f0; }
.dark .hn-kbd { background: rgba(255,255,255,0.1); color: #aaa; }
.dark .hn-login { color: #aaa; }
.dark .hn-login:hover { color: #f0f0f0; }
.dark .hn-register { background: #f0f0f0; color: #0d0d0d; border-color: rgba(255,255,255,0.1); }
.dark .hn-bottom-bar { border-top-color: rgba(255,255,255,0.05); }
.dark .hn-tab { color: #888; }
.dark .hn-tab:hover { color: #f0f0f0; }
.dark .hn-tab--active { color: #00f0c4; border-bottom-color: #00f0c4; }
.dark .hn-extra-btn { color: #888; }
.dark .hn-extra-btn:hover { background: rgba(255,255,255,0.06); color: #f0f0f0; }

/* ── 响应式 ── */
@media (max-width: 960px) {
  .hn-bottom-inner { padding: 0 24px; }
  .hn-tabs { gap: 0; overflow-x: auto; }
}
@media (max-width: 768px) {
  .hn-search-label { display: none; }
  .hn-auth .hn-register { display: none; }
  .hn-bottom-bar { display: none; }
}
</style>
