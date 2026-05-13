const env = import.meta.env

export const AI_ENDPOINT: string =
  env.VITE_AI_API_ENDPOINT || '/api/ai/v1/invoke'

const AGENT_KEY: string = env.VITE_AI_AGENT_KEY || ''

if (!AGENT_KEY && import.meta.env.PROD) {
  console.warn('[ai] VITE_AI_AGENT_KEY is not set at build time')
}

export const AI_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  'account-channel': env.VITE_AI_ACCOUNT_CHANNEL || 'lb',
  'app-id': env.VITE_AI_APP_ID || 'longbridge',
  'X-Agent-Key': AGENT_KEY,
}
