import { apiPost } from "./client";

export type DictionaryItem = { id: string; name: string };

type ApiResponse<T> = { success: boolean; message?: string; data: T };

export async function getCategories(language: string): Promise<DictionaryItem[]> {
  const res = await apiPost<ApiResponse<DictionaryItem[]>>("/api/v1/parier/categories", {
    language: language === "ru" ? "ru" : "en",
  });
  return res.data ?? [];
}

export async function getVerificationSources(language: string): Promise<DictionaryItem[]> {
  const res = await apiPost<ApiResponse<DictionaryItem[]>>("/api/v1/parier/verification-sources", {
    language: language === "ru" ? "ru" : "en",
  });
  return res.data ?? [];
}

export async function getBetStatuses(language: string): Promise<DictionaryItem[]> {
  const res = await apiPost<ApiResponse<DictionaryItem[]>>("/api/v1/parier/bet-statuses", {
    language: language === "ru" ? "ru" : "en",
  });
  return res.data ?? [];
}

export async function getBetTypes(language: string): Promise<DictionaryItem[]> {
  const res = await apiPost<ApiResponse<DictionaryItem[]>>("/api/v1/parier/bet-types", {
    language: language === "ru" ? "ru" : "en",
  });
  return res.data ?? [];
}
