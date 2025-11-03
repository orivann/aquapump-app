import { apiRequest } from "./apiClient";

export interface NewsletterResponse {
  status: "subscribed";
}

export async function subscribeToNewsletter(email: string, options?: { source?: string; metadata?: Record<string, unknown> }) {
  return apiRequest<NewsletterResponse>("/newsletter", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      source: options?.source ?? "footer-newsletter",
      metadata: options?.metadata ?? {},
    }),
  });
}
