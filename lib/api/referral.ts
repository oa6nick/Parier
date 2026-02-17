import { apiGet } from "./client";

export type ReferralStats = {
  total_referrals: number;
  total_earnings: number;
  referrals: Array<{
    id: string;
    referred_id: string;
    referred_name?: string;
    created_at: string;
    earnings: number;
  }>;
};

export async function getReferralCode(): Promise<string> {
  const res = (await apiGet<{ code: string }>("/api/v1/referral/code")) as { code?: string };
  return res?.code ?? "";
}

export async function getReferralStats(): Promise<ReferralStats> {
  const res = await apiGet<ReferralStats>("/api/v1/referral/stats");
  return (
    res ?? {
      total_referrals: 0,
      total_earnings: 0,
      referrals: [],
    }
  );
}
