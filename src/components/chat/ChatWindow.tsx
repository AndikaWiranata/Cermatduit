import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useChat } from "@/hooks/use-chat";
import { MarkdownMessage } from "@/components/chat/MarkdownMessage";

export function ChatWindow() {
  const { messages, loading, error, send, dismissError } = useChat();
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex h-dvh flex-col bg-background">
      <header className="border-b bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-lg font-bold text-primary-foreground shadow-soft">
            Rp
          </div>
          <div>
            <h1 className="font-display text-xl font-bold leading-tight text-foreground">
              Cermat<span className="text-primary">Duit</span>
            </h1>
            <p className="text-xs text-muted-foreground">Asisten Literasi Keuangan Pribadi</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:text-[15px] ${
                  m.role === "user"
                    ? "whitespace-pre-wrap rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm border bg-card text-card-foreground shadow-soft"
                }`}
              >
                {m.role === "user" ? m.content : <MarkdownMessage content={m.content} />}
              </div>
            </div>
          ))}
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
          {error && (
            <div role="alert" className="flex items-start justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <span>{error}</span>
              <button onClick={dismissError} className="font-medium underline-offset-2 hover:underline">Tutup</button>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </main>

      <footer className="border-t bg-card/80 backdrop-blur">
        <form
          onSubmit={(e) => { e.preventDefault(); submit(); }}
          className="mx-auto flex max-w-3xl items-end gap-2 px-4 py-3"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            rows={1}
            placeholder="Tulis pertanyaanmu tentang keuangan…"
            aria-label="Pesan"
            className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30 sm:text-[15px]"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
          >
            Kirim
          </button>
        </form>
      </footer>
    </div>
  );
}
