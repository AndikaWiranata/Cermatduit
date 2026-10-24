import { useCallback, useEffect, useState } from "react";
import { sendChatMessage, type ChatMessage } from "@/lib/chat-service";
import { type ChatSession } from "@/types/chat";

const WELCOME_MESSAGE = "Halo! Saya CermatDuit. Ada yang ingin kamu tanyakan seputar keuangan pribadi?";
const STORAGE_KEY = "cermatduit-chat-sessions-v2";
const ACTIVE_SESSION_KEY = "cermatduit-active-session-id-v2";

function createDefaultSession(): ChatSession {
  return {
    id: crypto.randomUUID?.() || Math.random().toString(36).substring(2),
    title: "Percakapan Baru",
    messages: [{ id: "welcome", role: "assistant", content: WELCOME_MESSAGE }],
    updatedAt: Date.now(),
  };
}

export function useChat() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ChatSession[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return [createDefaultSession()];
  });

  const [activeId, setActiveId] = useState<string>(() => {
    try {
      const savedActive = localStorage.getItem(ACTIVE_SESSION_KEY);
      if (savedActive && sessions.some((s) => s.id === savedActive)) {
        return savedActive;
      }
    } catch {
      // fallback
    }
    return sessions[0]?.id || "";
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch {
      // ignore
    }
  }, [sessions]);

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_SESSION_KEY, activeId);
    } catch {
      // ignore
    }
  }, [activeId]);

  const activeSession = sessions.find((s) => s.id === activeId) || sessions[0] || createDefaultSession();

  const createNewChat = useCallback(() => {
    const newSession = createDefaultSession();
    setSessions((prev) => [newSession, ...prev]);
    setActiveId(newSession.id);
    setError(null);
  }, []);

  const selectChat = useCallback((id: string) => {
    setActiveId(id);
    setError(null);
  }, []);

  const deleteChat = useCallback((id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (filtered.length === 0) {
        const fresh = createDefaultSession();
        setActiveId(fresh.id);
        return [fresh];
      }
      if (id === activeId) {
        setActiveId(filtered[0].id);
      }
      return filtered;
    });
  }, [activeId]);

  const clearAllChats = useCallback(() => {
    const fresh = createDefaultSession();
    setSessions([fresh]);
    setActiveId(fresh.id);
    setError(null);
  }, []);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || loading) return;

      const userMsgId = crypto.randomUUID?.() || Math.random().toString(36).substring(2);
      const userMessage: ChatMessage = { id: userMsgId, role: "user", content };

      setError(null);
      setLoading(true);

      setSessions((prev) =>
        prev.map((session) => {
          if (session.id === activeSession.id) {
            const isFirstUserMsg = session.messages.filter((m) => m.role === "user").length === 0;
            const title = isFirstUserMsg
              ? content.length > 28 ? content.substring(0, 28) + "…" : content
              : session.title;

            return {
              ...session,
              title,
              messages: [...session.messages, userMessage],
              updatedAt: Date.now(),
            };
          }
          return session;
        })
      );

      try {
        const reply = await sendChatMessage(content);
        const assistantMsgId = crypto.randomUUID?.() || Math.random().toString(36).substring(2);
        const assistantMessage: ChatMessage = { id: assistantMsgId, role: "assistant", content: reply };

        setSessions((prev) =>
          prev.map((session) => {
            if (session.id === activeSession.id) {
              return {
                ...session,
                messages: [...session.messages, assistantMessage],
                updatedAt: Date.now(),
              };
            }
            return session;
          })
        );
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [loading, activeSession.id]
  );

  return {
    sessions,
    activeSession,
    activeId,
    messages: activeSession.messages,
    loading,
    error,
    createNewChat,
    selectChat,
    deleteChat,
    clearAllChats,
    send,
    dismissError: () => setError(null),
  };
}
