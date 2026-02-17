'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Globe, TrendingUp, Sparkles } from 'lucide-react';
import { BetCard } from '@/components/features/BetCard';
import { useTranslations, useLocale } from 'next-intl';
import { useApi } from '@/api/context';
import { useQuery } from '@tanstack/react-query';
import { ParierServerInternalModelsBetResponse } from '@/api/client';

export default function HomePage() {
    const t = useTranslations('Home');
    const locale = useLocale();
    const api = useApi();
    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: () => api.ParierApi.parierCategoriesPost({ language: locale }),
    });
    const categories = useMemo(() => [...(categoriesData?.data?.data || [])], [categoriesData]);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const { data: betsData } = useQuery({
        queryKey: ['bets', selectedCategory],
        queryFn: () => api.ParierApi.parierBetPost({ language: locale, category_id: selectedCategory }),
    });
    const [filteredBets, setFilteredBets] = useState<ParierServerInternalModelsBetResponse[]>([]);
    useEffect(() => {
        setFilteredBets(betsData?.data?.data || []);
    }, [betsData]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-28">
            {/* Hero Section */}
            <div className="relative mb-12">
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
                    {t('title_part1')} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                        {t('title_part2')}
                    </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-500 max-w-2xl mb-8 leading-relaxed">{t('subtitle')}</p>

                <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
                        <Globe className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-gray-700">{t('globalMarket')}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
                        <TrendingUp className="w-4 h-4 text-secondary" />
                        <span className="text-sm font-medium text-gray-700">
                            {t('activePredictions', { count: filteredBets.length })}
                        </span>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar">
                    <button
                        onClick={() => setSelectedCategory(undefined)}
                        className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                            selectedCategory === undefined
                                ? 'bg-gray-900 text-white shadow-lg'
                                : 'bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-gray-100'
                        }`}
                    >
                        {t('all')}
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                                selectedCategory === category.id
                                    ? 'bg-gray-900 text-white shadow-lg'
                                    : 'bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-gray-100'
                            }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBets.map((bet) => (
                    <BetCard
                        key={bet.id}
                        bet={bet}
                        onReload={() => {
                            api.ParierApi.parierBetPost({
                                language: locale,
                                category_id: selectedCategory,
                                id: bet.id,
                            }).then((res) => {
                                if (res.data.success && res.data.data && res.data.data.length > 0) {
                                    setFilteredBets((prev) =>
                                        prev.map((b) => (b.id === bet.id ? res.data.data?.[0]! : b)),
                                    );
                                }
                            });
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
