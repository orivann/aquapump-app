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

type RequestOptions = {
  signal?: AbortSignal;
};

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

export async function fetchChatHistory(sessionId: string, { signal }: RequestOptions = {}) {
  const response = await fetch(withBase(`/chat/${sessionId}`), { signal });
  return handleResponse<ChatHistoryResponse>(response);
}

export async function sendChatMessage(sessionId: string | null, message: string, { signal }: RequestOptions = {}) {
  const response = await fetch(withBase("/chat"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal,
    body: JSON.stringify({
      session_id: sessionId,
      message,
    }),
  });

  return handleResponse<ChatResponse>(response);
}
