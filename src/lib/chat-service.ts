import { CHAT_CONFIG } from "./chat-config";

export type ChatRole = "user" | "assistant";
export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

export class ChatServiceError extends Error {}

function getSessionId(): string {
  const key = "cermatduit-session";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

/** Ambil teks jawaban dari berbagai bentuk respons n8n yang umum. */
function extractReply(data: unknown): string | null {
  if (typeof data === "string") return data.trim() || null;
  if (Array.isArray(data)) return data.length ? extractReply(data[0]) : null;
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    for (const k of ["output", "reply", "response", "message", "text", "answer"]) {
      if (typeof o[k] === "string" && (o[k] as string).trim()) return (o[k] as string).trim();
    }
  }
  return null;
}

export async function sendChatMessage(message: string): Promise<string> {
  if (!CHAT_CONFIG.endpoint) {
    throw new ChatServiceError(
      "Chatbot belum terhubung ke server. Silakan atur alamat endpoint terlebih dahulu.",
    );
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CHAT_CONFIG.timeoutMs);
  try {
    const res = await fetch(CHAT_CONFIG.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "sendMessage", sessionId: getSessionId(), chatInput: message }),
      signal: controller.signal,
    });
    if (!res.ok) throw new ChatServiceError("Maaf, server sedang bermasalah. Coba lagi sebentar lagi.");
    const ct = res.headers.get("content-type") ?? "";
    const data = ct.includes("application/json") ? await res.json() : await res.text();
    const reply = extractReply(data);
    if (!reply) throw new ChatServiceError("Maaf, saya belum bisa memberikan jawaban. Coba ulangi pertanyaanmu.");
    return reply;
  } catch (e) {
    if (e instanceof ChatServiceError) throw e;
    if ((e as Error).name === "AbortError")
      throw new ChatServiceError("Permintaan terlalu lama. Periksa koneksi lalu coba lagi.");
    throw new ChatServiceError("Gagal terhubung. Periksa koneksi internetmu lalu coba lagi.");
  } finally {
    clearTimeout(timer);
  }
}
