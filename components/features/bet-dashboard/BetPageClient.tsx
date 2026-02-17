"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { getBetById, mapBetResponseToBet } from "@/lib/api/bets";
import { useDictionaries } from "@/lib/hooks/useDictionaries";
import { getBetByIdSync } from "@/lib/mockData/bets";
import { BetDetailView } from "./BetDetailView";
import type { Bet } from "@/types";

const statusIdToStatus: Record<string, Bet["status"]> = {
  open: "open",
  closed: "closed",
  completed: "completed",
  cancelled: "cancelled",
};

export function BetPageClient() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const locale = (typeof params?.locale === "string" ? params.locale : "en") || "en";
  const { categories } = useDictionaries(locale);
  const [bet, setBet] = useState<Bet | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    if (!id) {
      setNotFoundState(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setNotFoundState(false);

    const lang = locale === "ru" ? "ru" : "en";

    getBetById(id, lang)
      .then((res) => {
        if (cancelled) return;
        if (!res) {
          setNotFoundState(true);
          setBet(null);
          return;
        }
        const cat =
          categories.find((c) => c.id === res.category_id) ?? {
            id: res.category_id,
            name: res.category_name,
            color: "purple",
          };
        setBet(mapBetResponseToBet(res, cat, statusIdToStatus));
      })
      .catch(() => {
        if (cancelled) return;
        const mockBet = getBetByIdSync(id, locale);
        if (mockBet) {
          setBet(mockBet);
        } else {
          setNotFoundState(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, locale, categories]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
              <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
            </div>
            <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (notFoundState || !bet) {
    notFound();
  }

  return <BetDetailView bet={bet} />;
}
