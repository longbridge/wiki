<!-- docs/.vitepress/theme/components/AIModal.vue -->
<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

// ⚠️ 替换为真实后端地址
const AI_ENDPOINT = '/api/ai/chat'

interface Message {
  role: 'user' | 'assistant'
  content: string
  loading?: boolean
}

const props = defineProps<{
  modelValue: boolean
  initialQuery?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

const inputRef = ref<HTMLTextAreaElement>()
const messagesRef = ref<HTMLDivElement>()
const query = ref('')
const messages = ref<Message[]>([])
const isLoading = ref(false)

watch(
  () => props.modelValue,
  (open) => {
    if (!open) {
      messages.value = []
      query.value = ''
      isLoading.value = false
      return
    }
    nextTick(() => {
      if (props.initialQuery) {
        query.value = props.initialQuery
        submit()
      } else {
        inputRef.value?.focus()
      }
    })
  }
)

async function submit() {
  const text = query.value.trim()
  if (!text || isLoading.value) return

  messages.value.push({ role: 'user', content: text })
  query.value = ''
  isLoading.value = true

  const assistantMsg: Message = { role: 'assistant', content: '', loading: true }
  messages.value.push(assistantMsg)

  await nextTick()
  messagesRef.value?.scrollTo({ top: messagesRef.value.scrollHeight, behavior: 'smooth' })

  try {
    const res = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: text,
        history: messages.value.slice(0, -2).map(m => ({ role: m.role, content: m.content })),
      }),
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    if (!res.body) throw new Error('No response body')

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    assistantMsg.loading = false

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      for (const line of chunk.split('\n')) {
        if (!line.startsWith('data: ')) continue
        const data = line.slice(6).trim()
        if (data === '[DONE]') break
        assistantMsg.content += data
      }
      await nextTick()
      messagesRef.value?.scrollTo({ top: messagesRef.value.scrollHeight, behavior: 'smooth' })
    }
  } catch (e) {
    assistantMsg.content = '抱歉，出现了错误，请稍后重试。'
    assistantMsg.loading = false
  } finally {
    isLoading.value = false
  }
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
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="ai-modal-overlay" @click.self="close">
        <div class="ai-modal">
          <div class="ai-modal-header">
            <span class="ai-modal-title">AI 智能问答</span>
            <button class="ai-modal-close" @click="close" aria-label="关闭">✕</button>
          </div>

          <div ref="messagesRef" class="ai-modal-messages">
            <div v-if="messages.length === 0" class="ai-modal-empty">
              <div class="ai-modal-empty-icon">⚡</div>
              <p>输入你的问题，AI 将基于专业文档库为你解答</p>
            </div>
            <div
              v-for="(msg, i) in messages"
              :key="i"
              class="ai-msg"
              :class="msg.role"
            >
              <div class="ai-msg-bubble">
                <span v-if="msg.loading" class="ai-loading-dots">
                  <span /><span /><span />
                </span>
                <span v-else>{{ msg.content }}</span>
              </div>
            </div>
          </div>

          <div class="ai-modal-input-area">
            <textarea
              ref="inputRef"
              v-model="query"
              class="ai-modal-input"
              placeholder="输入问题，按 Enter 发送，Shift+Enter 换行…"
              rows="2"
              :disabled="isLoading"
              @keydown="onKeydown"
            />
            <button
              class="ai-modal-send"
              :disabled="isLoading || !query.trim()"
              @click="submit"
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.ai-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.ai-modal {
  background: var(--vp-c-bg);
  border-radius: 16px;
  width: 100%;
  max-width: 680px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 80px rgba(0,0,0,0.2);
}
.ai-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--vp-c-divider);
  flex-shrink: 0;
}
.ai-modal-title {
  font-weight: 600;
  font-size: 16px;
  color: var(--vp-c-text-1);
}
.ai-modal-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: var(--vp-c-text-3);
  padding: 4px 8px;
  border-radius: 6px;
}
.ai-modal-close:hover { background: var(--vp-c-bg-soft); }
.ai-modal-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ai-modal-empty {
  text-align: center;
  color: var(--vp-c-text-3);
  padding: 40px 0;
}
.ai-modal-empty-icon { font-size: 32px; margin-bottom: 12px; }
.ai-msg { display: flex; }
.ai-msg.user { justify-content: flex-end; }
.ai-msg.assistant { justify-content: flex-start; }
.ai-msg-bubble {
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
}
.user .ai-msg-bubble {
  background: var(--vp-c-brand-1);
  color: white;
}
.assistant .ai-msg-bubble {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}
.ai-loading-dots { display: inline-flex; gap: 4px; align-items: center; }
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
  40% { transform: translateY(-6px); }
}
.ai-modal-input-area {
  display: flex;
  gap: 8px;
  padding: 12px 20px 16px;
  border-top: 1px solid var(--vp-c-divider);
  flex-shrink: 0;
}
.ai-modal-input {
  flex: 1;
  resize: none;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 14px;
  font-family: inherit;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  outline: none;
}
.ai-modal-input:focus { border-color: var(--vp-c-brand-1); }
.ai-modal-send {
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity .15s;
}
.ai-modal-send:disabled { opacity: 0.4; cursor: not-allowed; }

.modal-enter-active, .modal-leave-active { transition: opacity .2s; }
.modal-enter-active .ai-modal, .modal-leave-active .ai-modal { transition: transform .2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .ai-modal, .modal-leave-to .ai-modal { transform: translateY(16px); }
</style>
