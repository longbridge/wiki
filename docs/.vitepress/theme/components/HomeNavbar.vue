<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vitepress'
import { MoreVertical, ExternalLink } from 'lucide-vue-next'
import { NAV_TABS } from '../../../.vitepress/tabs.config'
import { useAIModal } from '../composables/useAIModal'
import { useSearchDialog } from '../composables/useSearchDialog'
import { useI18n } from '../../i18n/useI18n'

const route = useRoute()
const { toggleAIModal } = useAIModal()
const { open: openSearch } = useSearchDialog()
const { t } = useI18n()

const activeTab = computed(() => {
  const p = route.path
  const tab = NAV_TABS.find(t =>
    p === t.path || t.categories.some(c => p.startsWith('/' + c + '/'))
  )
  return tab?.path ?? null
})

// ── Kebab "more" menu ─────────────────────────────────────────
const moreOpen = ref(false)
const moreBtnRef = ref<HTMLButtonElement>()
const morePopoverRef = ref<HTMLElement>()

function toggleMore() {
  moreOpen.value = !moreOpen.value
}

function onDocClick(e: MouseEvent) {
  if (!moreOpen.value) return
  const target = e.target as Node
  if (moreBtnRef.value?.contains(target) || morePopoverRef.value?.contains(target)) return
  moreOpen.value = false
}

function onDocKey(e: KeyboardEvent) {
  if (e.key === 'Escape') moreOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onDocKey)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onDocKey)
})
</script>

<template>
  <nav class="hn-root" :aria-label="t('brand.mainNavAriaLabel')">
    <!-- 第一行 -->
    <div class="hn-top-bar">
      <div class="hn-container">
        <!-- Logo -->
        <a href="/" class="hn-logo" :aria-label="t('brand.homeAriaLabel')">
          <img
            src="https://assets.wbrks.com/assets/logo/logo-without-title-lb.svg"
            :alt="t('brand.logoAlt')"
            class="hn-logo-icon"
          />
          <span class="hn-logo-text">Longbridge <span class="hn-logo-docs">docs</span></span>
        </a>

        <!-- 搜索 + Ask AI -->
        <div class="hn-center">
          <button class="hn-search-btn" @click="openSearch" :aria-label="t('common.search')">
            <svg class="hn-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="7" cy="7" r="4.5"/>
              <path d="m10.5 10.5 2.5 2.5" stroke-linecap="round"/>
            </svg>
            <span class="hn-search-label">{{ t('common.search') }}</span>
            <kbd class="hn-kbd">⌘K</kbd>
          </button>
          <button class="hn-askai-btn" @click="toggleAIModal()" :aria-label="t('common.askAi')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" class="hn-sparkle flex-shrink-0" aria-hidden="true">
              <path d="M7.111 2.34728C7.29334 1.80026 8.06709 1.80026 8.24942 2.34728L9.5054 6.1152C9.56512 6.29437 9.70571 6.43496 9.88487 6.49468L13.6528 7.75065C14.1998 7.93299 14.1998 8.70673 13.6528 8.88907L9.88487 10.145C9.70571 10.2048 9.56512 10.3454 9.5054 10.5245L8.24942 14.2924C8.06709 14.8395 7.29334 14.8395 7.111 14.2924L5.85503 10.5245C5.79531 10.3454 5.65472 10.2048 5.47556 10.145L1.70763 8.88907C1.16061 8.70673 1.16061 7.93299 1.70763 7.75065L5.47556 6.49468C5.65472 6.43496 5.79531 6.29437 5.85503 6.1152L7.111 2.34728Z" fill="currentColor"/>
              <path d="M13.0648 1.0138C13.1937 0.665555 13.6862 0.665555 13.8151 1.0138L14.0676 1.69612C14.1081 1.80561 14.1944 1.89194 14.3039 1.93245L14.9862 2.18493C15.3345 2.31379 15.3345 2.80635 14.9862 2.93521L14.3039 3.18769C14.1944 3.22821 14.1081 3.31453 14.0676 3.42402L13.8151 4.10634C13.6862 4.45459 13.1937 4.45459 13.0648 4.10634L12.8123 3.42402C12.7718 3.31453 12.6855 3.22821 12.576 3.18769L11.8937 2.93521C11.5454 2.80635 11.5454 2.31379 11.8937 2.18493L12.576 1.93245C12.6855 1.89194 12.7718 1.80561 12.8123 1.69612L13.0648 1.0138Z" fill="currentColor"/>
            </svg>
            <span class="max-md:hidden">{{ t('brand.askAiBtn') }}</span>
          </button>
        </div>

        <!-- 右侧操作区 -->
        <div class="hn-actions">
          <!-- Developer Platform 入口（md 以上显示） -->
          <a
            href="https://open.longbridge.co"
            class="hn-dev-platform"
            target="_blank"
            rel="noopener"
            :aria-label="t('brand.devPlatformAriaLabel')"
          >
            {{ t('brand.devPlatformLabel') }}
            <svg class="hn-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M6 4H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-2M9 4h3v3M9 7l3-3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>

          <!-- Kebab 更多菜单（md 以下显示） -->
          <div class="hn-more">
            <button
              ref="moreBtnRef"
              class="hn-more-btn"
              :aria-label="t('common.more')"
              :aria-expanded="moreOpen"
              aria-haspopup="true"
              @click="toggleMore"
            >
              <MoreVertical :size="18" />
            </button>
            <Transition name="hn-more-fade">
              <div v-if="moreOpen" ref="morePopoverRef" class="hn-more-popover" role="menu">
                <a
                  href="https://open.longbridge.co"
                  class="hn-more-item"
                  target="_blank"
                  rel="noopener"
                  role="menuitem"
                  @click="moreOpen = false"
                >
                  {{ t('brand.devPlatformLabel') }}
                  <ExternalLink :size="13" />
                </a>
                <div class="hn-more-divider" />
                <a
                  v-for="tab in NAV_TABS"
                  :key="tab.path"
                  :href="tab.path"
                  class="hn-more-item"
                  :class="{ 'is-active': activeTab === tab.path }"
                  role="menuitem"
                  @click="moreOpen = false"
                >{{ t(tab.label) }}</a>
              </div>
            </Transition>
          </div>

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
          >{{ t(tab.label) }}</a>
        </div>
      </div>
    </div>
  </nav>
</template>
