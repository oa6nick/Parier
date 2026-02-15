import { Referral } from "@/types";
import { users } from "./users";

export const referrals: Referral[] = [
  {
    id: "r1",
    referrerId: "1",
    referredId: "2",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    totalEarnings: 700,
  },
  {
    id: "r2",
    referrerId: "1",
    referredId: "3",
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    totalEarnings: 450,
  },
  {
    id: "r3",
    referrerId: "1",
    referredId: "4",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    totalEarnings: 300,
  },
];

export const getReferrals = (userId: string): Referral[] => {
  return referrals.filter((r) => r.referrerId === userId);
};

export const getReferralStats = (userId: string) => {
  const userReferrals = getReferrals(userId);
  const totalEarnings = userReferrals.reduce((sum, r) => sum + r.totalEarnings, 0);
  
  return {
    totalReferrals: userReferrals.length,
    totalEarnings,
    referrals: userReferrals.map((r) => {
      const referredUser = users.find((u) => u.id === r.referredId);
      return {
        ...r,
        referredUser,
      };
    }),
  };
};

export const generateReferralCode = (userId: string): string => {
  const user = users.find((u) => u.id === userId);
  if (!user) return "";
  
  const code = user.username.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
  return code + Math.random().toString(36).substring(2, 6).toUpperCase();
};
