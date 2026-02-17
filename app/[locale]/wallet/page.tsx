"use client";

import React, { useState, useEffect, useCallback } from "react";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Wallet, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { WalletBalance } from "@/components/features/WalletBalance";
import { TransactionList } from "@/components/features/TransactionList";
import { DepositModal } from "@/components/features/DepositModal";
import { TransactionFilter } from "@/components/features/TransactionFilter";
import { getBalance, getTransactions, deposit } from "@/lib/api/wallet";
import { getTokenBalance, getTransactions as getMockTransactions } from "@/lib/mockData/wallet";
import { useAuth } from "@/context/AuthContext";
import { TransactionType, TokenBalance } from "@/types";

function WalletPageContent() {
  const t = useTranslations("Wallet");
  const { user } = useAuth();
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<TransactionType | "all">("all");
  const [balance, setBalance] = useState<TokenBalance | null>(null);
  const [allTransactions, setAllTransactions] = useState<{ id: string; userId: string; type: TransactionType; amount: number; description: string; createdAt: Date }[]>([]);
  const [loading, setLoading] = useState(true);
  const [useApi, setUseApi] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [bal, tx] = await Promise.all([getBalance(), getTransactions(0, 100)]);
      setBalance(bal);
      setAllTransactions(
        tx.transactions.map((t) => ({
          ...t,
          createdAt: t.createdAt instanceof Date ? t.createdAt : new Date(t.createdAt),
        }))
      );
      setUseApi(true);
    } catch {
      const mockBal = getTokenBalance(user.id);
      const mockTx = getMockTransactions(user.id);
      setBalance(mockBal);
      setAllTransactions(mockTx);
      setUseApi(false);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredTransactions = React.useMemo(() => {
    if (!allTransactions.length) return [];
    if (selectedType === "all") return allTransactions;
    return allTransactions.filter((tx) => tx.type === selectedType);
  }, [allTransactions, selectedType]);

  const handleDeposit = async (amount: number) => {
    if (!user?.id) return;
    try {
      const newBalance = await deposit(amount, "Deposit via card");
      setBalance(newBalance);
      await fetchData();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Deposit failed");
    }
  };

  if (loading && !balance) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8" />
        <div className="h-48 bg-gray-200 rounded-3xl animate-pulse mb-8" />
      </div>
    );
  }

  const displayBalance = balance ?? {
    userId: user?.id ?? "",
    balance: 0,
    totalDeposited: 0,
    totalWithdrawn: 0,
    totalWon: 0,
    totalSpent: 0,
  };

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
            <p className="text-gray-500">{t("subtitle")}</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsDepositModalOpen(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            {t("deposit")}
          </Button>
        </div>

        <div className="mb-8">
          <WalletBalance balance={displayBalance} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">{t("totalDeposits")}</p>
            <p className="text-xl font-bold text-gray-900">{displayBalance.totalDeposited}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">{t("totalWithdrawals")}</p>
            <p className="text-xl font-bold text-gray-900">{displayBalance.totalWithdrawn}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">{t("totalWins")}</p>
            <p className="text-xl font-bold text-green-600">{displayBalance.totalWon}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">{t("totalSpent")}</p>
            <p className="text-xl font-bold text-red-600">{displayBalance.totalSpent}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">{t("transactions")}</h2>
          </div>
          <div className="mb-6">
            <TransactionFilter selectedType={selectedType} onTypeChange={setSelectedType} />
          </div>
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

export default function WalletPage() {
  return (
    <RequireAuth>
      <WalletPageContent />
    </RequireAuth>
  );
}
