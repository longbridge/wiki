<script setup lang="ts">
import { useRouter } from 'vitepress'
import { newUserSteps } from '../../data/new-user-path'
import { useI18n } from '../../../i18n/useI18n'

const router = useRouter()
const { t } = useI18n()

function navigate(path: string) {
  router.go(path)
}
</script>

<template>
  <section class="new-user-path">
    <div class="new-user-path__inner">

      <!-- 标题区 -->
      <div class="new-user-path__header">
        <span class="new-user-path__eyebrow">{{ t('newUserPath.eyebrow') }}</span>
        <h2 class="new-user-path__title">{{ t('newUserPath.title') }}</h2>
        <p class="new-user-path__caption">{{ t('newUserPath.caption') }}</p>
      </div>

      <!-- Step Rail -->
      <div class="new-user-path__rail" role="list">
        <template v-for="(step, i) in newUserSteps" :key="step.id">
          <!-- 卡片 -->
          <button
            class="nup-step"
            role="listitem"
            :aria-label="`步骤 ${step.num}: ${step.title}`"
            @click="navigate(step.path)"
          >
            <span class="nup-step__num">{{ step.num }}</span>
            <span class="nup-step__title">{{ step.title }}</span>
            <span class="nup-step__sub">{{ step.subtitle }}</span>
            <span class="nup-step__duration">{{ step.durationLabel }}</span>
          </button>

          <!-- 连接线（最后一个卡片后不渲染） -->
          <div
            v-if="i < newUserSteps.length - 1"
            class="nup-connector"
            aria-hidden="true"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </template>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* ── 外层 ── */
.new-user-path {
  background: var(--vp-c-bg-alt);
  padding: 80px 48px;
}

.new-user-path__inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

/* ── 标题区 ── */
.new-user-path__header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 640px;
}

.new-user-path__eyebrow {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: var(--vp-c-brand-1);
}

.new-user-path__title {
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.3;
  color: var(--vp-c-text-1);
  margin: 0;
}

.new-user-path__caption {
  font-size: 15px;
  line-height: 1.75;
  color: var(--vp-c-text-2);
  margin: 0;
}

/* ── Rail ── */
.new-user-path__rail {
  display: flex;
  align-items: center;
  gap: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding-bottom: 4px;
}

.new-user-path__rail::-webkit-scrollbar {
  display: none;
}

/* ── 连接线 ── */
.nup-connector {
  flex-shrink: 0;
  color: var(--vp-c-divider);
  transition: color 200ms ease-out;
  padding: 0 4px;
}

/* ── 步骤卡 ── */
.nup-step {
  all: unset;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 20px 22px;
  min-width: 160px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 14px;
  cursor: pointer;
  text-align: left;
  box-sizing: border-box;
  transition: border-color 150ms ease-out, box-shadow 150ms ease-out;
}

.nup-step:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

/* hover 时让相邻连接线也变色：通过父容器 hover 处理 */
.nup-step:hover + .nup-connector {
  color: rgba(0, 184, 184, 0.4);
}

.nup-step__num {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1;
  color: var(--vp-c-brand-1);
  font-variant-numeric: tabular-nums;
}

.nup-step__title {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.nup-step__sub {
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.nup-step__duration {
  font-size: 12px;
  color: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
  margin-top: 4px;
}

/* ── 响应式 ── */
@media (max-width: 1024px) {
  .new-user-path__rail {
    /* 给移动端滚动加首卡 padding，露出第二卡提示可继续滑动 */
    padding-left: 0;
  }
}

@media (max-width: 768px) {
  .new-user-path {
    padding: 64px 0 64px 20px;
  }

  .new-user-path__inner {
    gap: 36px;
    padding-right: 20px;
  }

  .new-user-path__rail {
    padding-right: 20px;
    /* 让第一卡从 section 左边距开始，最后露出下一卡 */
  }

  .nup-step {
    min-width: 148px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nup-step,
  .nup-connector {
    transition: none !important;
  }
}
</style>
