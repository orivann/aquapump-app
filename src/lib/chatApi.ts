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

const apiBase = (import.meta.env.VITE_REACT_APP_API_BASE as string | undefined) || "";

const withBase = (path: string) => {
  if (!apiBase) {
    return path;
  }

  return `${apiBase.replace(/\/$/, "")}${path}`;
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  return response.json() as Promise<T>;
}

export async function fetchChatHistory(sessionId: string) {
  const response = await fetch(withBase(`/chat/${sessionId}`));
  return handleResponse<ChatHistoryResponse>(response);
}

export async function sendChatMessage(sessionId: string | null, message: string) {
  const response = await fetch(withBase("/chat"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session_id: sessionId,
      message,
    }),
  });

  return handleResponse<ChatResponse>(response);
}
