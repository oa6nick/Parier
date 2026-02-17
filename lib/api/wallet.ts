import { apiGet, apiPost } from "./client";
import type { TokenBalance, Transaction, TransactionType } from "@/types";

type ApiResponse<T> = { success: boolean; data?: T };

type BalanceResponse = {
  userId: string;
  balance: number;
  totalDeposited: number;
  totalWithdrawn: number;
  totalWon: number;
  totalSpent: number;
};

type TransactionResponse = {
  id: string;
  userId: string;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
  relatedBetId?: string;
  relatedUserId?: string;
};

const typeMap: Record<string, TransactionType> = {
  deposit: "deposit",
  withdrawal: "withdrawal",
  bet: "bet",
  win: "win",
  admin_credit: "admin_credit",
  referral_bonus: "referral_bonus",
  referral_earnings: "referral_earnings",
};

export async function getBalance(): Promise<TokenBalance> {
  const res = await apiGet<ApiResponse<BalanceResponse>>("/api/v1/wallet/balance");
  const d = res.data;
  if (!d) {
    return {
      userId: "",
      balance: 0,
      totalDeposited: 0,
      totalWithdrawn: 0,
      totalWon: 0,
      totalSpent: 0,
    };
  }
  return {
    userId: d.userId,
    balance: d.balance,
    totalDeposited: d.totalDeposited,
    totalWithdrawn: d.totalWithdrawn,
    totalWon: d.totalWon,
    totalSpent: d.totalSpent,
  };
}

export async function deposit(amount: number, description?: string): Promise<TokenBalance> {
  const res = await apiPost<ApiResponse<BalanceResponse>>("/api/v1/wallet/deposit", {
    amount,
    description: description || "Deposit",
  });
  const d = res.data;
  if (!d) {
    throw new Error("Deposit failed");
  }
  return {
    userId: d.userId,
    balance: d.balance,
    totalDeposited: d.totalDeposited,
    totalWithdrawn: d.totalWithdrawn,
    totalWon: d.totalWon,
    totalSpent: d.totalSpent,
  };
}

export async function withdraw(amount: number, description?: string): Promise<TokenBalance> {
  const res = await apiPost<ApiResponse<BalanceResponse>>("/api/v1/wallet/withdraw", {
    amount,
    description: description || "Withdrawal",
  });
  const d = res.data;
  if (!d) {
    throw new Error("Withdrawal failed");
  }
  return {
    userId: d.userId,
    balance: d.balance,
    totalDeposited: d.totalDeposited,
    totalWithdrawn: d.totalWithdrawn,
    totalWon: d.totalWon,
    totalSpent: d.totalSpent,
  };
}

export async function getTransactions(offset = 0, limit = 50): Promise<{ transactions: Transaction[]; total: number }> {
  const res = await apiGet<{ success: boolean; data?: TransactionResponse[]; total?: number }>(
    `/api/v1/wallet/transactions?offset=${offset}&limit=${limit}`
  );
  const list = res.data ?? [];
  const total = res.total ?? list.length;
  const transactions: Transaction[] = list.map((t) => ({
    id: t.id,
    userId: t.userId,
    type: (typeMap[t.type] ?? t.type) as TransactionType,
    amount: t.amount,
    description: t.description,
    createdAt: new Date(t.createdAt),
    relatedBetId: t.relatedBetId,
    relatedUserId: t.relatedUserId,
  }));
  return { transactions, total };
}
