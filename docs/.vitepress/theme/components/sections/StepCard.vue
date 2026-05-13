<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import type { Ref } from 'vue'
import { useRouter } from 'vitepress'
import { type JourneyStep, type Market, getStepDocs } from '../../data/journey'
import { useI18n } from '../../../i18n/useI18n'

const { t } = useI18n()

const props = defineProps<{
  step: JourneyStep
}>()

const activeMarket = inject<Ref<Market>>('journeyMarket', ref('hk') as Ref<Market>)
const openAIModal = inject<(q: string) => void>('openAIModal', () => {})
const router = useRouter()

const docs = computed(() => getStepDocs(props.step, activeMarket.value))

const isEmpty = computed(() => docs.value.length === 0)

function askAI() {
  openAIModal(t('journey.askTemplate', { title: t(props.step.title), context: props.step.aiContext }))
}

function navigate(path: string) {
  router.go(path)
}
</script>

<template>
  <article class="step-card" :class="{ 'step-card--empty': isEmpty }">
    <!-- 步骤编号 -->
    <span class="step-card__num" aria-hidden="true">{{ step.num }}</span>

    <!-- 标题 + 文档数 -->
    <div class="step-card__head">
      <h3 class="step-card__title">{{ t(step.title) }}</h3>
      <span class="step-card__count">{{ step.docCount }}{{ t('journey.docCountSuffix') }}</span>
    </div>

    <!-- 说明 -->
    <p class="step-card__desc">{{ t(step.desc) }}</p>

    <!-- 文档链接 or 空状态 -->
    <ul v-if="!isEmpty" class="step-card__docs">
      <li v-for="doc in docs" :key="doc.path">
        <button class="step-card__doc-link" @click="navigate(doc.path)">
          {{ doc.title }}
          <svg class="step-card__doc-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </li>
    </ul>
    <p v-else class="step-card__empty-hint">{{ t('journey.marketEmpty') }}</p>

    <!-- Ask AI 按钮 -->
    <button class="step-card__ai-btn" @click.stop="askAI">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      {{ t('journey.askThisStep') }}
    </button>
  </article>
</template>

<style scoped>
.step-card {
  position: relative;
  padding: 24px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
  transition: transform 150ms ease-out, box-shadow 150ms ease-out, border-color 150ms ease-out;
}

.step-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: var(--vp-c-brand-1);
}

.step-card--empty:hover {
  border-color: var(--vp-c-text-3);
}

/* 步骤编号 */
.step-card__num {
  font-family: ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, monospace;
  font-size: 30px;
  font-weight: 500;
  line-height: 1;
  color: var(--vp-c-brand-1);
  letter-spacing: -0.02em;
}

.step-card--empty .step-card__num {
  color: var(--vp-c-text-3);
}

/* 标题行 */
.step-card__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.step-card__title {
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0;
  line-height: 1.3;
}

.step-card__count {
  font-family: ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, monospace;
  font-size: 12px;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  flex-shrink: 0;
}

/* 说明 */
.step-card__desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.5;
}

/* 文档链接 */
.step-card__docs {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.step-card__doc-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 6px 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: color 150ms ease-out;
  gap: 8px;
}

.step-card__doc-link:hover {
  color: var(--vp-c-brand-1);
}

.step-card__doc-arrow {
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 150ms ease-out;
}

.step-card__doc-link:hover .step-card__doc-arrow {
  opacity: 1;
}

/* 空状态 */
.step-card__empty-hint {
  font-size: 13px;
  color: var(--vp-c-text-3);
  margin: 0;
  font-style: italic;
}

/* Ask AI 按钮 */
.step-card__ai-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  padding: 0;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-3);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 150ms ease-out;
}

.step-card__ai-btn:hover {
  color: var(--vp-c-brand-1);
}
</style>
