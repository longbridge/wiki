<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useData, inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Breadcrumb from '../components/Breadcrumb/index.vue'
import DocBackground from '../components/DocBackground.vue'
import HomeNavbar from '../components/HomeNavbar.vue'
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

// 首页时在 <html> 上添加 home-page-layout class，以便全局 CSS 隐藏默认 VPNav
function syncClass(val: boolean) {
  if (!inBrowser) return
  document.documentElement.classList.toggle('home-page-layout', val)
}
watch(isHomePage, syncClass, { immediate: true })
onMounted(() => syncClass(isHomePage.value))
onBeforeUnmount(() => {
  if (inBrowser) document.documentElement.classList.remove('home-page-layout')
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
      <HomeNavbar v-if="isHomePage" />
      <DocBackground v-if="isDocPage" />
    </template>
    <template #doc-before>
      <Breadcrumb />
    </template>
    <template #layout-bottom>
      <TweakPanel v-if="isDev" />
      <!-- 全局 AI 助手抽屉 -->
      <AiChatDrawer v-model="modalOpen" :initial-query="initialQuery" />
      <!-- 非首页浮动触发按钮 -->
      <button
        v-if="!isHomePage"
        class="ai-fab"
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

<style scoped>
.ai-fab {
  position: fixed;
  bottom: 28px;
  right: 28px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #00b8b8;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 184, 184, 0.45);
  z-index: 999;
  transition: transform .15s, box-shadow .15s;
}
.ai-fab:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 184, 184, 0.55);
}
</style>
