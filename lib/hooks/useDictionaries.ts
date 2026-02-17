"use client";

import {useState, useEffect} from "react";
import {getCategories as getMockCategories} from "@/lib/mockData/categories";
import {Category} from "@/types";
import {useApi} from "@/api/context";
import {ParierServerInternalModelsDictionaryItemString} from "@/api/client";

const mockVerificationSources: ParierServerInternalModelsDictionaryItemString[] = [
  {id: "official", name: "Official source"},
  {id: "media", name: "Media"},
  {id: "expert", name: "Expert"},
];

export function useDictionaries(locale: string) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [verificationSources, setVerificationSources] = useState<ParierServerInternalModelsDictionaryItemString[]>([]);
  const [betStatuses, setBetStatuses] = useState<ParierServerInternalModelsDictionaryItemString[]>([]);
  const [betTypes, setBetTypes] = useState<ParierServerInternalModelsDictionaryItemString[]>([]);
  const [loading, setLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        const lang = locale === "ru" ? "ru" : "en";
        const [cats, vs, statuses, types] = await Promise.all([
          api.ParierApi.parierCategoriesPost({language: lang}).then((res) => res.data?.data),
          api.ParierApi.parierVerificationSourcesPost({language: lang}).then((res) => res.data?.data),
          api.ParierApi.parierBetStatusesPost({language: lang}).then((res) => res.data?.data),
          api.ParierApi.parierBetTypesPost({language: lang}).then((res) => res.data?.data),
        ]);

        if (!cancelled) {
          setCategories(
            (cats ?? []).map((c) => ({id: c.id, name: c.name, color: "purple"} as any))
          );
          setVerificationSources(vs as any);
          setBetStatuses(statuses as any);
          setBetTypes(types as any);
        }
      } catch {
        if (!cancelled) {
          const mockCats = getMockCategories(locale);
          setCategories(mockCats);
          setVerificationSources(mockVerificationSources);
          setBetStatuses([{id: "open", name: "Open"}]);
          setBetTypes([{id: "standard", name: "Standard"}]);
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
  };
}
