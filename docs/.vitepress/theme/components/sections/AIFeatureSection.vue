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
