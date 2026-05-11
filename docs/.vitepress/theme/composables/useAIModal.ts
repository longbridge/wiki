import { ref } from 'vue'

const modalOpen = ref(false)
const initialQuery = ref('')

export function useAIModal() {
  function openAIModal(query?: string) {
    initialQuery.value = query ?? ''
    modalOpen.value = true
  }
  return { modalOpen, initialQuery, openAIModal }
}
