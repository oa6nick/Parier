import { Transaction, TokenBalance } from "@/types";
import { users } from "./users";

const currentUser = users[0];

export const tokenBalances: Record<string, TokenBalance> = {
  "1": {
    userId: "1",
    balance: 12500,
    totalDeposited: 20000,
    totalWithdrawn: 3000,
    totalWon: 8500,
    totalSpent: 13000,
  },
  "2": {
    userId: "2",
    balance: 35000,
    totalDeposited: 50000,
    totalWithdrawn: 10000,
    totalWon: 25000,
    totalSpent: 30000,
  },
  "3": {
    userId: "3",
    balance: 18000,
    totalDeposited: 25000,
    totalWithdrawn: 5000,
    totalWon: 15000,
    totalSpent: 17000,
  },
};

export const transactions: Transaction[] = [
  {
    id: "t1",
    userId: "1",
    type: "deposit",
    amount: 5000,
    description: "Deposit via card",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: "t2",
    userId: "1",
    type: "deposit",
    amount: 10000,
    description: "Deposit via card",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
  },
  {
    id: "t3",
    userId: "1",
    type: "deposit",
    amount: 5000,
    description: "Deposit via card",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: "t4",
    userId: "1",
    type: "bet",
    amount: -500,
    description: "Bet on 'Bitcoin to hit $100k'",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    relatedBetId: "1",
  },
  {
    id: "t5",
    userId: "1",
    type: "bet",
    amount: -1000,
    description: "Bet on 'Dune 2 box office'",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    relatedBetId: "2",
  },
  {
    id: "t6",
    userId: "1",
    type: "win",
    amount: 3200,
    description: "Won bet 'Bitcoin to hit $100k'",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    relatedBetId: "1",
  },
  {
    id: "t7",
    userId: "1",
    type: "referral_bonus",
    amount: 500,
    description: "Referral bonus for CryptoWhale",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    relatedUserId: "2",
  },
  {
    id: "t8",
    userId: "1",
    type: "referral_earnings",
    amount: 200,
    description: "Earnings from referral bets",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    relatedUserId: "2",
  },
  {
    id: "t9",
    userId: "1",
    type: "withdrawal",
    amount: -3000,
    description: "Withdrawal to card",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "t10",
    userId: "1",
    type: "bet",
    amount: -800,
    description: "Bet on 'S&P 500 prediction'",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    relatedBetId: "3",
  },
];

export const getTokenBalance = (userId: string): TokenBalance => {
  return tokenBalances[userId] || {
    userId,
    balance: 0,
    totalDeposited: 0,
    totalWithdrawn: 0,
    totalWon: 0,
    totalSpent: 0,
  };
};

export const getTransactions = (userId: string): Transaction[] => {
  return transactions
    .filter((t) => t.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const addTransaction = (transaction: Transaction): void => {
  transactions.unshift(transaction);
  let balance = tokenBalances[transaction.userId];
  if (!balance) {
    balance = {
      userId: transaction.userId,
      balance: 0,
      totalDeposited: 0,
      totalWithdrawn: 0,
      totalWon: 0,
      totalSpent: 0,
    };
    tokenBalances[transaction.userId] = balance;
  }
  balance.balance += transaction.amount;
  if (transaction.type === "deposit" || transaction.type === "admin_credit") {
    balance.totalDeposited += transaction.amount;
  } else if (transaction.type === "withdrawal") {
    balance.totalWithdrawn += Math.abs(transaction.amount);
  } else if (transaction.type === "win" || transaction.type === "referral_bonus" || transaction.type === "referral_earnings") {
    balance.totalWon += transaction.amount;
  } else if (transaction.type === "bet") {
    balance.totalSpent += Math.abs(transaction.amount);
  }
};

export const creditTokens = (
  userId: string,
  amount: number,
  description: string = "Admin credit"
): number => {
  if (amount <= 0) return getTokenBalance(userId).balance;
  addTransaction({
    id: `t${Date.now()}`,
    userId,
    type: "admin_credit",
    amount,
    description,
    createdAt: new Date(),
  });
  return getTokenBalance(userId).balance;
};
