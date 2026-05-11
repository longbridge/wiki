<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Scheme {
  id: string
  name: string
  description: string
}

const SCHEMES: Scheme[] = [
  { id: 'default',       name: '标准网格', description: '3 列等宽卡片' },
  { id: 'featured-grid', name: '精选大卡', description: '首个主题大卡 + 4 列小网格' },
]

const SEARCH_SCHEMES: Scheme[] = [
  { id: 'default',         name: '默认',   description: '原始样式' },
  { id: 'command-palette', name: '命令板', description: 'Raycast / Linear 深色风格' },
]

const SIDEBAR_SCHEMES: Scheme[] = [
  { id: 'default',       name: 'Lovable 风格', description: '深色标题 + 圆角胶囊 + 拟粗 active（默认基线）' },
  { id: 'section-group', name: '章节分组', description: 'uppercase 分区标题 + 实心色块 active' },
  { id: 'border-rail',   name: '边框导轨', description: '左侧竖线指示，无背景填充' },
  { id: 'hover-card',    name: '悬浮卡片', description: '白卡阴影，侧栏背景微区分' },
  { id: 'full-highlight', name: '全色高亮', description: '品牌色背景整行，分区有分割线' },
]

const SIDEBAR_CSS: Record<string, string> = {
  'default': '',
  'section-group': `
    /* 分区标题 — uppercase 小字 */
    .VPSidebarItem:not(.is-link) > .item {
      padding: 20px 12px 8px 12px !important;
      font-size: 11px !important;
      font-weight: 600 !important;
      letter-spacing: 0.04em !important;
      color: var(--vp-c-text-3) !important;
    }
    /* 隐藏分区标题的折叠箭头 */
    .VPSidebarItem:not(.is-link) > .item .caret {
      display: none !important;
    }
    /* 条目链接 */
    .VPSidebarItem .VPLink {
      border-radius: 10px !important;
      padding: 10px 14px !important;
    }
    /* 图标默认色 */
    .sidebar-item-icon {
      color: var(--vp-c-text-3) !important;
      opacity: 0.75;
    }
    /* Active 项 — 实心品牌色背景 */
    .VPSidebarItem.is-active > .item > .link {
      background: color-mix(in oklab, var(--vp-c-brand-1) 18%, transparent) !important;
      border-radius: 10px !important;
    }
    .VPSidebarItem.is-active .VPLink {
      color: var(--vp-c-brand-1) !important;
      font-weight: 600 !important;
    }
    .VPSidebarItem.is-active .sidebar-item-icon {
      color: var(--vp-c-brand-1) !important;
      opacity: 1 !important;
    }
    /* hover */
    .VPSidebarItem:hover .VPLink {
      background: var(--vp-c-default-soft) !important;
    }
    .VPSidebarItem.is-active:hover .VPLink {
      background: transparent !important;
    }
    /* 移除分区间的额外线条 */
    .VPSidebar .group + .group {
      border-top: none !important;
      padding-top: 0 !important;
    }
  `,
  'border-rail': `
    .VPSidebarItem .VPLink {
      border-radius: 0 !important;
      border-left: 2px solid transparent !important;
      padding: 5px 14px !important;
      transition: border-color 0.15s, color 0.15s !important;
    }
    .VPSidebarItem.is-active > .item > .link {
      background: transparent !important;
    }
    .VPSidebarItem.is-active .VPLink {
      border-left-color: var(--vp-c-brand-1) !important;
      color: var(--vp-c-brand-1) !important;
      font-weight: 600 !important;
    }
    .VPSidebarItem:not(.is-link) > .item {
      font-size: 11px !important;
      letter-spacing: 0.07em !important;
      text-transform: uppercase !important;
      color: var(--vp-c-text-3) !important;
      font-weight: 700 !important;
    }
  `,
  'hover-card': `
    .VPSidebarItem .VPLink {
      border-radius: 8px !important;
      padding: 5px 14px !important;
      transition: box-shadow 0.15s, background 0.15s !important;
    }
    .VPSidebarItem.is-active > .item > .link {
      background: var(--vp-c-bg) !important;
      border: 1px solid var(--vp-c-divider) !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
      border-radius: 10px !important;
    }
    .VPSidebarItem:hover .VPLink {
      background: var(--vp-c-bg-soft) !important;
      box-shadow: 0 1px 4px rgba(0,0,0,0.04) !important;
    }
    .VPSidebarItem.is-active .VPLink {
      box-shadow: none !important;
    }
    .VPSidebar {
      background: var(--vp-c-bg-alt) !important;
    }
  `,
  'full-highlight': `
    .VPSidebarItem .VPLink {
      padding: 6px 16px !important;
      border-radius: 8px !important;
    }
    .VPSidebarItem.is-active > .item > .link {
      background: color-mix(in oklab, var(--vp-c-brand-1) 18%, transparent) !important;
      border-radius: 8px !important;
    }
    .sidebar-item-icon {
      color: var(--vp-c-brand-1) !important;
      opacity: 0.65;
    }
    .VPSidebarItem.is-active .sidebar-item-icon {
      opacity: 1 !important;
    }
    .VPSidebar .group + .group {
      border-top: 1px solid var(--vp-c-divider) !important;
      padding-top: 12px !important;
      margin-top: 4px !important;
    }
  `,
}

const SEARCH_CSS: Record<string, string> = {
  'default': '',
  'command-palette': `
    .VPLocalSearchBox .backdrop {
      background: rgba(0,0,0,0.45) !important;
      backdrop-filter: blur(8px) !important;
    }
    .VPLocalSearchBox .shell {
      background: #2c2c30 !important;
      border: 1px solid rgba(255,255,255,0.07) !important;
      border-radius: 14px !important;
      box-shadow: 0 20px 48px rgba(0,0,0,0.35) !important;
      overflow: hidden !important;
    }
    .VPLocalSearchBox .search-bar {
      background: transparent !important;
      border-bottom: 1px solid rgba(255,255,255,0.07) !important;
      box-shadow: none !important;
    }
    .VPLocalSearchBox .search-bar:focus-within {
      box-shadow: none !important;
      border-color: rgba(255,255,255,0.1) !important;
    }
    .VPLocalSearchBox .search-bar input {
      font-size: 16px !important;
      font-weight: 400 !important;
      color: rgba(255,255,255,0.88) !important;
      background: transparent !important;
      caret-color: rgba(255,255,255,0.6) !important;
      outline: none !important;
      box-shadow: none !important;
    }
    .VPLocalSearchBox .search-bar input:focus {
      outline: none !important;
      box-shadow: none !important;
    }
    .VPLocalSearchBox .search-bar input::placeholder {
      color: rgba(255,255,255,0.2) !important;
    }
    .VPLocalSearchBox .search-icon {
      color: rgba(255,255,255,0.25) !important;
      fill: rgba(255,255,255,0.25) !important;
    }
    .VPLocalSearchBox .search-actions button,
    .VPLocalSearchBox .search-actions kbd {
      color: rgba(255,255,255,0.25) !important;
      border-color: rgba(255,255,255,0.08) !important;
      background: transparent !important;
    }
    .VPLocalSearchBox .results {
      background: transparent !important;
      padding: 6px 8px !important;
    }
    .VPLocalSearchBox .result {
      border: none !important;
      border-radius: 8px !important;
      background: transparent !important;
      margin-bottom: 2px !important;
      transition: background 0.1s !important;
      outline: none !important;
    }
    .VPLocalSearchBox .result:hover {
      background: rgba(255,255,255,0.05) !important;
    }
    .VPLocalSearchBox .result.selected {
      background: rgba(255,255,255,0.07) !important;
      border: none !important;
      outline: none !important;
      box-shadow: none !important;
    }
    .VPLocalSearchBox .titles {
      color: rgba(255,255,255,0.78) !important;
    }
    .VPLocalSearchBox .title {
      color: rgba(255,255,255,0.78) !important;
    }
    .VPLocalSearchBox .title-icon {
      color: rgba(255,255,255,0.3) !important;
    }
    .VPLocalSearchBox .excerpt {
      color: rgba(255,255,255,0.28) !important;
    }
    .VPLocalSearchBox mark {
      background: rgba(255,255,255,0.12) !important;
      color: rgba(255,255,255,0.9) !important;
      border-radius: 2px !important;
      padding: 0 2px !important;
    }
    .VPLocalSearchBox .search-keyboard-shortcuts {
      background: rgba(0,0,0,0.15) !important;
      border-top: 1px solid rgba(255,255,255,0.05) !important;
    }
    .VPLocalSearchBox kbd {
      background: rgba(255,255,255,0.06) !important;
      border: 1px solid rgba(255,255,255,0.09) !important;
      color: rgba(255,255,255,0.32) !important;
      border-radius: 4px !important;
    }
  `,
}

const active = ref('default')
const activeSearch = ref('default')
const activeSidebar = ref('default')
const open = ref(false)

function switchScheme(id: string) {
  active.value = id
  localStorage.setItem('__tweak_active', id)
  window.dispatchEvent(new CustomEvent('__tweak_change', { detail: { id } }))
}

function switchSearchScheme(id: string) {
  activeSearch.value = id
  localStorage.setItem('__tweak_search', id)
  let styleEl = document.getElementById('tweak-search-style') as HTMLStyleElement | null
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = 'tweak-search-style'
    document.head.appendChild(styleEl)
  }
  styleEl.textContent = SEARCH_CSS[id] ?? ''
}

function switchSidebarScheme(id: string) {
  activeSidebar.value = id
  localStorage.setItem('__tweak_sidebar', id)
  let styleEl = document.getElementById('tweak-sidebar-style') as HTMLStyleElement | null
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = 'tweak-sidebar-style'
    document.head.appendChild(styleEl)
  }
  styleEl.textContent = SIDEBAR_CSS[id] ?? ''
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  active.value = localStorage.getItem('__tweak_active') ?? 'default'
  const savedSearch = localStorage.getItem('__tweak_search') ?? 'default'
  activeSearch.value = savedSearch
  if (savedSearch !== 'default') switchSearchScheme(savedSearch)
  const savedSidebar = localStorage.getItem('__tweak_sidebar') ?? 'default'
  activeSidebar.value = savedSidebar
  if (savedSidebar !== 'default') switchSidebarScheme(savedSidebar)
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="tweak-root">
    <button class="tweak-trigger" @click="open = !open" title="UI Tweaks (开发专用)">
      ✦
    </button>
    <Transition name="tweak-fade">
      <div v-if="open" class="tweak-panel">
        <div class="tweak-header">
          <span>UI TWEAKS</span>
          <span class="tweak-badge">DEV</span>
        </div>
        <div class="tweak-section-label">TopicsGrid 布局</div>
        <button
          v-for="scheme in SCHEMES"
          :key="scheme.id"
          class="tweak-scheme"
          :class="{ active: active === scheme.id }"
          @click="switchScheme(scheme.id)"
        >
          <span class="tweak-check">{{ active === scheme.id ? '✓' : '' }}</span>
          <span class="tweak-info">
            <span class="tweak-name">{{ scheme.name }}</span>
            <span class="tweak-desc">{{ scheme.description }}</span>
          </span>
        </button>
        <div class="tweak-divider" />
        <div class="tweak-section-label">侧边栏风格</div>
        <button
          v-for="scheme in SIDEBAR_SCHEMES"
          :key="scheme.id"
          class="tweak-scheme"
          :class="{ active: activeSidebar === scheme.id }"
          @click="switchSidebarScheme(scheme.id)"
        >
          <span class="tweak-check">{{ activeSidebar === scheme.id ? '✓' : '' }}</span>
          <span class="tweak-info">
            <span class="tweak-name">{{ scheme.name }}</span>
            <span class="tweak-desc">{{ scheme.description }}</span>
          </span>
        </button>
        <div class="tweak-divider" />
        <div class="tweak-section-label">搜索框风格</div>
        <button
          v-for="scheme in SEARCH_SCHEMES"
          :key="scheme.id"
          class="tweak-scheme"
          :class="{ active: activeSearch === scheme.id }"
          @click="switchSearchScheme(scheme.id)"
        >
          <span class="tweak-check">{{ activeSearch === scheme.id ? '✓' : '' }}</span>
          <span class="tweak-info">
            <span class="tweak-name">{{ scheme.name }}</span>
            <span class="tweak-desc">{{ scheme.description }}</span>
          </span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.tweak-root {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}
.tweak-trigger {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #18181b;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s, box-shadow 0.15s;
}
.tweak-trigger:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
}
.tweak-panel {
  position: absolute;
  bottom: 52px;
  right: 0;
  background: #18181b;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 12px;
  min-width: 220px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  color: #fff;
  font-family: system-ui, sans-serif;
  font-size: 12px;
}
.tweak-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: 700;
  font-size: 11px;
  color: #71717a;
  letter-spacing: 0.08em;
}
.tweak-badge {
  font-size: 9px;
  background: #6366f1;
  color: #fff;
  border-radius: 3px;
  padding: 1px 5px;
  letter-spacing: 0.05em;
}
.tweak-divider {
  height: 1px;
  background: rgba(255,255,255,0.06);
  margin: 8px 0;
}
.tweak-section-label {
  font-size: 10px;
  color: #52525b;
  margin-bottom: 6px;
  padding-left: 2px;
}
.tweak-scheme {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  text-align: left;
  padding: 8px 10px;
  margin-bottom: 4px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: #a1a1aa;
  cursor: pointer;
  transition: background 0.12s, border-color 0.12s;
}
.tweak-scheme:hover {
  background: rgba(255,255,255,0.05);
}
.tweak-scheme.active {
  border-color: #6366f1;
  background: rgba(99,102,241,0.12);
  color: #a5b4fc;
}
.tweak-check {
  width: 14px;
  font-size: 11px;
  color: #6366f1;
  flex-shrink: 0;
  padding-top: 1px;
}
.tweak-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.tweak-name {
  font-size: 12px;
  font-weight: 600;
  color: inherit;
}
.tweak-desc {
  font-size: 10px;
  color: #52525b;
}
.tweak-scheme.active .tweak-desc {
  color: #818cf8;
}
.tweak-fade-enter-active,
.tweak-fade-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}
.tweak-fade-enter-from,
.tweak-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
