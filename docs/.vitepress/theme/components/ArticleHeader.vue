<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()

const markets = computed(() => {
  const raw = frontmatter.value.appliesTo
  if (!Array.isArray(raw)) return []
  return raw.map((m: string) => ({
    id: m,
    label: ({ hk: '港股', us: '美股', cn: 'A股', sg: '新加坡' } as Record<string, string>)[m] ?? m.toUpperCase(),
  }))
})

const lastVerified = computed(() => frontmatter.value.lastVerifiedAt as string | undefined)

const isExpired = computed(() => {
  if (!lastVerified.value) return false
  const then = new Date(lastVerified.value)
  const now = new Date()
  const months = (now.getFullYear() - then.getFullYear()) * 12 + now.getMonth() - then.getMonth()
  return months > 6
})
</script>

<template>
  <div v-if="markets.length || lastVerified" class="article-header">
    <div class="article-header__inner">
      <div v-if="markets.length" class="article-header__markets">
        <span
          v-for="m in markets"
          :key="m.id"
          class="article-header__market-tag"
        >{{ m.label }}</span>
      </div>
      <div v-if="lastVerified" class="article-header__verified" :class="{ 'is-expired': isExpired }">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="article-header__icon">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
        </svg>
        <span>{{ isExpired ? '内容可能已过期 · ' : '' }}最后审校：{{ lastVerified }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-header {
  border-bottom: 1px solid var(--border);
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-md);
}

.article-header__inner {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.article-header__markets {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.article-header__market-tag {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: var(--radius-full);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border: 1px solid color-mix(in oklab, var(--vp-c-brand-1) 30%, transparent);
}

.article-header__verified {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: var(--text-mute);
  margin-left: auto;
}

.article-header__verified.is-expired {
  color: #f59e0b;
}

.article-header__icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}
</style>
