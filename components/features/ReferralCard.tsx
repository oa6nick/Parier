"use client";

import React, { useState, useEffect } from "react";
import { Users, Copy, Check, Gift, TrendingUp } from "lucide-react";
import { useTranslations, useFormatter } from "next-intl";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ReferralCardProps {
  referralCode: string;
  totalReferrals: number;
  totalEarnings: number;
  className?: string;
}

export const ReferralCard: React.FC<ReferralCardProps> = ({
  referralCode,
  totalReferrals,
  totalEarnings,
  className,
}) => {
  const t = useTranslations('Referral');
  const format = useFormatter();
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const referralLink = `${origin}/register?ref=${referralCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={cn("bg-gradient-to-br from-secondary/10 to-primary/10 rounded-3xl p-6 border border-secondary/20", className)}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
          <Users className="w-6 h-6 text-secondary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{t('title')}</h3>
          <p className="text-sm text-gray-500">{t('subtitle')}</p>
        </div>
      </div>

      {/* Referral Code */}
      <div className="bg-white rounded-xl p-4 mb-4 border border-gray-100">
        <label className="block text-xs font-medium text-gray-500 mb-2">
          {t('yourCode')}
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 font-mono font-bold text-gray-900">
            {referralCode}
          </div>
          <button
            onClick={handleCopy}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2",
              copied
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                {t('copied')}
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                {t('copy')}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Referral Link */}
      <div className="bg-white rounded-xl p-4 mb-6 border border-gray-100">
        <label className="block text-xs font-medium text-gray-500 mb-2">
          {t('referralLink')}
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600 truncate min-h-[38px] flex items-center">
            {origin ? referralLink : "Loading..."}
          </div>
          <button
            onClick={handleCopy}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={!origin}
          >
            <Copy className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">{t('totalReferrals')}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalReferrals}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-4 h-4 text-secondary" />
            <span className="text-xs text-gray-500">{t('totalEarnings')}</span>
          </div>
          <p className="text-2xl font-bold text-secondary">{format.number(totalEarnings)}</p>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">{t('howItWorks')}</p>
            <p className="text-blue-700">{t('howItWorksDesc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
