import { createFileRoute } from "@tanstack/react-router";
import { ChatWindow } from "@/components/chat/ChatWindow";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CermatDuit – Asisten Literasi Keuangan Pribadi" },
      { name: "description", content: "Tanya jawab seputar keuangan pribadi dengan bahasa Indonesia yang sederhana dan ramah." },
      { property: "og:title", content: "CermatDuit – Asisten Literasi Keuangan Pribadi" },
      { property: "og:description", content: "Chatbot literasi keuangan pribadi berbahasa Indonesia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChatWindow,
});
