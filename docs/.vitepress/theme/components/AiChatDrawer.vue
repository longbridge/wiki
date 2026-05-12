<!-- docs/.vitepress/theme/components/AiChatDrawer.vue -->
<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { stream } from 'fetch-event-stream'
import MarkdownRender from 'markstream-vue'
import { useAIModal } from '../composables/useAIModal'

const AI_ENDPOINT = import.meta.env.VITE_AI_API_ENDPOINT || '/api/ai/v1/invoke'

const AI_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  'account-channel': import.meta.env.VITE_AI_ACCOUNT_CHANNEL,
  'app-id': import.meta.env.VITE_AI_APP_ID,
  'X-Agent-Key': import.meta.env.VITE_AI_AGENT_KEY,
}

const props = defineProps<{
  modelValue: boolean
  initialQuery?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

const { messages, clearMessages } = useAIModal()

const inputRef = ref<HTMLTextAreaElement>()
const messagesRef = ref<HTMLDivElement>()
const query = ref('')
const isLoading = ref(false)
const currentController = ref<AbortController | null>(null)
const copiedIndex = ref<number | null>(null)
const isAtBottom = ref(true)

function checkAtBottom() {
  if (!messagesRef.value) return
  const el = messagesRef.value
  isAtBottom.value = el.scrollHeight - el.scrollTop - el.clientHeight < 60
}

function scrollToLatest() {
  if (messagesRef.value) {
    messagesRef.value.scrollTo({ top: messagesRef.value.scrollHeight, behavior: 'smooth' })
  }
}

function autoGrow() {
  const el = inputRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 120)}px`
}

// ── Resizable drawer ─────────────────────────────────────────
const MIN_WIDTH = 320
const MAX_WIDTH = 720
const drawerWidth = useLocalStorage('lb-ai-drawer-width', 380)

function syncWidthVar(w: number) {
  document.documentElement.style.setProperty('--ai-drawer-width', `${w}px`)
}

onMounted(() => syncWidthVar(drawerWidth.value))
watch(drawerWidth, syncWidthVar)

function startResize(e: MouseEvent) {
  e.preventDefault()
  const startX = e.clientX
  const startW = drawerWidth.value
  document.documentElement.classList.add('ai-resizing')

  function onMove(ev: MouseEvent) {
    const newW = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startW + startX - ev.clientX))
    drawerWidth.value = newW
    syncWidthVar(newW)
  }
  function onUp() {
    document.documentElement.classList.remove('ai-resizing')
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

async function copy(content: string, index: number) {
  await navigator.clipboard.writeText(content)
  copiedIndex.value = index
  setTimeout(() => { copiedIndex.value = null }, 2000)
}

watch(
  () => props.modelValue,
  (open) => {
    if (!open) {
      query.value = ''
      return
    }
    nextTick(() => {
      if (props.initialQuery) {
        submitText(props.initialQuery)
      } else {
        inputRef.value?.focus()
      }
    })
  }
)

// 抽屉已打开时处理新的搜索词（modalOpen 不变，watch 上面的不会触发）
watch(() => props.initialQuery, (q) => {
  if (!props.modelValue || !q) return
  submitText(q)
})

function scrollToBottom() {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
      isAtBottom.value = true
    }
  })
}

watch(query, () => nextTick(autoGrow))

async function submitText(text: string) {
  const trimmed = text.trim()
  if (!trimmed || isLoading.value) return

  messages.value.push({ role: 'user', content: trimmed })
  messages.value.push({ role: 'assistant', content: '', loading: true, final: false })

  isLoading.value = true
  scrollToBottom()

  const controller = new AbortController()
  currentController.value = controller

  const assistantMsg = messages.value[messages.value.length - 1]
  let firstChunk = true

  try {
    const iter = await stream(AI_ENDPOINT, {
      method: 'POST',
      headers: AI_HEADERS,
      body: JSON.stringify({ message: trimmed }),
      signal: controller.signal,
    })

    for await (const event of iter) {
      if (event.data === '[DONE]') break

      let piece = ''
      try {
        const parsed = JSON.parse(event.data)
        if (parsed && typeof parsed === 'object') {
          if (parsed.type && parsed.type !== 'text-delta') continue
          piece = typeof parsed.delta === 'string'
            ? parsed.delta
            : (parsed.delta?.content ?? parsed.content ?? parsed.text ?? '')
        } else {
          piece = String(parsed)
        }
      } catch {
        piece = event.data
      }

      if (!piece) continue
      if (firstChunk) {
        assistantMsg.loading = false
        firstChunk = false
      }
      assistantMsg.content += piece
      scrollToBottom()
    }

    if (firstChunk) assistantMsg.loading = false
    assistantMsg.final = true
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      assistantMsg.loading = false
      assistantMsg.final = true
      return
    }
    assistantMsg.content = assistantMsg.content || '抱歉，出现了错误，请稍后重试。'
    assistantMsg.loading = false
    assistantMsg.final = true
  } finally {
    isLoading.value = false
    currentController.value = null
  }
}

async function submit() {
  const text = query.value.trim()
  if (!text) return
  query.value = ''
  await submitText(text)
}

function stop() {
  currentController.value?.abort()
}

function retry(assistantIndex: number) {
  if (isLoading.value) return
  const userMsg = messages.value[assistantIndex - 1]
  if (!userMsg || userMsg.role !== 'user') return
  messages.value.splice(assistantIndex)
  submitText(userMsg.content)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    submit()
  }
}

function close() {
  emit('update:modelValue', false)
}

function toggleExpand() {
  drawerWidth.value = drawerWidth.value >= MAX_WIDTH ? 380 : MAX_WIDTH
}
</script>

<template>
  <Transition name="drawer">
    <div v-if="modelValue" class="ai-drawer" :style="{ width: drawerWidth + 'px' }">
      <!-- Resize handle -->
      <div class="ai-resize-handle" @mousedown="startResize" />
      <!-- Header -->
      <div class="ai-drawer-header">
        <div class="ai-drawer-title">
          <svg class="ai-star-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z" />
          </svg>
          <span>Assistant</span>
        </div>
        <div class="ai-drawer-header-actions">
          <button
            v-if="messages.length > 0"
            class="ai-header-btn"
            title="清空对话"
            @click="clearMessages"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
          </button>
          <!-- Expand / shrink -->
          <button class="ai-header-btn" :title="drawerWidth >= MAX_WIDTH ? '收起' : '展开'" @click="toggleExpand">
            <svg v-if="drawerWidth < MAX_WIDTH" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 14h6v6M14 4h6v6M10 20l-7-7M20 10l-7 7" />
            </svg>
          </button>
          <button class="ai-header-btn" @click="close" aria-label="关闭">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <!-- Disclaimer -->
      <p class="ai-disclaimer">Responses are generated using AI and may contain mistakes.</p>

      <!-- Messages -->
      <div ref="messagesRef" class="ai-messages" aria-live="polite" aria-atomic="false" @scroll="checkAtBottom">
        <div v-if="messages.length === 0" class="ai-empty" />

        <div
          v-for="(msg, i) in messages"
          :key="i"
          class="ai-msg"
          :class="msg.role"
        >
          <div class="ai-msg-bubble">
            <template v-if="msg.role === 'user'">{{ msg.content }}</template>
            <template v-else>
              <div v-if="msg.loading && !msg.content" class="ai-thinking">
                <svg class="ai-thinking-star" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z" />
                </svg>
                <span class="ai-thinking-text">思考中</span>
                <span class="ai-thinking-dots"><span /><span /><span /></span>
              </div>
              <ClientOnly v-else>
                <MarkdownRender
                  :custom-id="`msg-${i}`"
                  :content="msg.content"
                  :final="!!msg.final"
                  :max-live-nodes="0"
                  :typewriter="!msg.final"
                  :fade="false"
                />
              </ClientOnly>
              <div v-if="msg.final && !isLoading" class="ai-msg-actions">
                <button
                  class="ai-action-btn"
                  :class="{ copied: copiedIndex === i }"
                  :aria-label="copiedIndex === i ? '已复制' : '复制'"
                  @click="copy(msg.content, i)"
                >
                  <svg v-if="copiedIndex === i" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                  <span class="ai-action-tooltip">{{ copiedIndex === i ? '已复制' : '复制' }}</span>
                </button>
                <button class="ai-action-btn" aria-label="重新生成" @click="retry(i)">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 .49-4" />
                  </svg>
                  <span class="ai-action-tooltip">重新生成</span>
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- Scroll to latest button -->
      <Transition name="fade-up">
        <button
          v-if="!isAtBottom && messages.length > 0"
          class="ai-scroll-latest"
          @click="scrollToLatest"
          aria-label="滚动到最新消息"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
          <span>最新消息</span>
        </button>
      </Transition>

      <!-- Input area -->
      <div class="ai-input-wrap">
        <div class="ai-input-box">
          <textarea
            ref="inputRef"
            v-model="query"
            class="ai-input"
            placeholder="Ask a question..."
            rows="1"
            :disabled="isLoading"
            @keydown="onKeydown"
          />
          <div class="ai-input-footer">
            <!-- Attachment placeholder (visual only) -->
            <button class="ai-attach-btn" disabled aria-label="附件" tabindex="-1">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
              </svg>
            </button>
            <!-- Stop / Send -->
            <button
              v-if="isLoading"
              class="ai-send-btn ai-stop-btn"
              @click="stop"
              aria-label="停止"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
            </button>
            <button
              v-else
              class="ai-send-btn"
              :disabled="!query.trim()"
              @click="submit"
              aria-label="发送"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* ── Drawer shell ─────────────────────────────────────────── */
.ai-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  /* width is set via :style binding; fallback here for safety */
  width: var(--ai-drawer-width, 380px);
  max-width: 100vw;
  background: var(--vp-c-bg);
  border-left: 1px solid var(--vp-c-border);
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 40px rgba(0, 0, 0, 0.12);
  /* Higher than VPNav (z-index:20) and HomeNavbar (z-index:100) so the drawer
     properly covers the top-right corner without pushing nav bars. */
  z-index: 200;
  @apply max-sm:w-screen;
}

/* Resize handle — left edge, dash indicator on hover */
.ai-resize-handle {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 12px;
  cursor: col-resize;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ai-resize-handle::after {
  content: '';
  width: 3px;
  height: 32px;
  border-radius: 99px;
  background: transparent;
  transition: background 0.2s;
}
.ai-resize-handle:hover::after,
.ai-resize-handle:active::after {
  background: var(--vp-c-border);
}

/* ── Header ──────────────────────────────────────────────── */
.ai-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 52px;
  border-bottom: 0.5px solid var(--vp-c-divider);
  flex-shrink: 0;
}
.ai-drawer-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-weight: 600;
  font-size: 15px;
  color: var(--vp-c-text-1);
  letter-spacing: -0.01em;
}
.ai-star-icon { color: var(--vp-c-brand-1); flex-shrink: 0; }

/* Disclaimer */
.ai-disclaimer {
  margin: 0;
  padding: 10px 20px 12px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--vp-c-text-3);
  text-align: center;
  border-bottom: 0.5px solid var(--vp-c-divider);
  flex-shrink: 0;
}
.ai-drawer-header-actions { display: flex; align-items: center; gap: 4px; }
.ai-header-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--vp-c-text-3);
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  line-height: 1;
  transition: background 0.15s, color 0.15s;
}
.ai-header-btn:hover { background: var(--vp-c-bg-mute); color: var(--vp-c-text-1); }

/* ── Messages ─────────────────────────────────────────────── */
.ai-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px 20px 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  scrollbar-width: thin;
  scrollbar-color: var(--vp-c-border) transparent;
}
.ai-messages::-webkit-scrollbar { width: 4px; }
.ai-messages::-webkit-scrollbar-track { background: transparent; }
.ai-messages::-webkit-scrollbar-thumb { background: var(--vp-c-border); border-radius: 2px; }

.ai-empty { flex: 1; }

.ai-msg { display: flex; }
.ai-msg.user { justify-content: flex-end; }
.ai-msg.assistant { justify-content: flex-start; }

.user .ai-msg-bubble {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: 16px 16px 4px 16px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.assistant .ai-msg-bubble {
  max-width: 90%;
  padding: 4px 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--vp-c-text-1);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Hide markstream-vue scroll-to-bottom button */
.assistant .ai-msg-bubble :deep([class*="scroll"]),
.assistant .ai-msg-bubble :deep([class*="goto"]) {
  display: none !important;
}

/* Markdown overrides */
.assistant .ai-msg-bubble :deep(.markstream-vue) { font-size: 14px; line-height: 1.7; color: var(--vp-c-text-1); }
.assistant .ai-msg-bubble :deep(pre) {
  border-radius: 8px;
  font-size: 13px;
  background: var(--vp-c-bg-soft) !important;
  border: 1px solid var(--vp-c-border);
}
.assistant .ai-msg-bubble :deep(code:not(pre code)) {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-brand-1);
  padding: 2px 5px;
  border-radius: 4px;
  font-size: 13px;
}
.assistant .ai-msg-bubble :deep(p) { margin: 0 0 8px; color: var(--vp-c-text-1); }
.assistant .ai-msg-bubble :deep(p:last-child) { margin-bottom: 0; }
.assistant .ai-msg-bubble :deep(ul),
.assistant .ai-msg-bubble :deep(ol) { padding-left: 20px; margin: 4px 0 8px; color: var(--vp-c-text-1); }
.assistant .ai-msg-bubble :deep(h1),
.assistant .ai-msg-bubble :deep(h2),
.assistant .ai-msg-bubble :deep(h3) { color: var(--vp-c-text-1); margin: 12px 0 6px; }
.assistant .ai-msg-bubble :deep(a) { color: var(--vp-c-brand-1); }
.assistant .ai-msg-bubble :deep(strong) { color: var(--vp-c-text-1); }
.assistant .ai-msg-bubble :deep(blockquote) {
  border-left: 3px solid var(--vp-c-border);
  padding-left: 12px;
  color: var(--vp-c-text-2);
  margin: 8px 0;
}
.assistant .ai-msg-bubble :deep(hr) {
  border: none;
  border-top: 0.5px solid var(--vp-c-divider);
  margin: 12px 0;
}
.assistant .ai-msg-bubble :deep(table) { width: 100%; border-collapse: collapse; font-size: 13px; }
.assistant .ai-msg-bubble :deep(th),
.assistant .ai-msg-bubble :deep(td) { padding: 6px 10px; border: 1px solid var(--vp-c-border); color: var(--vp-c-text-1); }
.assistant .ai-msg-bubble :deep(th) { background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); }

/* Thinking state */
.ai-thinking {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 0;
}
.ai-thinking-star {
  color: var(--vp-c-brand-1);
  flex-shrink: 0;
  animation: ai-star-pulse 2s ease-in-out infinite;
}
.ai-thinking-text {
  font-size: 13px;
  color: var(--vp-c-text-2);
  animation: ai-text-breathe 2s ease-in-out infinite;
}
.ai-thinking-dots {
  display: inline-flex;
  gap: 2px;
  align-items: center;
  padding-bottom: 1px;
}
.ai-thinking-dots span {
  width: 3px;
  height: 3px;
  background: var(--vp-c-text-3);
  border-radius: 50%;
  animation: ai-dot-wave 1.4s ease-in-out infinite;
}
.ai-thinking-dots span:nth-child(2) { animation-delay: .15s; }
.ai-thinking-dots span:nth-child(3) { animation-delay: .3s; }
@keyframes ai-star-pulse {
  0%, 100% { opacity: 0.5; transform: scale(1) rotate(0deg); }
  50% { opacity: 1; transform: scale(1.15) rotate(15deg); }
}
@keyframes ai-text-breathe {
  0%, 100% { opacity: 0.45; }
  50% { opacity: 0.85; }
}
@keyframes ai-dot-wave {
  0%, 60%, 100% { opacity: 0.25; transform: translateY(0); }
  30% { opacity: 0.8; transform: translateY(-2px); }
}

/* Message actions */
.ai-msg-actions { display: flex; gap: 4px; align-self: flex-start; }
.ai-action-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid transparent;
  cursor: pointer;
  color: var(--vp-c-text-3);
  padding: 5px;
  border-radius: 6px;
  line-height: 1;
  transition: color .15s, border-color .15s, background .15s;
}
.ai-action-btn:hover { color: var(--vp-c-text-1); border-color: var(--vp-c-border); background: var(--vp-c-bg-mute); }
.ai-action-btn.copied { color: var(--lb-c-success); }
.ai-action-tooltip {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--vp-c-text-1);
  color: var(--vp-c-bg);
  font-size: 11px;
  padding: 3px 7px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity .15s;
}
.ai-action-btn:hover .ai-action-tooltip { opacity: 1; }

/* ── Input area ──────────────────────────────────────────── */
.ai-input-wrap {
  padding: 12px 16px 20px;
  flex-shrink: 0;
}
.ai-input-box {
  border: 1px solid var(--vp-c-border);
  border-radius: 16px;
  background: var(--vp-c-bg);
  padding: 12px 14px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  transition: border-color .15s, box-shadow .15s;
}
.ai-input-box:focus-within {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}
.ai-input {
  width: 100%;
  resize: none;
  border: none;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-family: inherit;
  line-height: 1.5;
  outline: none;
  min-height: 24px;
  max-height: 120px;
  overflow-y: auto;
}
.ai-input::placeholder { color: var(--vp-c-text-3); }
.ai-input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ai-attach-btn {
  background: none;
  border: none;
  cursor: default;
  color: var(--vp-c-text-3);
  padding: 4px;
  display: flex;
  align-items: center;
  opacity: 0.5;
}
.ai-send-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-text-1);
  color: var(--vp-c-bg);
  transition: opacity .15s;
  flex-shrink: 0;
}
.ai-send-btn:hover:not(:disabled):not(.ai-stop-btn) { opacity: 0.8; }
.ai-send-btn:disabled { opacity: 0.2; cursor: not-allowed; }
.ai-stop-btn { background: var(--lb-c-danger); color: white; }
.ai-stop-btn:hover { opacity: 1; filter: brightness(0.88); }

/* Scroll to latest button */
.ai-scroll-latest {
  position: absolute;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 20px;
  padding: 5px 12px 5px 10px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12), 0 0 0 1px var(--vp-c-divider);
  white-space: nowrap;
  z-index: 10;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: background 0.15s, box-shadow 0.15s;
}
.ai-scroll-latest:hover {
  background: var(--vp-c-bg-mute);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.16), 0 0 0 1px var(--vp-c-border);
}
.fade-up-enter-active,
.fade-up-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.fade-up-enter-from,
.fade-up-leave-to { opacity: 0; transform: translateX(-50%) translateY(6px); }

/* Slide-in transition */
.drawer-enter-active,
.drawer-leave-active { transition: transform .25s cubic-bezier(0.4, 0, 0.2, 1); }
.drawer-enter-from,
.drawer-leave-to { transform: translateX(100%); }

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .drawer-enter-active,
  .drawer-leave-active { transition: none; }
  .ai-thinking-star,
  .ai-thinking-text,
  .ai-thinking-dots span { animation: none; opacity: 0.6; }
}
</style>
