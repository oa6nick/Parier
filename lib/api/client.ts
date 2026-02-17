import { getSession } from "next-auth/react";

// Use relative path - Next.js rewrites proxy /api/v1/* to backend (NEXT_PUBLIC_API_URL)
// For server components, use getServerSession and pass token explicitly
const API_BASE = "";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const session = await getSession();
  const token = (session as { accessToken?: string })?.accessToken;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development" && res.status === 404 && path.startsWith("/api/v1")) {
      console.warn(`[api] 404 on ${path} — frontend may fall back to mock data. Ensure NEXT_PUBLIC_API_URL is set.`);
    }
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error || `API error: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export async function apiGet<T>(path: string): Promise<T> {
  return apiFetch<T>(path, { method: "GET" });
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiPut<T>(path: string, body?: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
}
