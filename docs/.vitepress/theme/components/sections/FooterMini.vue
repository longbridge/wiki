<script setup lang="ts">
import { inject } from 'vue'
import { useI18n } from '../../../i18n/useI18n'

const openAIModal = inject<(q: string) => void>('openAIModal', () => {})
const { t } = useI18n()
</script>

<template>
  <footer class="footer-mini">
    <div class="footer-mini__inner">
      <div class="footer-mini__cta">
        <span class="footer-mini__label">{{ t('footerMini.notFound') }}</span>
        <button class="footer-mini__ask-btn" @click="openAIModal('')">
          {{ t('footerMini.askAi') }}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <nav class="footer-mini__links" :aria-label="t('footerMini.navAriaLabel')">
        <a href="https://longbridgeapp.com" target="_blank" rel="noopener noreferrer">{{ t('footerMini.official') }}</a>
        <a href="/zh-CN/compliance-and-tax/privacy-policy">{{ t('footerMini.privacy') }}</a>
        <a href="/zh-CN/compliance-and-tax/">{{ t('footerMini.compliance') }}</a>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.footer-mini {
  background: var(--vp-c-bg-alt);
  border-top: 1px solid var(--vp-c-divider);
  padding: 40px 48px;
}

.footer-mini__inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-mini__cta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-mini__label {
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.footer-mini__ask-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: opacity 150ms ease-out;
}

.footer-mini__ask-btn:hover {
  opacity: 0.8;
}

.footer-mini__links {
  display: flex;
  gap: 24px;
}

.footer-mini__links a {
  font-size: 13px;
  color: var(--vp-c-text-3);
  text-decoration: none;
  transition: color 150ms ease-out;
}

.footer-mini__links a:hover {
  color: var(--vp-c-brand-1);
}

@media (max-width: 640px) {
  .footer-mini {
    padding: 32px 16px;
  }

  .footer-mini__inner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
