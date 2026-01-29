"use client";

import React from "react";
import { Filter } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { TransactionType } from "@/types";
import { cn } from "@/lib/utils";

interface TransactionFilterProps {
  selectedType: TransactionType | "all";
  onTypeChange: (type: TransactionType | "all") => void;
  className?: string;
}

export const TransactionFilter: React.FC<TransactionFilterProps> = ({
  selectedType,
  onTypeChange,
  className,
}) => {
  const t = useTranslations('Wallet');

  const types: (TransactionType | "all")[] = [
    "all",
    "deposit",
    "withdrawal",
    "bet",
    "win",
    "referral_bonus",
    "referral_earnings",
  ];

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onTypeChange(type)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            selectedType === type
              ? "bg-primary text-white shadow-sm"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          {type === "all" ? t('all') : t(`transactionTypes.${type}`)}
        </button>
      ))}
    </div>
  );
};
