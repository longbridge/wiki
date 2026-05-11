<!-- docs/.vitepress/theme/components/sections/HeroSection.vue -->
<script setup lang="ts">
import { ref, inject } from 'vue'
import { inBrowser } from 'vitepress'

const openAIModal = inject<(query?: string) => void>('openAIModal')

const query = ref('')
type BgEffect = 'dots' | 'lines' | 'glow'
const bgEffect = ref<BgEffect>('dots')
const effects: { id: BgEffect; label: string }[] = [
  { id: 'dots', label: '点阵' },
  { id: 'lines', label: '扫线' },
  { id: 'glow', label: '光晕' },
]

function handleSearch() {
  openAIModal?.(query.value.trim() || undefined)
}

function scrollToTopics() {
  if (!inBrowser) return
  document.getElementById('topics-section')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section :class="['hero', 'hero-bg-' + bgEffect]">
    <div class="bg-switcher" aria-label="切换背景效果">
      <button
        v-for="e in effects"
        :key="e.id"
        :class="['bgsw-btn', { active: bgEffect === e.id }]"
        :title="e.label"
        @click="bgEffect = e.id"
      >{{ e.label }}</button>
    </div>
    <div class="hero-inner">
      <div class="hero-badge">✨ 长桥官方帮助中心 · AI 智答 · 持续更新</div>
      <h1 class="hero-h1">
        有问题，直接问<br>
        <span class="hero-accent">答案在这里</span>
      </h1>
      <p class="hero-sub">
        覆盖 A 股、期权、ETF、合规等 9 大主题的专业文档库，搭配 AI 问答助手，<br>
        让每一个金融问题都有迹可查。
      </p>
      <div class="hero-search-wrap">
        <input
          v-model="query"
          type="text"
          class="hero-input"
          placeholder="输入关键词或问题，如「如何打开杠杆」"
          aria-label="搜索关键词"
          @keydown.enter="handleSearch"
        />
        <button class="hero-search-btn" @click="handleSearch">搜索</button>
      </div>
      <div class="hero-actions">
        <button class="hero-btn-primary" @click="openAIModal?.()">
          ⚡ 向AI提问
        </button>
        <button class="hero-btn-outline" @click="scrollToTopics">
          浏览所有文档
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  padding: 80px 24px 72px;
  text-align: center;
  overflow: hidden;
  background: var(--vp-c-bg);
}

/* ── 效果切换开关 ── */
.bg-switcher {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 6px;
  z-index: 10;
}
.bgsw-btn {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 20px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-3);
  cursor: pointer;
  transition: all .15s;
  line-height: 1.6;
}
.bgsw-btn:hover { color: var(--vp-c-brand-1); border-color: var(--vp-c-brand-1); }
.bgsw-btn.active { background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); border-color: var(--vp-c-brand-1); }

/* ── 共用：四周渐隐遮罩 ── */
.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 90% 70% at 50% 45%, transparent 35%, var(--vp-c-bg) 88%);
  pointer-events: none;
  z-index: 0;
}

/* ── 效果 A：点阵漂移 ── */
.hero-bg-dots::before {
  content: '';
  position: absolute;
  inset: -56px;
  background-image: radial-gradient(circle, rgba(0, 184, 184, 0.08) 1.5px, transparent 1.5px);
  background-size: 28px 28px;
  animation: dot-drift 20s linear infinite;
  pointer-events: none;
  z-index: 0;
}
@keyframes dot-drift {
  0%   { transform: translate(0, 0); }
  100% { transform: translate(28px, 28px); }
}

/* ── 效果 B：扫描线 ── */
.hero-bg-lines::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 23px,
    rgba(0, 184, 184, 0.05) 23px,
    rgba(0, 184, 184, 0.05) 24px
  );
  background-size: 100% 24px;
  animation: lines-scan 6s linear infinite;
  pointer-events: none;
  z-index: 0;
}
@keyframes lines-scan {
  0%   { background-position: 0 0; }
  100% { background-position: 0 -24px; }
}

/* ── 效果 C：呼吸光晕 ── */
.hero-bg-glow::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 55% 45% at 50% 50%, rgba(0, 184, 184, 0.10) 0%, transparent 70%);
  animation: glow-breathe 4s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}
@keyframes glow-breathe {
  0%, 100% { opacity: 0.35; transform: scale(1); }
  50%       { opacity: 1;    transform: scale(1.18); }
}
.hero-inner {
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin: 0 auto;
}
.hero-badge {
  display: inline-block;
  font-size: 13px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  padding: 4px 14px;
  border-radius: 20px;
  margin-bottom: 24px;
  font-weight: 500;
}
.hero-h1 {
  font-size: clamp(2.4rem, 6vw, 4rem);
  font-weight: 800;
  line-height: 1.15;
  color: var(--vp-c-text-1);
  margin: 0 0 20px;
  letter-spacing: -0.02em;
}
.hero-accent { color: var(--vp-c-brand-1); }
.hero-sub {
  font-size: 16px;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin: 0 0 36px;
}
.hero-search-wrap {
  display: flex;
  max-width: 560px;
  margin: 0 auto 24px;
  background: var(--vp-c-bg);
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  transition: border-color .2s;
}
.hero-search-wrap:focus-within { border-color: var(--vp-c-brand-1); }
.hero-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 14px 18px;
  font-size: 15px;
  background: transparent;
  color: var(--vp-c-text-1);
}
.hero-search-btn {
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  padding: 0 24px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}
.hero-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.hero-btn-primary {
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 24px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity .15s;
}
.hero-btn-primary:hover { opacity: 0.88; }
.hero-btn-outline {
  background: transparent;
  color: var(--vp-c-brand-1);
  border: 1.5px solid var(--vp-c-brand-1);
  padding: 12px 28px;
  border-radius: 24px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background .15s;
}
.hero-btn-outline:hover { background: var(--vp-c-brand-soft); }
@media (max-width: 640px) {
  .hero { padding: 60px 20px 52px; }
  .hero-sub br { display: none; }
  .hero-actions { flex-direction: column; align-items: center; }
}
</style>
