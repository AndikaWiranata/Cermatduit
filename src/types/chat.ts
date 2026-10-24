import { type ChatMessage } from "@/lib/chat-service";

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
}
