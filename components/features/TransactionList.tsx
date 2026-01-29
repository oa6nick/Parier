"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import { ru, enUS } from "date-fns/locale";
import { ArrowDown, ArrowUp, Coins, Trophy, Users, Wallet } from "lucide-react";
import { Transaction } from "@/types";
import { useTranslations, useFormatter, useLocale } from "next-intl";
import { cn } from "@/lib/utils";

interface TransactionListProps {
  transactions: Transaction[];
  className?: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, className }) => {
  const t = useTranslations('Wallet');
  const format = useFormatter();
  const locale = useLocale();

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "deposit":
        return <ArrowDown className="w-4 h-4" />;
      case "withdrawal":
        return <ArrowUp className="w-4 h-4" />;
      case "bet":
        return <Coins className="w-4 h-4" />;
      case "win":
        return <Trophy className="w-4 h-4" />;
      case "referral_bonus":
      case "referral_earnings":
        return <Users className="w-4 h-4" />;
      default:
        return <Wallet className="w-4 h-4" />;
    }
  };

  const getTransactionColor = (type: Transaction["type"]) => {
    switch (type) {
      case "deposit":
      case "win":
      case "referral_bonus":
      case "referral_earnings":
        return "text-green-600 bg-green-50";
      case "withdrawal":
      case "bet":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (transactions.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12 text-gray-400", className)}>
        <Wallet className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-sm">{t('noTransactions')}</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {transactions.map((transaction) => {
        const isPositive = transaction.amount > 0;
        
        return (
          <div
            key={transaction.id}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
              getTransactionColor(transaction.type)
            )}>
              {getTransactionIcon(transaction.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {t(`transactionTypes.${transaction.type}`)}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {transaction.description}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDistanceToNow(transaction.createdAt, {
                  addSuffix: true,
                  locale: locale === 'ru' ? ru : enUS,
                })}
              </p>
            </div>
            
            <div className={cn(
              "text-lg font-bold flex-shrink-0",
              isPositive ? "text-green-600" : "text-red-600"
            )}>
              {isPositive ? "+" : ""}{format.number(transaction.amount)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
