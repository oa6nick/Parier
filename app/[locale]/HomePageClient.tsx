'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { TrendingUp, Plus, ArrowRight, Search } from 'lucide-react';
import { BetCard } from '@/components/features/BetCard';
import { FilterPanel, FilterState } from '@/components/features/FilterPanel';
import { getBetsSync } from '@/lib/mockData/bets';
import { getCategories } from '@/lib/mockData/categories';
import { useTranslations, useLocale } from 'next-intl';
import { Bet, BetStatus } from '@/types';
import { isToday, isThisWeek, isThisMonth } from 'date-fns';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter, usePathname } from '@/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

function HomePageContent() {
    const t = useTranslations('Home');
    const locale = useLocale();
    const categories = getCategories(locale);
    const allBets = getBetsSync(locale);
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('q') || '';
    const selectedCategory = searchParams.get('category');

    // Quick Bet State
    const [quickBetForm, setQuickBetForm] = useState({
        title: '',
        betAmount: '',
        coefficient: '',
    });

    const [formErrors, setFormErrors] = useState<{
        title?: string;
        betAmount?: string;
        coefficient?: string;
    }>({});

    const handleQuickBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setQuickBetForm((prev) => ({ ...prev, [name]: value }));
        if (formErrors[name as keyof typeof formErrors]) {
            setFormErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleQuickBetSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            router.push('/register');
            return;
        }
        const errors: typeof formErrors = {};
        if (!quickBetForm.title.trim()) errors.title = t('createBetForm.errors.titleRequired');
        if (!quickBetForm.betAmount || parseFloat(quickBetForm.betAmount) <= 0)
            errors.betAmount = t('createBetForm.errors.poolAmountPositive');
        if (!quickBetForm.coefficient || parseFloat(quickBetForm.coefficient) <= 1)
            errors.coefficient = t('createBetForm.errors.coefficientInvalid');
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        const params = new URLSearchParams({
            title: quickBetForm.title,
            betAmount: quickBetForm.betAmount,
            coefficient: quickBetForm.coefficient,
        });
        router.push(`/create?${params.toString()}`);
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const query = formData.get('search') as string;

        const params = new URLSearchParams(searchParams.toString());
        if (query) {
            params.set('q', query);
        } else {
            params.delete('q');
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
        scrollToGrid();
    };

    const filters: FilterState = {
        category: selectedCategory,
        status: (searchParams.get('status') as BetStatus) || null,
        minCoefficient: searchParams.get('minCoefficient') ? Number(searchParams.get('minCoefficient')) : null,
        maxCoefficient: searchParams.get('maxCoefficient') ? Number(searchParams.get('maxCoefficient')) : null,
        minPool: searchParams.get('minPool') ? Number(searchParams.get('minPool')) : null,
        maxPool: searchParams.get('maxPool') ? Number(searchParams.get('maxPool')) : null,
        dateRange: (searchParams.get('dateRange') as FilterState['dateRange']) || 'all',
        location: searchParams.get('location'),
        sortBy: (searchParams.get('sortBy') as FilterState['sortBy']) || 'date',
    };

    const handleFiltersChange = (newFilters: FilterState) => {
        const params = new URLSearchParams(searchParams.toString());
        const setOrDelete = (key: string, val: string | number | null | undefined) => {
            if (val != null && val !== '' && val !== 'all') params.set(key, String(val));
            else params.delete(key);
        };
        setOrDelete('category', newFilters.category);
        setOrDelete('status', newFilters.status);
        setOrDelete('minCoefficient', newFilters.minCoefficient);
        setOrDelete('maxCoefficient', newFilters.maxCoefficient);
        setOrDelete('minPool', newFilters.minPool);
        setOrDelete('maxPool', newFilters.maxPool);
        setOrDelete('dateRange', newFilters.dateRange);
        setOrDelete('location', newFilters.location);
        setOrDelete('sortBy', newFilters.sortBy);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
        scrollToGrid();
    };

    const handleCategoryClick = (categoryId: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (categoryId) params.set('category', categoryId);
        else params.delete('category');
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
        scrollToGrid();
    };

    const scrollToGrid = () => {
        // Scroll to grid function
        const element = document.getElementById('bets-grid');
        if (element) {
            const yOffset = -120;
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    // Filtering Logic
    const filteredBets = useMemo(() => {
        let result: Bet[] = [...allBets];

        // Filters from URL
        const status = searchParams.get('status') as BetStatus;
        const dateRange = searchParams.get('dateRange');
        const sortBy = searchParams.get('sortBy') || 'date';
        const minCoefficient = searchParams.get('minCoefficient') ? Number(searchParams.get('minCoefficient')) : null;
        const maxCoefficient = searchParams.get('maxCoefficient') ? Number(searchParams.get('maxCoefficient')) : null;
        const minPool = searchParams.get('minPool') ? Number(searchParams.get('minPool')) : null;
        const maxPool = searchParams.get('maxPool') ? Number(searchParams.get('maxPool')) : null;
        const location = searchParams.get('location');

        if (selectedCategory) result = result.filter((bet) => bet.category.id === selectedCategory);

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter((bet) => {
                const titleMatch = bet.title.toLowerCase().includes(query);
                const descMatch = bet.shortDescription.toLowerCase().includes(query);
                const tagsMatch = bet.tags.some((tag) => tag.toLowerCase().includes(query));
                return titleMatch || descMatch || tagsMatch;
            });
        }

        if (status) result = result.filter((bet) => bet.status === status);
        if (minCoefficient != null) result = result.filter((bet) => bet.coefficient >= minCoefficient);
        if (maxCoefficient != null) result = result.filter((bet) => bet.coefficient <= maxCoefficient);
        if (minPool != null) result = result.filter((bet) => bet.betAmount >= minPool);
        if (maxPool != null) result = result.filter((bet) => bet.betAmount <= maxPool);
        if (location?.trim()) {
            const loc = location.toLowerCase();
            result = result.filter((bet) => bet.location?.toLowerCase().includes(loc));
        }

        if (dateRange) {
            result = result.filter((bet) => {
                const createdAt = bet.createdAt;
                switch (dateRange) {
                    case 'today':
                        return isToday(createdAt);
                    case 'week':
                        return isThisWeek(createdAt);
                    case 'month':
                        return isThisMonth(createdAt);
                    default:
                        return true;
                }
            });
        }

        result.sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return b.createdAt.getTime() - a.createdAt.getTime();
                case 'popularity':
                    return b.betsCount + b.likesCount - (a.betsCount + a.likesCount);
                case 'coefficient':
                    return b.coefficient - a.coefficient;
                case 'pool':
                    return b.betAmount - a.betAmount;
                default:
                    return 0;
            }
        });

        return result;
    }, [allBets, searchQuery, selectedCategory, searchParams]);

    return (
        <div className="min-h-screen bg-gray-50/50 relative selection:bg-primary/20">
            <div className="absolute inset-0 -z-10 h-[600px] w-full bg-gradient-to-b from-gray-50 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                {/* Hero Section */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center mb-20">
                    {/* Left Column: Content + Search */}
                    <div className="lg:col-span-7 space-y-6 relative z-10">
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-gray-900 leading-[1.05]">
                            {t('title_part1')}{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-600 to-secondary">
                                {t('title_part2')}
                            </span>
                        </h1>

                        <p className="text-lg text-gray-600 max-w-lg leading-relaxed">{t('subtitle')}</p>

                        {/* Hero Search */}
                        <form onSubmit={handleSearch} className="max-w-xl">
                            <div className="flex items-center bg-white rounded-xl border border-gray-200 shadow-sm p-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all">
                                <Search className="w-5 h-5 text-gray-400 ml-3" />
                                <input
                                    name="search"
                                    defaultValue={searchQuery}
                                    placeholder="Search predictions..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-base text-gray-900 placeholder:text-gray-400 h-11 px-3"
                                />
                                <Button type="submit" size="sm" className="rounded-lg px-5 h-10 font-medium">
                                    Search
                                </Button>
                            </div>
                        </form>

                        {/* Categories + Filters */}
                        <div className="flex flex-wrap items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                            <FilterPanel
                                categories={categories}
                                filters={filters}
                                onFiltersChange={handleFiltersChange}
                                className="flex-shrink-0"
                            />
                            <div className="h-5 w-px bg-gray-200 hidden sm:block flex-shrink-0" />
                            <button
                                onClick={() => handleCategoryClick(null)}
                                className={cn(
                                    'px-4 py-2 min-h-[44px] rounded-full text-sm font-medium transition-all duration-200 border flex-shrink-0',
                                    selectedCategory === null
                                        ? 'bg-gray-900 text-white border-gray-900'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                                )}
                            >
                                All
                            </button>
                            {categories.slice(0, 5).map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category.id)}
                                    className={cn(
                                        'px-4 py-2 min-h-[44px] rounded-full text-sm font-medium transition-all duration-200 border flex-shrink-0',
                                        selectedCategory === category.id
                                            ? 'bg-gray-900 text-white border-gray-900'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                                    )}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Quick Bet Card */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-lg">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">{t('createBetForm.title')}</h2>
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <Plus className="w-5 h-5" />
                                </div>
                            </div>

                            {!isAuthenticated && (
                                <p className="mb-5 text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
                                    {t('createBetForm.registerPrompt')}
                                </p>
                            )}

                            <form onSubmit={handleQuickBetSubmit} className="space-y-6" noValidate>
                                <Input
                                    label={t('createBetForm.titlePlaceholder')}
                                    name="title"
                                    value={quickBetForm.title}
                                    onChange={handleQuickBetChange}
                                    placeholder="e.g. Bitcoin hits $100k..."
                                    disabled={!isAuthenticated}
                                    error={formErrors.title}
                                    className="h-11 rounded-lg"
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label={t('createBetForm.poolAmount')}
                                        name="betAmount"
                                        type="number"
                                        value={quickBetForm.betAmount}
                                        onChange={handleQuickBetChange}
                                        placeholder="1000"
                                        disabled={!isAuthenticated}
                                        error={formErrors.betAmount}
                                        className="h-11 rounded-lg"
                                    />
                                    <Input
                                        label={t('createBetForm.coefficient')}
                                        name="coefficient"
                                        type="number"
                                        step="0.1"
                                        value={quickBetForm.coefficient}
                                        onChange={handleQuickBetChange}
                                        placeholder="2.5"
                                        disabled={!isAuthenticated}
                                        error={formErrors.coefficient}
                                        className="h-11 rounded-lg"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full h-11 rounded-lg font-semibold"
                                >
                                    {isAuthenticated
                                        ? t('createBetForm.createButton')
                                        : t('createBetForm.registerButton')}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </form>
                        </div>
                    </div>
                </section>

                {/* Bets Grid Header */}
                <div id="bets-grid" className="flex items-center justify-between mb-8 scroll-mt-32">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-gray-900">Trending Bets</h2>
                        <div className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-bold uppercase tracking-wide">
                            Live
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 font-medium">Sort by:</span>
                        <select
                            className="bg-white border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 font-medium cursor-pointer"
                            onChange={(e) => {
                                const params = new URLSearchParams(searchParams.toString());
                                params.set('sortBy', e.target.value);
                                router.push(`${pathname}?${params.toString()}`, { scroll: false });
                            }}
                            defaultValue={searchParams.get('sortBy') || 'date'}
                        >
                            <option value="date">Newest</option>
                            <option value="popularity">Popular</option>
                            <option value="coefficient">High Odds</option>
                            <option value="pool">Large Pool</option>
                        </select>
                    </div>
                </div>

                {/* Bets Grid */}
                <div className="min-h-[400px]">
                    {filteredBets.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredBets.map((bet) => (
                                <BetCard key={bet.id} bet={bet as any} onReload={() => {}} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center shadow-sm mb-6 border border-gray-100">
                                <TrendingUp className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No bets found</h3>
                            <p className="text-gray-500 text-lg">Try adjusting your search or filters</p>
                            <Button
                                variant="outline"
                                className="mt-6 rounded-full"
                                onClick={() => {
                                    router.push(pathname);
                                    setQuickBetForm({ title: '', betAmount: '', coefficient: '' });
                                }}
                            >
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function HomePageSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="h-8 bg-gray-200 rounded-full w-48 animate-pulse" />
                        <div className="h-20 bg-gray-200 rounded-xl w-full animate-pulse" />
                        <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse" />
                        <div className="h-16 bg-gray-200 rounded-2xl w-full mt-8 animate-pulse" />
                    </div>
                    <div className="lg:col-span-5">
                        <div className="h-[500px] bg-gray-200 rounded-[2rem] animate-pulse" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-96 bg-gray-200 rounded-3xl animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function HomePageClient() {
    return (
        <Suspense fallback={<HomePageSkeleton />}>
            <HomePageContent />
        </Suspense>
    );
}
