<script setup lang="ts">
import { inject } from 'vue'
import { inBrowser } from 'vitepress'

const openAIModal = inject<(query?: string) => void>('openAIModal')

function callOpenAI() {
  openAIModal?.()
}

function scrollToTopics() {
  if (!inBrowser) return
  document.getElementById('topics-section')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section class="footer-cta">
    <div class="footer-cta-inner">
      <h2 class="fc-title">你的金融问题，这里都有答案</h2>
      <div class="fc-actions">
        <button type="button" class="fc-btn-primary" @click="callOpenAI">
          ⚡ 向AI提问
        </button>
        <button type="button" class="fc-btn-outline" @click="scrollToTopics">
          浏览文档库
        </button>
      </div>
      <div class="fc-stats">
        <div class="fc-stat">
          <span class="fc-stat-value">2,400+</span>
          <span class="fc-stat-label">专业文档</span>
        </div>
        <div class="fc-stat">
          <span class="fc-stat-value">AI</span>
          <span class="fc-stat-label">智能助手</span>
        </div>
        <div class="fc-stat">
          <span class="fc-stat-value">合规</span>
          <span class="fc-stat-label">审计保障</span>
        </div>
      </div>
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
  max-width: 640px;
  margin: 0 auto;
}
.fc-title {
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  font-weight: 800;
  color: var(--vp-c-text-1);
  line-height: 1.25;
  margin: 0 0 32px;
}
.fc-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 40px;
}
.fc-btn-primary {
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 24px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}
.fc-btn-primary:hover { opacity: 0.88; }
.fc-btn-primary:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
.fc-btn-outline {
  background: transparent;
  color: var(--vp-c-brand-1);
  border: 1.5px solid var(--vp-c-brand-1);
  padding: 12px 28px;
  border-radius: 24px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.fc-btn-outline:hover { background: var(--vp-c-brand-soft); }
.fc-btn-outline:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
.fc-stats {
  display: flex;
  justify-content: center;
  gap: 48px;
}
.fc-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.fc-stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}
.fc-stat-label {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}
@media (max-width: 480px) {
  .fc-stats { gap: 28px; }
  .fc-actions { flex-direction: column; align-items: center; }
}
</style>
