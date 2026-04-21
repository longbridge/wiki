<script setup lang="ts">
import { ref, computed } from 'vue'

defineProps<{ market?: string }>()

const price = ref<number | null>(null)
const shares = ref<number | null>(null)

const HK_RATES = {
  commission: { rate: 0.0003, min: 3 },
  platformFee: { rate: 0.0003, min: 3 },
  stampDuty: { rate: 0.0013 },
  tradingFee: { rate: 0.000005436, min: 0.01 },
  clearingFee: { rate: 0.00002, min: 0.01, max: 100 },
}

const result = computed(() => {
  if (!price.value || !shares.value || price.value <= 0 || shares.value <= 0) return null

  const value = price.value * shares.value
  const r = HK_RATES

  const commission   = Math.max(value * r.commission.rate, r.commission.min)
  const platformFee  = Math.max(value * r.platformFee.rate, r.platformFee.min)
  const stampDuty    = Math.ceil(value * r.stampDuty.rate)
  const tradingFee   = Math.max(value * r.tradingFee.rate, r.tradingFee.min)
  const clearingFee  = Math.min(Math.max(value * r.clearingFee.rate, r.clearingFee.min), r.clearingFee.max)
  const total        = commission + platformFee + stampDuty + tradingFee + clearingFee

  return {
    tradeValue: value.toFixed(2),
    commission: commission.toFixed(2),
    platformFee: platformFee.toFixed(2),
    stampDuty: stampDuty.toFixed(2),
    tradingFee: tradingFee.toFixed(4),
    clearingFee: clearingFee.toFixed(4),
    total: total.toFixed(2),
    costRate: ((total / value) * 100).toFixed(4),
  }
})

function fmt(n: string) {
  return Number(n).toLocaleString('zh-HK', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
}
</script>

<template>
  <div class="lb-calc">
    <div class="lb-calc__header">港股交易费用计算器</div>
    <div class="lb-calc__inputs">
      <label class="lb-calc__field">
        <span class="lb-calc__label">股价（HKD）</span>
        <input v-model.number="price" type="number" min="0" step="0.01" placeholder="例如 168.00" class="lb-calc__input" />
      </label>
      <label class="lb-calc__field">
        <span class="lb-calc__label">股数（股）</span>
        <input v-model.number="shares" type="number" min="0" step="100" placeholder="例如 1000" class="lb-calc__input" />
      </label>
    </div>

    <transition name="fade">
      <div v-if="result" class="lb-calc__result">
        <div class="lb-calc__summary">
          <span class="lb-calc__total-label">预估总费用</span>
          <span class="lb-calc__total-value">HKD {{ fmt(result.total) }}</span>
          <span class="lb-calc__rate">费率约 {{ result.costRate }}%（交易额 HKD {{ fmt(result.tradeValue) }}）</span>
        </div>
        <table class="lb-calc__breakdown">
          <tr><td>佣金</td><td>HKD {{ fmt(result.commission) }}</td></tr>
          <tr><td>平台费</td><td>HKD {{ fmt(result.platformFee) }}</td></tr>
          <tr><td>印花税</td><td>HKD {{ fmt(result.stampDuty) }}</td></tr>
          <tr><td>交易费</td><td>HKD {{ fmt(result.tradingFee) }}</td></tr>
          <tr><td>结算费</td><td>HKD {{ fmt(result.clearingFee) }}</td></tr>
        </table>
        <p class="lb-calc__disclaimer">以上为参考估算，实际费用以成交确认为准。印花税买卖双向收取，按每笔向上取整。</p>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.lb-calc {
  border: 1px solid var(--lb-border);
  border-radius: var(--lb-radius-lg);
  padding: var(--lb-space-lg);
  margin: var(--lb-space-lg) 0;
  background: var(--lb-card-bg);
}

.lb-calc__header {
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: var(--lb-space-md);
  color: var(--lb-text);
}

.lb-calc__inputs {
  display: flex;
  gap: var(--lb-space-md);
  flex-wrap: wrap;
  margin-bottom: var(--lb-space-md);
}

.lb-calc__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 180px;
}

.lb-calc__label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--lb-text-soft);
}

.lb-calc__input {
  border: 1px solid var(--lb-border);
  border-radius: var(--lb-radius-md);
  padding: 8px 12px;
  font-size: 0.95rem;
  background: var(--lb-bg);
  color: var(--lb-text);
  outline: none;
  transition: var(--lb-transition);
  width: 100%;
}

.lb-calc__input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.lb-calc__result {
  border-top: 1px solid var(--lb-border);
  padding-top: var(--lb-space-md);
}

.lb-calc__summary {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: var(--lb-space-md);
}

.lb-calc__total-label { font-size: 0.85rem; color: var(--lb-text-mute); }
.lb-calc__total-value { font-size: 1.5rem; font-weight: 700; color: var(--vp-c-brand-1); }
.lb-calc__rate { font-size: 0.8rem; color: var(--lb-text-mute); }

.lb-calc__breakdown {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.lb-calc__breakdown td {
  padding: 6px 0;
  border-bottom: 1px solid var(--lb-border-soft);
}

.lb-calc__breakdown td:last-child { text-align: right; color: var(--lb-text-soft); }

.lb-calc__disclaimer {
  font-size: 0.8rem;
  color: var(--lb-text-mute);
  margin-top: var(--lb-space-sm);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
