'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { ReferralCard } from '@/components/features/ReferralCard';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { getReferralStats as getReferralStatsMock, generateReferralCode } from '@/lib/mockData/referrals';
import { Send, Twitter, Facebook, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from '@/navigation';
import { useApi } from '@/api/context';
import { useSelector } from 'react-redux';
import { getSession } from '@/lib/store/Session';

function SharePageContent() {
    const t = useTranslations('Share');
    const api = useApi();
    const session = useSelector(getSession);
    const [referralCode, setReferralCode] = useState('');
    const [referralStats, setReferralStats] = useState({ totalReferrals: 0, totalEarnings: 0 });

    const fetchReferralData = useCallback(async () => {
        if (!session?.user_id) return;
        try {
            const [code, stats] = await Promise.all([
                api.ReferralApi.referralCodeGet().then((response) => response.data.code),
                api.ReferralApi.referralStatsGet().then((response) => response.data),
            ]);
            setReferralCode(code!);
            setReferralStats({ totalReferrals: stats.total_referrals!, totalEarnings: stats.total_earnings! });
        } catch {
            setReferralCode(generateReferralCode(session.user_id));
            setReferralStats(getReferralStatsMock(session.user_id));
        }
    }, [session?.user_id]);

    useEffect(() => {
        fetchReferralData();
    }, [fetchReferralData]);

    const displayReferralCode = referralCode || (session?.user_id ? generateReferralCode(session.user_id) : '');
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/profile/${session?.user_id ?? ''}` : '';
    const shareText = 'Join me on Pariall and bet on the future! Use my code: ' + displayReferralCode;

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
                <Link
                    href="/pick?mode=share"
                    className="block p-6 rounded-3xl border-2 border-gray-100 bg-white hover:border-primary/20 hover:shadow-soft transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Share2 className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-1">{t('shareBet')}</h3>
                            <p className="text-sm text-gray-500">{t('shareBetDesc')}</p>
                        </div>
                        <span className="text-primary font-medium group-hover:underline">→</span>
                    </div>
                </Link>

                <ReferralCard
                    referralCode={displayReferralCode}
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

export default function SharePage() {
    return (
        <RequireAuth>
            <SharePageContent />
        </RequireAuth>
    );
}
