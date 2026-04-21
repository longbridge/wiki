<script setup lang="ts">
import { ref } from 'vue'
import { withBase } from 'vitepress'

const query = ref('')

const hotTopics = [
  { label: '港股交易时间', q: '港股交易时间' },
  { label: '入金到账时间', q: '入金多久到账' },
  { label: '美股税务申报', q: '美股分红税如何申报' },
  { label: '期权开通条件', q: '如何开通期权交易' },
  { label: '新股认购流程', q: '打新股的完整流程' },
]

function search(q?: string) {
  const term = q ?? query.value.trim()
  if (!term) return
  window.location.href = withBase(`/?search=${encodeURIComponent(term)}`)
}
</script>

<template>
  <div class="ask-box">
    <div class="ask-box__input-wrap">
      <svg class="ask-box__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        v-model="query"
        type="text"
        class="ask-box__input"
        placeholder="问我任何关于长桥的问题…"
        @keydown.enter="search()"
      />
      <button v-if="query" class="ask-box__submit" @click="search()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
    <div class="ask-box__hot">
      <span class="ask-box__hot-label">热门：</span>
      <button
        v-for="topic in hotTopics"
        :key="topic.q"
        class="ask-box__chip"
        @click="search(topic.q)"
      >{{ topic.label }}</button>
    </div>
  </div>
</template>

<style scoped>
.ask-box {
  max-width: 640px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.ask-box__input-wrap {
  display: flex;
  align-items: center;
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-full);
  padding: 0 var(--space-md);
  gap: var(--space-sm);
  transition: var(--transition);
  box-shadow: var(--card-shadow);
}

.ask-box__input-wrap:focus-within {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 4px var(--vp-c-brand-soft);
}

.ask-box__icon {
  width: 18px;
  height: 18px;
  color: var(--text-mute);
  flex-shrink: 0;
}

.ask-box__input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 1rem;
  color: var(--text);
  padding: 14px 0;
  min-width: 0;
}

.ask-box__input::placeholder { color: var(--text-mute); }

.ask-box__submit {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: var(--transition);
}

.ask-box__submit svg { width: 16px; height: 16px; }
.ask-box__submit:hover { background: var(--vp-c-brand-2); }

.ask-box__hot {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.ask-box__hot-label {
  font-size: 0.8rem;
  color: var(--text-mute);
  flex-shrink: 0;
}

.ask-box__chip {
  font-size: 0.8rem;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border);
  background: var(--bg-soft);
  color: var(--text-soft);
  cursor: pointer;
  transition: var(--transition);
}

.ask-box__chip:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}
</style>
