<script setup lang="ts">
import { provide } from 'vue'
import HeroSection from './sections/HeroSection.vue'
import FindWaysSection from './sections/FindWaysSection.vue'
import AIFeatureSection from './sections/AIFeatureSection.vue'
import TopicsGrid from './sections/TopicsGrid.vue'
import FooterCTA from './sections/FooterCTA.vue'
import AIModal from './AIModal.vue'
import { useAIModal } from '../composables/useAIModal'

const { modalOpen, initialQuery, openAIModal } = useAIModal()

// 子组件仍通过 inject 使用
provide('openAIModal', openAIModal)
</script>

<template>
  <div class="home-support">
    <HeroSection />
    <FindWaysSection />
    <AIFeatureSection />
    <TopicsGrid />
    <FooterCTA />
    <AIModal v-model="modalOpen" :initial-query="initialQuery" />
  </div>
</template>

<style scoped>
.home-support {
  min-height: 100vh;
}
</style>
