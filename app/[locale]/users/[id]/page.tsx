'use client';

import React, { useState, use } from 'react';
import {
    Calendar,
    MapPin,
    Trophy,
    Target,
    Award,
    DollarSign,
    TrendingUp,
    Check,
    ArrowLeft,
    MessageCircle,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { RatingStars } from '@/components/ui/RatingStars';
import { StatCard } from '@/components/ui/StatCard';
import { BetCard } from '@/components/features/BetCard';
import { users } from '@/lib/mockData/users';
import { getBetsSync } from '@/lib/mockData/bets';
import { getCategories } from '@/lib/mockData/categories';
import { findOrCreateConversation } from '@/lib/mockData/chat';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useTranslations, useFormatter, useLocale } from 'next-intl';
import { Link, useRouter } from '@/navigation';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function UserProfilePage({ params }: PageProps) {
    const { id } = use(params);
    const t = useTranslations('Profile');
    const tChat = useTranslations('Chat');
    const format = useFormatter();
    const locale = useLocale();
    const router = useRouter();
    const categories = getCategories(locale);
    const bets = getBetsSync(locale);
    const currentUser = users[0];

    const user = users.find((u) => u.id === id);

    if (!user) {
        notFound();
    }

    const userBets = bets.filter((bet) => bet.author.id === user.id);
    const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

    const filteredBets = userBets.filter((bet) => {
        if (activeTab === 'active') return bet.status === 'open';
        if (activeTab === 'completed') return bet.status === 'completed';
        return true;
    });

    const userStats = {
        activeBets: userBets.filter((b) => b.status === 'open').length,
        wonBets: userBets.filter((b) => b.status === 'completed').length,
        totalWinnings: user.earnings || 0,
        rating: user.rank || 0,
    };

    const userInterests = categories.filter((cat) => user.interests?.includes(cat.id));

    const handleStartChat = () => {
        // Find existing conversation or create new one
        const conversation = findOrCreateConversation(user.id);
        router.push(`/messages/${conversation.id}`);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
            </button>

            {/* Profile Header Card */}
            <div className="relative bg-white rounded-3xl p-8 shadow-soft border border-gray-100 mb-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/5 to-secondary/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-start gap-8">
                    <div className="relative">
                        <div className="p-1 bg-gradient-to-br from-primary to-secondary rounded-full">
                            <div className="p-1 bg-white rounded-full">
                                <Avatar src={user.avatar} alt={user.username} size="lg" className="w-32 h-32" />
                            </div>
                        </div>
                        {user.verified && (
                            <div className="absolute bottom-2 right-2 w-8 h-8 bg-blue-500 rounded-full border-4 border-white flex items-center justify-center shadow-md">
                                <Check className="w-4 h-4 text-white" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 w-full">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">{user.username}</h1>
                                <p className="text-gray-500 font-medium">
                                    {t('predictorLevel', { level: Math.floor((user.rating || 0) / 20) + 1 })} •{' '}
                                    {t('eliteAnalyst')}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                {user.id !== currentUser.id && (
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        className="rounded-full"
                                        onClick={handleStartChat}
                                    >
                                        <MessageCircle className="w-4 h-4 mr-2" /> {tChat('startChat')}
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 mb-6">
                            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 rounded-lg border border-yellow-100">
                                <RatingStars rating={user.rating} size="md" />
                                <span className="text-sm font-bold text-yellow-700 ml-1">{user.rating.toFixed(1)}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-lg border border-green-100">
                                <Trophy className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-bold text-green-700">
                                    {user.winRate}% {t('winRate')}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar className="w-4 h-4" />
                                <span>
                                    {t('joined', {
                                        date: new Date(user.joinedDate).toLocaleDateString(
                                            locale === 'ru' ? 'ru-RU' : 'en-US',
                                            { month: 'long', year: 'numeric' },
                                        ),
                                    })}
                                </span>
                            </div>
                            {user.location && (
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <MapPin className="w-4 h-4" />
                                    <span>{user.location}</span>
                                </div>
                            )}
                        </div>

                        {/* Interests */}
                        {userInterests.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {userInterests.map((interest) => (
                                    <span
                                        key={interest.id}
                                        className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200"
                                    >
                                        {interest.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <StatCard
                    icon={Target}
                    label={t('activePredictions')}
                    value={userStats.activeBets}
                    iconColor="text-blue-500"
                />
                <StatCard icon={Award} label={t('wins')} value={userStats.wonBets} iconColor="text-green-500" />
                <StatCard
                    icon={DollarSign}
                    label={t('totalEarnings')}
                    value={`$${userStats.totalWinnings}`}
                    iconColor="text-yellow-500"
                />
                <StatCard
                    icon={TrendingUp}
                    label={t('globalRank')}
                    value={`#${userStats.rating || '-'}`}
                    iconColor="text-purple-500"
                />
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-gray-100/50 rounded-xl mb-8 w-fit">
                {(['all', 'active', 'completed'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            'px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 capitalize',
                            activeTab === tab
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50',
                        )}
                    >
                        {t(`tabs.${tab}`)}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="space-y-6">
                {filteredBets.length > 0 ? (
                    filteredBets.map((bet) => <BetCard key={bet.id} bet={bet as any} onReload={() => {}} />)
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                            <Target className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{t('empty.title')}</h3>
                        <p className="text-gray-500">{t('empty.desc')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
