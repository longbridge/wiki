<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'
import { answerExamples } from '../../data/answer-showcase'
import { useI18n } from '../../../i18n/useI18n'

const openAIModal = inject<(q: string) => void>('openAIModal', () => {})
const { t } = useI18n()

const activeIndex = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const current = computed(() => answerExamples[activeIndex.value])

function selectIndex(i: number) {
  activeIndex.value = i
  resetTimer()
}

function resetTimer() {
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % answerExamples.length
  }, 6000)
}

onMounted(resetTimer)
onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<template>
  <section class="answer-showcase">
    <div class="answer-showcase__inner">

      <!-- 左文 -->
      <div class="answer-showcase__text">
        <span class="answer-showcase__eyebrow">{{ t('answerShowcase.eyebrow') }}</span>
        <h2 class="answer-showcase__title">{{ t('answerShowcase.title') }}</h2>
        <ul class="answer-showcase__features">
          <li>
            <CheckIcon />
            {{ t('answerShowcase.feat0') }}
          </li>
          <li>
            <CheckIcon />
            {{ t('answerShowcase.feat1') }}
          </li>
          <li>
            <CheckIcon />
            {{ t('answerShowcase.feat2') }}
          </li>
        </ul>
        <button
          class="answer-showcase__cta"
          @click="openAIModal(current.question)"
        >
          {{ t('answerShowcase.cta') }}
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- 右侧 demo 卡区 -->
      <div
        class="answer-showcase__demo"
        @mouseenter="() => { if (timer) clearInterval(timer) }"
        @mouseleave="resetTimer"
      >
        <Transition name="as-card" mode="out-in">
          <button
            :key="current.id"
            class="answer-showcase__card"
            :aria-label="`${t('answerShowcase.cardAriaLabel')}: ${current.question}`"
            @click="openAIModal(current.question)"
          >
            <!-- 用户问 -->
            <div class="as-chat-row as-chat-row--user">
              <div class="as-bubble as-bubble--user">{{ current.question }}</div>
            </div>
            <!-- AI 答 -->
            <div class="as-chat-row as-chat-row--ai">
              <div class="as-bubble as-bubble--ai">
                <span class="as-ai-label">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  {{ t('answerShowcase.aiName') }}
                </span>
                <p class="as-answer-intro">{{ current.answer }}</p>
                <ol class="as-answer-steps">
                  <li v-for="(step, i) in current.answerSteps" :key="i">{{ step }}</li>
                </ol>
                <div class="as-citation">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M2 2h7l4 4v8a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 2v4h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ t('answerShowcase.source') }}: </span>
                  <span class="as-citation-label">{{ current.citation.label }}</span>
                </div>
              </div>
            </div>
          </button>
        </Transition>

        <!-- 指示器 -->
        <div class="answer-showcase__dots" role="tablist" :aria-label="t('answerShowcase.dotsAriaLabel')">
          <button
            v-for="(_, i) in answerExamples"
            :key="i"
            role="tab"
            :aria-selected="i === activeIndex"
            class="answer-showcase__dot"
            :class="{ 'answer-showcase__dot--active': i === activeIndex }"
            @click="selectIndex(i)"
          />
        </div>
      </div>

    </div>
  </section>
</template>

<!-- CheckIcon 内联子组件 -->
<script lang="ts">
import { defineComponent, h } from 'vue'
const CheckIcon = defineComponent({
  render() {
    return h('svg', { width: 14, height: 14, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': 'true' }, [
      h('circle', { cx: 8, cy: 8, r: 8, fill: 'var(--vp-c-brand-1)', 'fill-opacity': '0.12' }),
      h('path', { d: 'M4.5 8l2.5 2.5 4.5-4.5', stroke: 'var(--vp-c-brand-1)', 'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
    ])
  },
})
export { CheckIcon }
</script>

<style scoped>
/* ── 外层 ── */
.answer-showcase {
  background: var(--vp-c-bg);
  padding: 80px 48px;
  border-top: 1px solid var(--vp-c-divider);
}

.answer-showcase__inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}

/* ── 左文 ── */
.answer-showcase__eyebrow {
  display: block;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: var(--vp-c-brand-1);
  margin-bottom: 16px;
}

.answer-showcase__title {
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.3;
  color: var(--vp-c-text-1);
  margin: 0 0 24px;
}

.answer-showcase__features {
  list-style: none;
  padding: 0;
  margin: 0 0 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.answer-showcase__features li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  line-height: 1.75;
  color: var(--vp-c-text-2);
}

.answer-showcase__cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  border: 1.5px solid var(--vp-c-brand-1);
  border-radius: 99px;
  background: transparent;
  cursor: pointer;
  transition: background 150ms ease-out, color 150ms ease-out;
}

.answer-showcase__cta:hover {
  background: var(--vp-c-brand-1);
  color: #fff;
}

/* ── 右侧 Demo ── */
.answer-showcase__demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.answer-showcase__card {
  all: unset;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  text-align: left;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 150ms ease-out, box-shadow 150ms ease-out;
}

.answer-showcase__card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

/* ── 气泡 ── */
.as-chat-row {
  display: flex;
}

.as-chat-row--user {
  justify-content: flex-end;
}

.as-chat-row--ai {
  justify-content: flex-start;
}

.as-bubble {
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.6;
}

.as-bubble--user {
  background: var(--vp-c-brand-1);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.as-bubble--ai {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  border-bottom-left-radius: 4px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.as-ai-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-text-3);
  letter-spacing: 0.04em;
}

.as-answer-intro {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.as-answer-steps {
  margin: 0;
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.as-answer-steps li {
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-1);
}

.as-citation {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--vp-c-text-3);
  padding-top: 4px;
  border-top: 1px solid var(--vp-c-divider);
}

.as-citation-label {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

/* ── 指示器 ── */
.answer-showcase__dots {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.answer-showcase__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: none;
  background: var(--vp-c-divider);
  cursor: pointer;
  padding: 0;
  transition: background 200ms ease-out, transform 200ms ease-out;
}

.answer-showcase__dot:hover {
  background: var(--vp-c-text-3);
}

.answer-showcase__dot--active {
  background: var(--vp-c-brand-1);
  transform: scale(1.3);
}

/* ── 卡片切换过渡 ── */
.as-card-enter-active,
.as-card-leave-active {
  transition: opacity 200ms cubic-bezier(0.22, 1, 0.36, 1), transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
}

.as-card-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.as-card-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ── 响应式 ── */
@media (max-width: 1024px) {
  .answer-showcase__inner {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

@media (max-width: 768px) {
  .answer-showcase {
    padding: 64px 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .as-card-enter-active,
  .as-card-leave-active {
    transition: none !important;
  }
}
</style>
