<script setup lang="ts">
import { useAIModal } from '../composables/useAIModal'
import { useData } from 'vitepress'

const { page } = useData()
const { openAIModal } = useAIModal()

function ask() {
  openAIModal(`请基于本页 "${page.value.title}" 回答：`)
}
</script>

<template>
  <aside class="lb-aside-ai">
    <span class="lb-aside-ai__title">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style="color: var(--vp-c-brand-1)">
        <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z"/>
      </svg>
      AI 助手
    </span>
    <button class="lb-aside-ai__btn" @click="ask">问 AI 关于本页</button>
    <span class="lb-aside-ai__hint">基于本页内容快速解答疑问</span>
  </aside>
</template>
