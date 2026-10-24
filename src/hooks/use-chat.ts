import { useCallback, useState } from "react";
import { sendChatMessage, type ChatMessage } from "@/lib/chat-service";

export const WELCOME =
  "Halo! Saya CermatDuit. Ada yang ingin kamu tanyakan seputar keuangan pribadi?";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: WELCOME },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || loading) return;
      setError(null);
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", content }]);
      setLoading(true);
      try {
        const reply = await sendChatMessage(content);
        setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: reply }]);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [loading],
  );

  return { messages, loading, error, send, dismissError: () => setError(null) };
}
