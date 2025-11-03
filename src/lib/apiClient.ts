const apiBase = (import.meta.env.VITE_REACT_APP_API_BASE as string | undefined) || "";

export const buildApiUrl = (path: string) => {
  if (!apiBase) {
    return path;
  }

  return `${apiBase.replace(/\/$/, "")}${path}`;
};

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(buildApiUrl(path), options);

  if (!response.ok) {
    let message = "Request failed";
    try {
      const body = await response.json();
      message = (body as { detail?: string; message?: string }).detail ?? body.message ?? message;
    } catch {
      const text = await response.text().catch(() => "");
      if (text) {
        message = text;
      }
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
