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

<style scoped>
.footer-cta {
  padding: 80px 24px;
  text-align: center;
  background: var(--vp-c-bg-soft);
}
.footer-cta-inner {
  max-width: 560px;
  margin: 0 auto;
}
.fc-title {
  font-size: clamp(1.5rem, 4vw, 2.1rem);
  font-weight: 800;
  color: var(--vp-c-text-1);
  line-height: 1.3;
  margin: 0 0 16px;
}
.fc-sub {
  font-size: 15px;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin: 0 0 32px;
}
.fc-btn {
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  padding: 14px 36px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}
.fc-btn:hover { opacity: 0.88; }
.fc-btn:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
@media (max-width: 480px) {
  .fc-btn { width: 100%; }
}
</style>
