"use client";

import { useState, useEffect, useCallback } from "react";
import { getBets, mapBetResponseToBet, type BetResponse } from "@/lib/api/bets";
import { useDictionaries } from "@/lib/hooks/useDictionaries";
import { getBetsSync } from "@/lib/mockData/bets";
import type { Bet } from "@/types";

const statusIdToStatus: Record<string, Bet["status"]> = {
  open: "open",
  closed: "closed",
  completed: "completed",
  cancelled: "cancelled",
};

export function useBets(locale: string, filters?: { category?: string; search?: string }) {
  const { categories, loading: dictLoading } = useDictionaries(locale);
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [useApi, setUseApi] = useState(false);

  const fetchBets = useCallback(async () => {
    setLoading(true);
    try {
      const lang = locale === "ru" ? "ru" : "en";
      const payload: Parameters<typeof getBets>[0] = {
        language: lang,
        limit: 100,
        offset: 0,
      };
      if (filters?.category) payload.category_id = filters.category;

      const data = await getBets(payload);

      const mapped: Bet[] = data.map((r: BetResponse) => {
        const cat = categories.find((c) => c.id === r.category_id) ?? {
          id: r.category_id,
          name: r.category_name,
          color: "purple",
        };
        return mapBetResponseToBet(r, cat, statusIdToStatus);
      });

      setBets(mapped);
      setUseApi(true);
    } catch {
      const mockBets = getBetsSync(locale);
      setBets(mockBets);
      setUseApi(false);
    } finally {
      setLoading(false);
    }
  }, [locale, filters?.category, categories]);

  useEffect(() => {
    if (dictLoading) return;
    fetchBets();
  }, [fetchBets, dictLoading]);

  return { bets, categories, loading: loading || dictLoading, useApi, refetch: fetchBets };
}
