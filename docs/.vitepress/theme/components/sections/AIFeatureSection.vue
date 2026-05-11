<script setup lang="ts">
import { inject } from 'vue'

const openAIModal = inject<(query?: string) => void>('openAIModal')

function tryAI() {
  openAIModal?.()
}
</script>

<template>
  <section class="ai-feature">
    <div class="ai-feature-inner">
      <div class="af-text">
        <span class="af-label">AI 智能助手</span>
        <h2 class="af-title">用自然语言提问，<br>秒级获得专业解答</h2>
        <ul class="af-list">
          <li>基于 2,400+ 专业文档实时检索</li>
          <li>每日自动同步最新文档</li>
          <li>支持追问与多轮对话</li>
        </ul>
        <button type="button" class="af-btn" @click="tryAI">立即体验 AI 助手 →</button>
      </div>
      <div class="af-demo" aria-hidden="true">
        <div class="chat-window">
          <div class="chat-bubble chat-bubble--user">如何查看我的持仓？</div>
          <div class="chat-bubble chat-bubble--ai">您可以在 App 首页点击「资产」标签页，即可查看当前持仓列表，包括股票数量、市值、盈亏等信息。</div>
          <div class="chat-bubble chat-bubble--user">如何开启期权交易？</div>
          <div class="chat-bubble chat-bubble--ai">期权交易需要先完成开户并通过衍生品交易评估，前往「账户设置 → 交易权限」提交申请即可。</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ai-feature {
  padding: 80px 24px;
  background: var(--vp-c-bg-soft);
}
.ai-feature-inner {
  max-width: 960px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}
.af-label {
  display: inline-block;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 16px;
}
.af-title {
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1.3;
  color: var(--vp-c-text-1);
  margin: 0 0 20px;
}
.af-list {
  list-style: none;
  padding: 0;
  margin: 0 0 28px;
}
.af-list li {
  padding: 6px 0 6px 24px;
  position: relative;
  color: var(--vp-c-text-2);
  font-size: 15px;
  line-height: 1.6;
}
.af-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--vp-c-brand-1);
  font-weight: 700;
}
.af-btn {
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}
.af-btn:hover { opacity: 0.88; }
.af-btn:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
/* Chat window mock — uses UX 5.0 dark bg tokens */
.chat-window {
  background: #0A0E19;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.chat-bubble {
  max-width: 88%;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.6;
}
.chat-bubble--user {
  align-self: flex-end;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.82);
}
.chat-bubble--ai {
  align-self: flex-start;
  background: rgba(0, 184, 184, 0.14);
  color: rgba(0, 240, 196, 0.9);
}
@media (max-width: 768px) {
  .ai-feature-inner {
    grid-template-columns: 1fr;
  }
}
</style>
