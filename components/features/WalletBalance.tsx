"use client";

import React from "react";
import { Wallet, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { TokenBalance } from "@/types";
import { useTranslations, useFormatter } from "next-intl";
import { cn } from "@/lib/utils";

interface WalletBalanceProps {
  balance: TokenBalance;
  className?: string;
}

export const WalletBalance: React.FC<WalletBalanceProps> = ({ balance, className }) => {
  const t = useTranslations('Wallet');
  const format = useFormatter();

  return (
    <div className={cn("bg-gradient-to-br from-primary to-secondary rounded-3xl p-6 text-white shadow-xl", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-white/80 font-medium">{t('balance')}</p>
            <p className="text-3xl font-bold">{format.number(balance.balance)}</p>
            <p className="text-xs text-white/70 mt-1">{t('tokens')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-white/80" />
            <span className="text-xs text-white/70">{t('totalDeposited')}</span>
          </div>
          <p className="text-lg font-bold">{format.number(balance.totalDeposited)}</p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4 text-white/80" />
            <span className="text-xs text-white/70">{t('totalWithdrawn')}</span>
          </div>
          <p className="text-lg font-bold">{format.number(balance.totalWithdrawn)}</p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-white/80" />
            <span className="text-xs text-white/70">{t('totalWon')}</span>
          </div>
          <p className="text-lg font-bold">{format.number(balance.totalWon)}</p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-4 h-4 text-white/80" />
            <span className="text-xs text-white/70">{t('totalSpent')}</span>
          </div>
          <p className="text-lg font-bold">{format.number(balance.totalSpent)}</p>
        </div>
      </div>
    </div>
  );
};
