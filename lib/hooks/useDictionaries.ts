"use client";

import { useState, useEffect } from "react";
import {
  getCategories,
  getVerificationSources,
  getBetStatuses,
  getBetTypes,
  type DictionaryItem,
} from "@/lib/api/dictionaries";
import { getCategories as getMockCategories } from "@/lib/mockData/categories";
import { Category } from "@/types";

const mockVerificationSources: DictionaryItem[] = [
  { id: "official", name: "Official source" },
  { id: "media", name: "Media" },
  { id: "expert", name: "Expert" },
];

export function useDictionaries(locale: string) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [verificationSources, setVerificationSources] = useState<DictionaryItem[]>([]);
  const [betStatuses, setBetStatuses] = useState<DictionaryItem[]>([]);
  const [betTypes, setBetTypes] = useState<DictionaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [useApi, setUseApi] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        const lang = locale === "ru" ? "ru" : "en";
        const [cats, vs, statuses, types] = await Promise.all([
          getCategories(lang),
          getVerificationSources(lang),
          getBetStatuses(lang),
          getBetTypes(lang),
        ]);

        if (!cancelled) {
          setCategories(
            cats.map((c) => ({ id: c.id, name: c.name, color: "purple" }))
          );
          setVerificationSources(vs);
          setBetStatuses(statuses);
          setBetTypes(types);
          setUseApi(true);
        }
      } catch {
        if (!cancelled) {
          const mockCats = getMockCategories(locale);
          setCategories(mockCats);
          setVerificationSources(mockVerificationSources);
          setBetStatuses([{ id: "open", name: "Open" }]);
          setBetTypes([{ id: "standard", name: "Standard" }]);
          setUseApi(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  return {
    categories,
    verificationSources,
    betStatuses,
    betTypes,
    loading,
    useApi,
  };
}
