import { Plus, MessageSquare, Trash2, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type ChatSession } from "@/types/chat";

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeId: string;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string, e: React.MouseEvent) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export function ChatSidebar({
  sessions,
  activeId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  isOpen,
  onToggleOpen,
}: ChatSidebarProps) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity md:hidden"
          onClick={onToggleOpen}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card shadow-2xl transition-transform duration-300 ease-in-out md:static md:z-auto md:shadow-none ${
          isOpen
            ? "w-80 translate-x-0 sm:w-72"
            : "-translate-x-full md:w-0 md:translate-x-0 md:overflow-hidden md:border-r-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2.5 font-display font-bold text-foreground">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-sm text-primary-foreground shadow-sm">
              Rp
            </div>
            <span className="text-base tracking-tight">Cermat<span className="text-primary">Duit</span></span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleOpen}
            title="Tutup Sidebar"
            className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="p-3 shrink-0">
          <Button
            onClick={() => {
              onNewChat();
              // On mobile, auto close sidebar after starting new chat for better UX
              if (window.innerWidth < 768) {
                onToggleOpen();
              }
            }}
            className="w-full justify-start gap-2 rounded-xl font-medium shadow-sm transition-all hover:shadow"
          >
            <Plus className="h-4 w-4" />
            Chat Baru
          </Button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Riwayat Percakapan
          </div>
          <div className="flex flex-col gap-1">
            {sessions.map((session) => {
              const isActive = session.id === activeId;
              return (
                <div
                  key={session.id}
                  onClick={() => {
                    onSelectChat(session.id);
                    if (window.innerWidth < 768) {
                      onToggleOpen();
                    }
                  }}
                  className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium cursor-pointer transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground/80 hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    <MessageSquare className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="truncate">{session.title}</span>
                  </div>
                  {sessions.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => onDeleteChat(session.id, e)}
                      title="Hapus percakapan"
                      className="opacity-60 md:opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t p-3 text-center text-xs text-muted-foreground shrink-0">
          Asisten Literasi Keuangan Pribadi
        </div>
      </aside>
    </>
  );
}
