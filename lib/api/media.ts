import { getSession } from "next-auth/react";

const API_BASE = "";

export type UploadResponse = {
  success: boolean;
  media_id: string;
  url: string;
  name: string;
  size: number;
};

export async function uploadMedia(file: File): Promise<string> {
  const session = await getSession();
  const token = (session as { accessToken?: string })?.accessToken;

  const formData = new FormData();
  formData.append("file", file);

  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `/api/v1/media/upload`;
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error || `Upload failed: ${res.status}`);
  }

  const data = (await res.json()) as UploadResponse;
  return data.media_id;
}
