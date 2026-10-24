import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useChat } from "@/hooks/use-chat";
import { MarkdownMessage } from "@/components/chat/MarkdownMessage";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { Button } from "@/components/ui/button";
import { PanelLeftOpen, Send, Sparkles } from "lucide-react";

export function ChatWindow() {
  const {
    sessions,
    activeSession,
    activeId,
    messages,
    loading,
    error,
    createNewChat,
    selectChat,
    deleteChat,
    send,
    dismissError,
  } = useChat();

  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false); // default closed on mobile, open on desktop
  const endRef = useRef<HTMLDivElement>(null);

  // Auto open sidebar on desktop mounts
  useEffect(() => {
    if (window.innerWidth >= 768) {
      setSidebarOpen(true);
    }
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, error]);

  const submit = () => {
    if (!input.trim() || loading) return;
    send(input);
    setInput("");
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const quickPrompts = [
    "Bagaimana cara membuat anggaran bulanan yang ideal?",
    "Apa tips menabung untuk pemula dengan gaji UMR?",
    "Bagaimana cara keluar dari jeratan hutang konsumtif?",
    "Apa bedanya investasi reksa dana dan saham?",
  ];

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      {/* Sidebar History */}
      <ChatSidebar
        sessions={sessions}
        activeId={activeId}
        onSelectChat={selectChat}
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
        isOpen={sidebarOpen}
        onToggleOpen={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col h-full min-w-0 relative">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card/80 px-3 sm:px-4 backdrop-blur">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {!sidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                title="Buka Sidebar"
                className="h-9 w-9 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
              >
                <PanelLeftOpen className="h-5 w-5" />
              </Button>
            )}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-sm">
                Rp
              </div>
              <div className="truncate">
                <h1 className="font-display text-base sm:text-lg font-bold leading-tight text-foreground truncate">
                  Cermat<span className="text-primary">Duit</span>
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block truncate">Asisten Literasi Keuangan Pribadi</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={createNewChat}
              variant="outline"
              size="sm"
              className="gap-1.5 rounded-xl text-xs font-medium cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="hidden xs:inline">Chat Baru</span>
            </Button>
          </div>
        </header>

        {/* Messages List */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto flex max-w-3xl flex-col gap-4 px-3 sm:px-4 py-6">
            {messages.map((m, idx) => {
              const isUser = m.role === "user";
              return (
                <div key={m.id || idx} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[90%] sm:max-w-[85%] rounded-2xl px-3.5 sm:px-4 py-3 text-sm leading-relaxed sm:text-[15px] break-words ${
                      isUser
                        ? "whitespace-pre-wrap rounded-br-sm bg-primary text-primary-foreground shadow-sm"
                        : "rounded-bl-sm border bg-card text-card-foreground shadow-soft"
                    }`}
                  >
                    {isUser ? m.content : <MarkdownMessage content={m.content} />}
                  </div>
                </div>
              );
            })}

            {/* Quick Prompts Suggestions (if only welcome message) */}
            {messages.length === 1 && (
              <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {quickPrompts.map((promptText) => (
                  <button
                    key={promptText}
                    onClick={() => {
                      send(promptText);
                    }}
                    className="flex items-start rounded-2xl border bg-card p-3 text-left text-xs sm:text-sm font-medium text-foreground transition-all hover:border-primary hover:bg-primary/5 hover:shadow-sm cursor-pointer"
                  >
                    <span className="line-clamp-2">{promptText}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-start" aria-live="polite">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border bg-card px-4 py-3 text-sm text-muted-foreground shadow-soft">
                  <span className="flex gap-1">
                    {[0, 150, 300].map((d) => (
                      <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </span>
                  CermatDuit sedang berpikir…
                </div>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div role="alert" className="flex items-start justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive shadow-sm">
                <span>{error}</span>
                <button onClick={dismissError} className="font-medium underline-offset-2 hover:underline cursor-pointer">Tutup</button>
              </div>
            )}

            <div ref={endRef} />
          </div>
        </main>

        {/* Input Footer */}
        <footer className="border-t bg-card/80 backdrop-blur shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="mx-auto flex max-w-3xl items-end gap-2 px-3 sm:px-4 py-3"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              rows={1}
              placeholder="Tulis pertanyaanmu tentang keuangan pribadi…"
              aria-label="Pesan"
              className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border bg-background px-3 sm:px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30 sm:text-[15px]"
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              size="icon"
              className="h-11 w-11 rounded-xl shrink-0 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </footer>
      </div>
    </div>
  );
}
