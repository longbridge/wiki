<script setup lang="ts">
import { provide } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import AskHero from './sections/AskHero.vue'
import AnswerShowcase from './sections/AnswerShowcase.vue'
import NewUserPath from './sections/NewUserPath.vue'
import JourneyHeader from './sections/JourneyHeader.vue'
import TaskIndex from './sections/TaskIndex.vue'
import CategoryGroups from './sections/CategoryGroups.vue'
import FooterMini from './sections/FooterMini.vue'
import { useAIModal } from '../composables/useAIModal'
import { type Market } from '../data/journey'

const { openAIModal } = useAIModal()
const activeMarket = useLocalStorage<Market>('lb-journey-market', 'hk')

provide('openAIModal', openAIModal)
provide('journeyMarket', activeMarket)
</script>

<template>
  <div class="min-h-screen">
    <!-- 首屏：Ask-First 对话台 -->
    <AskHero />

    <!-- AI 价值证明 -->
    <AnswerShowcase />

    <!-- 新手专属通道 -->
    <NewUserPath />

    <!-- 老手通道：Journey 旅程 -->
    <div class="home-journey-section">
      <JourneyHeader />
      <TaskIndex />
    </div>

    <!-- 第三屏：按产品类目 -->
    <CategoryGroups />

    <!-- 底部 -->
    <FooterMini />
  </div>
</template>

<style scoped>
.home-journey-section {
  background: var(--vp-c-bg);
  padding-top: 96px;
  border-top: 1px solid var(--vp-c-divider);
}
</style>
