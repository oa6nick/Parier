"use client";

import React, { Suspense } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { getBetsSync } from "@/lib/mockData/bets";
import { SelectableBetCard } from "@/components/features/SelectableBetCard";

function PickPageContent() {
  const t = useTranslations("Pick");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const mode = (searchParams?.get("mode") as "create" | "share") || "share";

  const bets = getBetsSync(locale);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <Link
        href={mode === "create" ? "/create" : "/share"}
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">{t("back")}</span>
      </Link>

      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {mode === "create" ? t("titleCreate") : t("titleShare")}
          </h1>
        </div>
        <p className="text-gray-500 text-lg">
          {mode === "create" ? t("subtitleCreate") : t("subtitleShare")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {bets.map((bet) => (
          <SelectableBetCard
            key={bet.id}
            bet={bet}
            href={
              mode === "create"
                ? `/create?from=${bet.id}`
                : `/bet/${bet.id}`
            }
            mode={mode}
          />
        ))}
      </div>
    </div>
  );
}

export default function PickPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-16 animate-pulse" />}>
      <PickPageContent />
    </Suspense>
  );
}
