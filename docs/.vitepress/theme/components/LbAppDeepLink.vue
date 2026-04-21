<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  href: string
  label: string
  qrFallback?: boolean
}>()

const showQr = ref(false)
const qrUrl = computed(() => `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(props.href)}`)

function handleClick() {
  if (props.qrFallback) {
    const t = Date.now()
    window.location.href = props.href
    setTimeout(() => {
      if (Date.now() - t < 3100) showQr.value = true
    }, 3000)
  } else {
    window.location.href = props.href
  }
}
</script>

<template>
  <div class="lb-deeplink">
    <button class="lb-deeplink__btn" @click="handleClick">
      <svg class="lb-deeplink__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
        <path d="M12 18h.01"/>
      </svg>
      {{ label }}
    </button>
    <transition name="fade">
      <div v-if="showQr" class="lb-deeplink__qr">
        <p>在手机上扫码打开</p>
        <img :src="qrUrl" alt="二维码" width="160" height="160" />
      </div>
    </transition>
  </div>
</template>

<style scoped>
.lb-deeplink {
  margin: var(--lb-space-md) 0;
  display: inline-flex;
  flex-direction: column;
  gap: var(--lb-space-sm);
}

.lb-deeplink__btn {
  display: inline-flex;
  align-items: center;
  gap: var(--lb-space-sm);
  padding: 10px 20px;
  background: var(--lb-grad-mint);
  color: white;
  border: none;
  border-radius: var(--lb-radius-full);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--lb-transition);
  box-shadow: 0 2px 8px rgba(0,184,184,.3);
}

.lb-deeplink__btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0,184,184,.4);
}

.lb-deeplink__icon {
  width: 18px;
  height: 18px;
}

.lb-deeplink__qr {
  padding: var(--lb-space-md);
  border: 1px solid var(--lb-border);
  border-radius: var(--lb-radius-lg);
  background: var(--lb-card-bg);
  text-align: center;
  font-size: 0.875rem;
  color: var(--lb-text-soft);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
