<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useData, inBrowser } from 'vitepress'
import { Search, Hash, ChevronRight, Sparkles } from 'lucide-vue-next'
import { useSearchDialog } from '../composables/useSearchDialog'
import { useDocsSearch, type DocSearchItem } from '../composables/useDocsSearch'
import { useAIModal } from '../composables/useAIModal'

const router = useRouter()
const { lang } = useData()
const { isOpen, close } = useSearchDialog()
const { results, isSearching, search, clear } = useDocsSearch()
const { openAIModal } = useAIModal()

const query = ref('')
const selectedIndex = ref(-1)
const inputRef = ref<HTMLInputElement | null>(null)
const listRef = ref<HTMLElement | null>(null)

const hasAiRow = computed(() => query.value.trim().length > 0)
const totalItems = computed(() => results.value.length + (hasAiRow.value ? 1 : 0))

watch(isOpen, async (open) => {
  if (open) {
    query.value = ''
    selectedIndex.value = -1
    clear()
    if (inBrowser) {
      document.body.style.overflow = 'hidden'
      await nextTick()
      inputRef.value?.focus()
    }
  } else {
    if (inBrowser) document.body.style.overflow = ''
  }
})

watch(results, (newResults) => {
  selectedIndex.value = newResults.length > 0 ? 0 : (hasAiRow.value ? 0 : -1)
})

function handleInput() {
  search(query.value, lang.value === 'root' ? 'root' : lang.value)
}

function handleKeydown(e: KeyboardEvent) {
  const total = totalItems.value
  if (total === 0) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedIndex.value = (selectedIndex.value + 1) % total
    scrollSelected()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIndex.value = (selectedIndex.value - 1 + total) % total
    scrollSelected()
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const i = selectedIndex.value
    if (i === results.value.length && hasAiRow.value) {
      askAI()
    } else if (i >= 0 && i < results.value.length) {
      navigateTo(results.value[i])
    }
  }
}

function scrollSelected() {
  nextTick(() => {
    listRef.value?.querySelector('[data-sel="true"]')?.scrollIntoView({ block: 'nearest' })
  })
}

function navigateTo(item: DocSearchItem) {
  close()
  const href = item.id.startsWith('/') ? item.id : '/' + item.id
  router.go(href)
}

function askAI() {
  close()
  openAIModal(query.value)
}

function formatBreadcrumb(item: DocSearchItem): string {
  if (item.titles.length === 0) return ''
  return [...item.titles, item.title].join(' › ')
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function highlight(text: string, q: string): string {
  if (!q || !text) return text ?? ''
  const terms = q.trim().split(/\s+/).filter(Boolean)
  if (!terms.length) return text
  const pattern = new RegExp(`(${terms.map(escapeRegex).join('|')})`, 'gi')
  return text.replace(pattern, '<strong>$1</strong>')
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + '…' : text
}

function onGlobalKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    e.stopImmediatePropagation()
    isOpen.value ? close() : (isOpen.value = true)
  } else if (e.key === 'Escape' && isOpen.value) {
    e.preventDefault()
    close()
  }
}

onMounted(() => {
  if (inBrowser) window.addEventListener('keydown', onGlobalKeydown, true)
})

onBeforeUnmount(() => {
  if (inBrowser) window.removeEventListener('keydown', onGlobalKeydown, true)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="sdlg">
      <div v-if="isOpen" class="sdlg-root" @keydown.stop>
        <div class="sdlg-backdrop" @click="close" />

        <div class="sdlg-panel" role="dialog" aria-label="搜索文档" aria-modal="true">
          <!-- ── Input row ── -->
          <div class="sdlg-input-row">
            <Search :size="18" class="sdlg-search-icon" aria-hidden="true" />
            <input
              ref="inputRef"
              v-model="query"
              class="sdlg-input"
              type="search"
              placeholder="搜索文档..."
              autocomplete="off"
              spellcheck="false"
              @input="handleInput"
              @keydown="handleKeydown"
            />
            <kbd class="sdlg-esc" @click="close" role="button" tabindex="-1">ESC</kbd>
          </div>

          <!-- ── Body: results + AI ── -->
          <div
            v-if="results.length > 0 || (query.trim() && !isSearching)"
            class="sdlg-body"
          >
            <!-- Result items -->
            <div ref="listRef" class="sdlg-list">
              <a
                v-for="(item, i) in results"
                :key="item.id"
                class="sdlg-item"
                :class="{ 'sdlg-item--active': selectedIndex === i }"
                :data-sel="selectedIndex === i ? 'true' : undefined"
                :href="item.id"
                @click.prevent="navigateTo(item)"
                @mouseenter="selectedIndex = i"
              >
                <span v-if="formatBreadcrumb(item)" class="sdlg-breadcrumb">{{ formatBreadcrumb(item) }}</span>
                <div class="sdlg-item-row">
                  <Hash :size="13" class="sdlg-hash" aria-hidden="true" />
                  <div class="sdlg-item-text">
                    <span
                      class="sdlg-item-title"
                      v-html="highlight(item.title, query)"
                    />
                    <span
                      v-if="item.text"
                      class="sdlg-item-excerpt"
                      v-html="highlight(truncate(item.text, 110), query)"
                    />
                  </div>
                  <ChevronRight
                    v-if="selectedIndex === i"
                    :size="14"
                    class="sdlg-chevron"
                    aria-hidden="true"
                  />
                </div>
              </a>

              <div v-if="results.length === 0 && query.trim() && !isSearching" class="sdlg-empty">
                无法找到相关结果
              </div>
            </div>

            <!-- AI fallback -->
            <div v-if="hasAiRow" class="sdlg-ai-section">
              <span class="sdlg-ai-label">Ask AI assistant</span>
              <button
                type="button"
                class="sdlg-ai-item"
                :class="{ 'sdlg-ai-item--active': selectedIndex === results.length }"
                :data-sel="selectedIndex === results.length ? 'true' : undefined"
                @click="askAI"
                @mouseenter="selectedIndex = results.length"
              >
                <Sparkles :size="14" class="sdlg-sparkle" aria-hidden="true" />
                <span>Can you tell me about {{ query }} ?</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ── Overlay ── */
.sdlg-root {
  position: fixed;
  inset: 0;
  z-index: 9998;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 12vh 16px 0;
}

.sdlg-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

/* ── Panel ── */
.sdlg-panel {
  position: relative;
  width: 100%;
  max-width: 720px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 20px;
  box-shadow:
    0 32px 72px rgba(0, 0, 0, 0.22),
    0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* ── Input row ── */
.sdlg-input-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
}

.sdlg-search-icon {
  flex-shrink: 0;
  color: var(--vp-c-text-3);
}

.sdlg-input {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  font-size: 15px;
  color: var(--vp-c-text-1);
  line-height: 1.5;
  -webkit-appearance: none;
  appearance: none;
}

.sdlg-input::-webkit-search-decoration,
.sdlg-input::-webkit-search-cancel-button,
.sdlg-input::-webkit-search-results-button {
  display: none;
}

.sdlg-esc {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  font-family: ui-monospace, 'SF Mono', Consolas, monospace;
  font-size: 11px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  letter-spacing: 0.03em;
  cursor: pointer;
  user-select: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

/* ── Scrollable body ── */
.sdlg-body {
  border-top: 1px solid var(--vp-c-divider);
  max-height: 58vh;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
}

/* ── Result list ── */
.sdlg-list {
  padding: 6px 0;
}

.sdlg-item {
  display: block;
  position: relative;
  padding: 7px 16px 9px 44px;
  text-decoration: none;
  color: inherit;
  border-bottom: 1px solid var(--vp-c-divider);
  cursor: pointer;
  transition: background 0.08s;
}

.sdlg-item:last-child {
  border-bottom: none;
}

.sdlg-item--active {
  background: var(--vp-c-bg-soft);
}

.sdlg-breadcrumb {
  display: block;
  font-size: 11.5px;
  color: var(--vp-c-text-3);
  line-height: 1.35;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sdlg-item-row {
  display: flex;
  align-items: flex-start;
  gap: 0;
}

.sdlg-hash {
  position: absolute;
  left: 19px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--vp-c-text-3);
  flex-shrink: 0;
}

.sdlg-item-text {
  flex: 1;
  min-width: 0;
}

.sdlg-item-title {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.sdlg-item-title :deep(strong) {
  font-weight: 700;
}

.sdlg-item-excerpt {
  display: block;
  margin-top: 2px;
  font-size: 13px;
  color: var(--vp-c-text-3);
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sdlg-item-excerpt :deep(strong) {
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.sdlg-chevron {
  flex-shrink: 0;
  color: var(--vp-c-text-2);
  margin-top: 3px;
  margin-left: 4px;
}

.sdlg-empty {
  padding: 20px 16px;
  text-align: center;
  font-size: 14px;
  color: var(--vp-c-text-3);
}

/* ── AI section ── */
.sdlg-ai-section {
  border-top: 1px solid var(--vp-c-divider);
  padding-bottom: 6px;
}

.sdlg-ai-label {
  display: block;
  padding: 10px 16px 6px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-3);
  letter-spacing: 0.01em;
}

.sdlg-ai-item {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 8px 16px 10px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
  transition: background 0.08s;
}

.sdlg-ai-item--active {
  background: var(--vp-c-bg-soft);
}

.sdlg-sparkle {
  flex-shrink: 0;
  color: var(--vp-c-brand-1);
}

/* ── Transition ── */
.sdlg-enter-active {
  transition: opacity 0.15s ease;
}
.sdlg-leave-active {
  transition: opacity 0.12s ease;
}
.sdlg-enter-from,
.sdlg-leave-to {
  opacity: 0;
}
</style>

<style>
/* Panel scale — not scoped so it targets nested .sdlg-panel within transition */
.sdlg-enter-active .sdlg-panel,
.sdlg-leave-active .sdlg-panel {
  transition: transform 0.15s ease, opacity 0.15s ease;
}
.sdlg-enter-from .sdlg-panel,
.sdlg-leave-to .sdlg-panel {
  transform: translateY(-6px) scale(0.985);
  opacity: 0;
}
</style>
