import { apiRequest } from "./apiClient";

export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  role: ChatRole;
  content: string;
  created_at?: string;
}

export interface ChatResponse {
  session_id: string;
  reply: string;
  messages: ChatMessage[];
}

export interface ChatHistoryResponse {
  session_id: string;
  messages: ChatMessage[];
}

export async function fetchChatHistory(sessionId: string) {
  return apiRequest<ChatHistoryResponse>(`/chat/${sessionId}`);
}

export async function sendChatMessage(
  sessionId: string | null,
  message: string,
) {
  return apiRequest<ChatResponse>("/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session_id: sessionId,
      message,
    }),
  });
}
