// Konfigurasi endpoint chatbot n8n (Chat Trigger, mode publik).
// Bisa ditimpa lewat VITE_N8N_WEBHOOK_URL.
const DEFAULT_ENDPOINT =
  "https://bcfastera2026.app.n8n.cloud/webhook/f6586bf8-f610-4719-91c7-5b7ec07ab6c7/chat";

export const CHAT_CONFIG = {
  endpoint: (import.meta.env["VITE_N8N_WEBHOOK_URL"] as string | undefined) || DEFAULT_ENDPOINT,
  timeoutMs: 60000,
};
