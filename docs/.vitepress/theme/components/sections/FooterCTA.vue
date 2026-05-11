<script setup lang="ts">
import { inject } from 'vue'

const openAIModal = inject<(query?: string) => void>('openAIModal')

function callOpenAI() {
  openAIModal?.()
}
</script>

<template>
  <section class="footer-cta">
    <div class="footer-cta-inner">
      <h2 class="fc-title">还有其他问题？AI 助手随时在</h2>
      <p class="fc-sub">用自然语言提问，长桥 AI 在 2,400+ 专业文档中为你检索，秒级给出可执行答案。</p>
      <button type="button" class="fc-btn" @click="callOpenAI">
        立即向 AI 提问
      </button>
    </div>
  </section>
</template>
