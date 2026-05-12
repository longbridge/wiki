<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useData, inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Breadcrumb from '../components/Breadcrumb/index.vue'
import DocBackground from '../components/DocBackground.vue'
import HomeNavbar from '../components/HomeNavbar.vue'
import PageHero from '../components/PageHero.vue'
import AsideAI from '../components/AsideAI.vue'
import PageFeedback from '../components/PageFeedback.vue'
import TweakPanel from '../components/TweakPanel.vue'
import AiChatDrawer from '../components/AiChatDrawer.vue'
import { useAIModal } from '../composables/useAIModal'

const isDev = import.meta.env.DEV

const { frontmatter } = useData()

const isDocPage = computed(() => {
  const layout = frontmatter.value.layout
  return !layout || layout === 'doc'
})

const isHomePage = computed(() => frontmatter.value.layout === 'page')

const { modalOpen, initialQuery, openAIModal } = useAIModal()

// 所有页面隐藏 VPNav，由 HomeNavbar 接管
function syncHomeClass(val: boolean) {
  if (!inBrowser) return
  document.documentElement.classList.toggle('home-page-layout', val)
}
watch(isHomePage, syncHomeClass, { immediate: true })
onMounted(() => {
  if (!inBrowser) return
  document.documentElement.classList.add('custom-nav-layout')
  syncHomeClass(isHomePage.value)
})
onBeforeUnmount(() => {
  if (!inBrowser) return
  document.documentElement.classList.remove('custom-nav-layout')
  document.documentElement.classList.remove('home-page-layout')
})

// 抽屉开关时推动主内容区域
watch(modalOpen, (open) => {
  if (!inBrowser) return
  document.documentElement.classList.toggle('ai-drawer-open', open)
}, { immediate: true })
</script>

<template>
  <DefaultTheme.Layout>
    <template #layout-top>
      <HomeNavbar />
      <DocBackground v-if="isDocPage" />
    </template>
    <template #doc-before>
      <Breadcrumb />
      <PageHero v-if="isDocPage" />
    </template>
    <template #aside-outline-after>
      <AsideAI v-if="isDocPage" />
    </template>
    <template #doc-after>
      <PageFeedback v-if="isDocPage" />
    </template>
    <template #layout-bottom>
      <TweakPanel v-if="isDev" />
      <!-- 全局 AI 助手抽屉 -->
      <AiChatDrawer v-model="modalOpen" :initial-query="initialQuery" />
      <!-- 非首页浮动触发按钮（移动端保留，桌面端由 AsideAI 卡片承担） -->
      <button
        v-if="!isHomePage"
        class="ai-fab-mobile fixed bottom-7 right-7 w-12 h-12 rounded-full bg-[#00b8b8] text-white border-0 cursor-pointer flex items-center justify-center shadow-[0_4px_16px_rgba(0,184,184,0.45)] z-[999] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,184,184,0.55)]"
        @click="openAIModal()"
        aria-label="打开 AI 助手"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z"
            fill="currentColor" />
        </svg>
      </button>
    </template>
  </DefaultTheme.Layout>
</template>
