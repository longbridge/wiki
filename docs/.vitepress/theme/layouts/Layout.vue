<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useData, inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import DocBackground from '../components/DocBackground.vue'
import HomeNavbar from '../components/HomeNavbar.vue'
import PageHero from '../components/PageHero.vue'
import PageFeedback from '../components/PageFeedback.vue'
import AiChatDrawer from '../components/AiChatDrawer.vue'
import { useAIModal } from '../composables/useAIModal'

const { frontmatter } = useData()

const isDocPage = computed(() => {
  const layout = frontmatter.value.layout
  return !layout || layout === 'doc'
})

const isHomePage = computed(() => frontmatter.value.layout === 'page')

const { modalOpen, initialQuery, openAIModal } = useAIModal()

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
      <PageHero v-if="isDocPage" />
    </template>
    <template #doc-after>
      <PageFeedback v-if="isDocPage" />
    </template>
    <template #layout-bottom>
      <AiChatDrawer v-model="modalOpen" :initial-query="initialQuery" />
      <button
        v-if="!isHomePage"
        class="ai-fab-mobile fixed bottom-7 right-7 w-12 h-12 rounded-full bg-brand-1 text-white border-0 cursor-pointer flex items-center justify-center z-[999] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5"
        style="box-shadow: 0 4px 16px var(--vp-c-brand-soft);"
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
