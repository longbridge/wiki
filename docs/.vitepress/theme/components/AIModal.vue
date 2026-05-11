<!-- docs/.vitepress/theme/components/AIModal.vue -->
<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
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

function scrollToBottom() {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  })
}

async function submitText(text: string) {
  const trimmed = text.trim()
  if (!trimmed || isLoading.value) return

  messages.value.push({ role: 'user', content: trimmed })
  messages.value.push({ role: 'assistant', content: '', loading: true, final: false })

  isLoading.value = true
  scrollToBottom()

  const controller = new AbortController()
  currentController.value = controller

  // Get reactive reference to the assistant message we just pushed
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
          // Vercel AI UI Message Stream v1: only extract text-delta events
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
    // User aborted via stop button
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
</script>

<template>
  <Transition name="drawer">
    <div v-if="modelValue" class="ai-drawer">
      <!-- Header -->
      <div class="ai-drawer-header">
        <div class="ai-drawer-title">
          <svg class="ai-star-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z"
              fill="currentColor" />
          </svg>
          <span>Assistant</span>
        </div>
        <div class="ai-drawer-header-actions">
          <button
            v-if="messages.length > 0"
            class="ai-clear-btn"
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
          <button class="ai-drawer-close" @click="close" aria-label="关闭">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Messages -->
      <div ref="messagesRef" class="ai-drawer-messages" aria-live="polite" aria-atomic="false">
        <div v-if="messages.length === 0" class="ai-drawer-empty">
          <div class="ai-drawer-empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z"
                fill="currentColor" opacity="0.3" />
            </svg>
          </div>
          <p>向 AI 提问，基于专业文档库为你解答</p>
        </div>

        <div
          v-for="(msg, i) in messages"
          :key="i"
          class="ai-msg"
          :class="msg.role"
        >
          <div class="ai-msg-bubble">
            <!-- User message: plain text -->
            <template v-if="msg.role === 'user'">{{ msg.content }}</template>

            <!-- Assistant message -->
            <template v-else>
              <!-- Waiting for first token: show loading dots -->
              <span v-if="msg.loading && !msg.content" class="ai-loading-dots">
                <span /><span /><span />
              </span>
              <!-- Streaming or completed: render markdown -->
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
              <!-- Retry button shown on completed assistant messages -->
              <button
                v-if="msg.final && !isLoading"
                class="ai-retry-btn"
                title="重新生成"
                @click="retry(i)"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 .49-4" />
                </svg>
                重新生成
              </button>
            </template>
          </div>
        </div>
      </div>

      <!-- Input area -->
      <div class="ai-drawer-input-wrap">
        <div class="ai-drawer-input-box">
          <textarea
            ref="inputRef"
            v-model="query"
            class="ai-drawer-input"
            placeholder="Ask a question..."
            rows="1"
            :disabled="isLoading"
            @keydown="onKeydown"
          />
          <div class="ai-drawer-input-actions">
            <!-- Stop button while loading -->
            <button
              v-if="isLoading"
              class="ai-drawer-stop"
              @click="stop"
              aria-label="停止"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
            </button>
            <!-- Send button when idle -->
            <button
              v-else
              class="ai-drawer-send"
              :disabled="!query.trim()"
              @click="submit"
              aria-label="发送"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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
/* Drawer panel */
.ai-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 380px;
  max-width: 100vw;
  background: var(--vp-c-bg);
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 32px rgba(0, 0, 0, 0.12);
  z-index: 100;
}

/* Header */
.ai-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--vp-c-divider);
  flex-shrink: 0;
}
.ai-drawer-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
  color: var(--vp-c-text-1);
}
.ai-star-icon {
  color: var(--vp-c-brand-1);
  flex-shrink: 0;
}
.ai-drawer-header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}
.ai-clear-btn,
.ai-drawer-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--vp-c-text-3);
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  line-height: 1;
}
.ai-clear-btn:hover,
.ai-drawer-close:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

/* Messages */
.ai-drawer-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px 20px 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.ai-drawer-empty {
  text-align: center;
  color: var(--vp-c-text-3);
  padding: 60px 0;
}
.ai-drawer-empty-icon { margin-bottom: 12px; }
.ai-drawer-empty p { font-size: 14px; line-height: 1.6; }

.ai-msg { display: flex; }
.ai-msg.user { justify-content: flex-end; }
.ai-msg.assistant { justify-content: flex-start; }

.user .ai-msg-bubble {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: 18px 18px 4px 18px;
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

/* Hide markstream-vue injected scroll-to-bottom button */
.assistant .ai-msg-bubble :deep([class*="scroll"]),
.assistant .ai-msg-bubble :deep([class*="goto"]) {
  display: none !important;
}

/* Override markstream-vue defaults to match VitePress theme */
.assistant .ai-msg-bubble :deep(.markstream-vue) {
  font-size: 14px;
  line-height: 1.7;
  color: var(--vp-c-text-1);
}
.assistant .ai-msg-bubble :deep(pre) {
  border-radius: 8px;
  font-size: 13px;
}
.assistant .ai-msg-bubble :deep(code:not(pre code)) {
  background: var(--vp-c-bg-soft);
  padding: 2px 5px;
  border-radius: 4px;
  font-size: 13px;
}
.assistant .ai-msg-bubble :deep(p) {
  margin: 0 0 8px;
}
.assistant .ai-msg-bubble :deep(p:last-child) {
  margin-bottom: 0;
}
.assistant .ai-msg-bubble :deep(ul),
.assistant .ai-msg-bubble :deep(ol) {
  padding-left: 20px;
  margin: 4px 0 8px;
}

/* Dark mode: use dark brand color for user bubble */
:root.dark .user .ai-msg-bubble {
  background: var(--vp-c-brand-1);
  color: #0a1628;
}

/* Loading dots */
.ai-loading-dots { display: inline-flex; gap: 4px; align-items: center; padding: 6px 0; }
.ai-loading-dots span {
  width: 6px; height: 6px;
  background: var(--vp-c-text-3);
  border-radius: 50%;
  animation: bounce 1.2s infinite;
}
.ai-loading-dots span:nth-child(2) { animation-delay: .2s; }
.ai-loading-dots span:nth-child(3) { animation-delay: .4s; }
@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-5px); }
}

/* Retry button */
.ai-retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: 1px solid var(--vp-c-divider);
  cursor: pointer;
  color: var(--vp-c-text-3);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1;
  transition: color .15s, border-color .15s, background .15s;
  align-self: flex-start;
}
.ai-retry-btn:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
}

/* Input area */
.ai-drawer-input-wrap {
  padding: 12px 16px 20px;
  flex-shrink: 0;
}
.ai-drawer-input-box {
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 20px;
  background: var(--vp-c-bg-soft);
  padding: 12px 14px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color .15s;
}
.ai-drawer-input-box:focus-within {
  border-color: var(--vp-c-brand-1);
}
.ai-drawer-input {
  width: 100%;
  resize: none;
  border: none;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-family: inherit;
  line-height: 1.5;
  outline: none;
  max-height: 120px;
  overflow-y: auto;
}
.ai-drawer-input::placeholder { color: var(--vp-c-text-3); }
.ai-drawer-input-actions {
  display: flex;
  justify-content: flex-end;
}
.ai-drawer-send,
.ai-drawer-stop {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: opacity .15s, background .15s;
  flex-shrink: 0;
}
.ai-drawer-send {
  background: var(--vp-c-brand-1);
}
.ai-drawer-send:hover:not(:disabled) { background: var(--vp-c-brand-2); }
.ai-drawer-send:disabled { opacity: 0.35; cursor: not-allowed; }
.ai-drawer-stop {
  background: #ef4444;
}
.ai-drawer-stop:hover { background: #dc2626; }

/* Slide-in animation */
.drawer-enter-active,
.drawer-leave-active {
  transition: transform .25s cubic-bezier(0.4, 0, 0.2, 1);
}
.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}

/* Mobile full width */
@media (max-width: 480px) {
  .ai-drawer { width: 100vw; }
}
</style>
