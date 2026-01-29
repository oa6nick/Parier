"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ReferralCard } from "@/components/features/ReferralCard";
import { users } from "@/lib/mockData/users";
import { getReferralStats, generateReferralCode } from "@/lib/mockData/referrals";
import { Send, Twitter, Facebook, Link2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SharePage() {
  const t = useTranslations('Share');
  const currentUser = users[0];
  const referralCode = currentUser.referralCode || generateReferralCode(currentUser.id);
  const referralStats = getReferralStats(currentUser.id);
  
  // In a real app, this would be the actual profile URL
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/profile/${currentUser.id}` : '';
  const shareText = "Join me on Parier and bet on the future! Use my code: " + referralCode;

  const handleShare = (platform: 'telegram' | 'twitter' | 'facebook') => {
    let url = '';
    switch (platform) {
      case 'telegram':
        url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
    }
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
        <p className="text-gray-500">{t('subtitle')}</p>
      </div>

      <div className="space-y-6">
        <ReferralCard
          referralCode={referralCode}
          totalReferrals={referralStats.totalReferrals}
          totalEarnings={referralStats.totalEarnings}
          className="shadow-soft"
        />

        <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t('shareOn')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="w-full flex flex-col items-center justify-center gap-2 h-24 hover:bg-[#0088cc]/5 hover:border-[#0088cc]/20 hover:text-[#0088cc]"
              onClick={() => handleShare('telegram')}
            >
              <Send className="w-8 h-8" />
              <span>Telegram</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full flex flex-col items-center justify-center gap-2 h-24 hover:bg-[#1DA1F2]/5 hover:border-[#1DA1F2]/20 hover:text-[#1DA1F2]"
              onClick={() => handleShare('twitter')}
            >
              <Twitter className="w-8 h-8" />
              <span>Twitter</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full flex flex-col items-center justify-center gap-2 h-24 hover:bg-[#4267B2]/5 hover:border-[#4267B2]/20 hover:text-[#4267B2]"
              onClick={() => handleShare('facebook')}
            >
              <Facebook className="w-8 h-8" />
              <span>Facebook</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
