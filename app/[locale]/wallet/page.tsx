"use client";

import React, { useState, useMemo } from "react";
import { Wallet, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { WalletBalance } from "@/components/features/WalletBalance";
import { TransactionList } from "@/components/features/TransactionList";
import { DepositModal } from "@/components/features/DepositModal";
import { TransactionFilter } from "@/components/features/TransactionFilter";
import { getTokenBalance, getTransactions, addTransaction } from "@/lib/mockData/wallet";
import { users } from "@/lib/mockData/users";
import { TransactionType } from "@/types";

export default function WalletPage() {
  const t = useTranslations('Wallet');
  const currentUser = users[0];
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<TransactionType | "all">("all");
  
  const balance = getTokenBalance(currentUser.id);
  const allTransactions = getTransactions(currentUser.id);

  const filteredTransactions = useMemo(() => {
    if (selectedType === "all") return allTransactions;
    return allTransactions.filter((t) => t.type === selectedType);
  }, [allTransactions, selectedType]);

  const handleDeposit = (amount: number) => {
    addTransaction({
      id: `t${Date.now()}`,
      userId: currentUser.id,
      type: "deposit",
      amount,
      description: "Deposit via card",
      createdAt: new Date(),
    });
  };

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
            <p className="text-gray-500">{t('subtitle')}</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsDepositModalOpen(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            {t('deposit')}
          </Button>
        </div>

        {/* Balance Card */}
        <div className="mb-8">
          <WalletBalance balance={balance} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">{t('totalDeposits')}</p>
            <p className="text-xl font-bold text-gray-900">{balance.totalDeposited}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">{t('totalWithdrawals')}</p>
            <p className="text-xl font-bold text-gray-900">{balance.totalWithdrawn}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">{t('totalWins')}</p>
            <p className="text-xl font-bold text-green-600">{balance.totalWon}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">{t('totalSpent')}</p>
            <p className="text-xl font-bold text-red-600">{balance.totalSpent}</p>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">{t('transactions')}</h2>
          </div>

          {/* Filter */}
          <div className="mb-6">
            <TransactionFilter
              selectedType={selectedType}
              onTypeChange={setSelectedType}
            />
          </div>

          {/* Transaction List */}
          <TransactionList transactions={filteredTransactions} />
        </div>
      </div>

      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onDeposit={handleDeposit}
      />
    </>
  );
}
