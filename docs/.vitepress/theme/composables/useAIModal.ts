import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'

export interface Message {
  role: 'user' | 'assistant'
  content: string
  loading?: boolean // true = waiting for first chunk (show dots)
  final?: boolean   // true = stream complete
}

const modalOpen = ref(false)
const initialQuery = ref('')

// Module-level: persists across component mount/unmount, survives modal close
// On read (page reload), normalize all messages: clear loading state and mark as final
const messages = useLocalStorage<Message[]>('lb-ai-chat', [], {
  serializer: {
    read: (raw) => {
      try {
        const parsed = JSON.parse(raw) as Message[]
        return parsed.map(m => ({ ...m, loading: false, final: true }))
      } catch {
        return []
      }
    },
    write: (val) => JSON.stringify(val),
  },
})

export function useAIModal() {
  function openAIModal(query?: string) {
    initialQuery.value = query ?? ''
    modalOpen.value = true
  }

  function toggleAIModal() {
    modalOpen.value = !modalOpen.value
  }

  function clearMessages() {
    messages.value = []
  }

  return { modalOpen, initialQuery, openAIModal, toggleAIModal, messages, clearMessages }
}
