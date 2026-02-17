"use client";

import {useState, useEffect, useCallback} from "react";
import {useDictionaries} from "@/lib/hooks/useDictionaries";
import {getBetsSync} from "@/lib/mockData/bets";
import type {Bet, Category, User} from "@/types";
import {useApi} from "@/api/context";
import {ParierServerInternalModelsBetResponse} from "@/api/client";

const statusIdToStatus: Record<string, Bet["status"]> = {
  open: "open",
  closed: "closed",
  completed: "completed",
  cancelled: "cancelled",
};

export function mapBetResponseToBet(
  r: ParierServerInternalModelsBetResponse,
  category: Category,
  statusMap: Record<string, "open" | "closed" | "completed" | "cancelled"> = {}
): Bet {
  const status = (statusMap[r.status_id!] ?? "open") as Bet["status"];
  const desc = r.description ?? "";
  const [shortDesc, rest] = desc.includes("\n\n") ? desc.split("\n\n", 2) : [desc, ""];
  const [fullDesc, outcome] = rest.includes("\n\n") ? rest.split("\n\n", 2) : [rest, ""];

  const author: User = {
    id: r.author!.id!,
    username: r.author!.username ?? "User",
    avatar: undefined,
    rating: 0,
    winRate: r.author!.win_rate ?? 0,
    verified: r.author!.verified ?? false,
    joinedDate: r.author!.created_at ? new Date(r.author!.created_at) : new Date(),
    totalBets: 0,
  };

  return {
    id: r.id!,
    author,
    title: r.title!,
    shortDescription: shortDesc || r.title!,
    fullDescription: fullDesc || shortDesc || r.title!,
    outcome: outcome || "",
    category,
    betAmount: r.amount!,
    coefficient: r.coefficient!,
    potentialWinnings: r.amount! * r.coefficient!,
    status,
    deadline: new Date(r.deadline!),
    verificationSource: r.verification_sources?.map((v) => v.name).join(", "),
    createdAt: r.created_at! ? new Date(r.created_at!) : new Date(),
    tags: [],
    commentsCount: r.comments! ?? 0,
    betsCount: r.bets_count! ?? 0,
    likesCount: r.likes! ?? 0,
    likedByMe: r.is_liked_by_me! ?? false,
  } as Bet;
}

export function useBets(locale: string, filters?: {category?: string; search?: string}) {
  const {categories, loading: dictLoading} = useDictionaries(locale);
  const [bets, setBets] = useState<Bet[]>([]);
  const api = useApi();
  const [loading, setLoading] = useState(true);

  const fetchBets = useCallback(async () => {
    setLoading(true);
    try {
      const lang = locale === "ru" ? "ru" : "en";
      const data = await api.ParierApi.parierBetPost({language: lang, category_id: filters?.category, offset: 0, limit: 100}).then((res) => res.data?.data);

      const mapped: Bet[] = (data ?? []).map((r: any) => {
        const cat = categories.find((c) => c.id === r.category_id) ?? {
          id: r.category_id,
          name: r.category_name,
          color: "purple",
        };
        return mapBetResponseToBet(r, cat, statusIdToStatus);
      });

      setBets(mapped);
    } catch {
      const mockBets = getBetsSync(locale);
      setBets(mockBets);
    } finally {
      setLoading(false);
    }
  }, [locale, filters?.category, categories]);

  useEffect(() => {
    if (dictLoading) return;
    fetchBets();
  }, [fetchBets, dictLoading]);

  return {bets, categories, loading: loading || dictLoading, useApi, refetch: fetchBets};
}
