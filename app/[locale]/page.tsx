"use client";

import React, { useState, useMemo } from "react";
import { Globe, TrendingUp } from "lucide-react";
import { BetCard } from "@/components/features/BetCard";
import { SearchBar } from "@/components/features/SearchBar";
import { FilterPanel, FilterState } from "@/components/features/FilterPanel";
import { getBets } from "@/lib/mockData/bets";
import { getCategories } from "@/lib/mockData/categories";
import { useTranslations, useLocale } from "next-intl";
import { Bet } from "@/types";
import { differenceInDays, isToday, isThisWeek, isThisMonth } from "date-fns";

export default function HomePage() {
  const t = useTranslations('Home');
  const locale = useLocale();
  const categories = getCategories(locale);
  const allBets = getBets(locale);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    status: null,
    location: null,
    minCoefficient: null,
    maxCoefficient: null,
    minPool: null,
    maxPool: null,
    dateRange: "all",
    sortBy: "date",
  });

  const filteredBets = useMemo(() => {
    let result: Bet[] = [...allBets];

    // Category filter (from buttons)
    if (selectedCategory) {
      result = result.filter((bet) => bet.category.id === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((bet) => {
        const titleMatch = bet.title.toLowerCase().includes(query);
        const descMatch = bet.shortDescription.toLowerCase().includes(query) ||
                         bet.fullDescription.toLowerCase().includes(query);
        const tagsMatch = bet.tags.some((tag) => tag.toLowerCase().includes(query));
        const authorMatch = bet.author.username.toLowerCase().includes(query);
        return titleMatch || descMatch || tagsMatch || authorMatch;
      });
    }

    // Status filter
    if (filters.status) {
      result = result.filter((bet) => bet.status === filters.status);
    }

    // Location filter
    if (filters.location) {
      const locationFilter = filters.location.toLowerCase();
      result = result.filter((bet) => 
        bet.location && bet.location.toLowerCase().includes(locationFilter)
      );
    }

    // Coefficient filter
    if (filters.minCoefficient !== null) {
      result = result.filter((bet) => bet.coefficient >= filters.minCoefficient!);
    }
    if (filters.maxCoefficient !== null) {
      result = result.filter((bet) => bet.coefficient <= filters.maxCoefficient!);
    }

    // Pool filter
    if (filters.minPool !== null) {
      result = result.filter((bet) => bet.betAmount >= filters.minPool!);
    }
    if (filters.maxPool !== null) {
      result = result.filter((bet) => bet.betAmount <= filters.maxPool!);
    }

    // Date range filter
    if (filters.dateRange !== "all") {
      result = result.filter((bet) => {
        const createdAt = bet.createdAt;
        switch (filters.dateRange) {
          case "today":
            return isToday(createdAt);
          case "week":
            return isThisWeek(createdAt);
          case "month":
            return isThisMonth(createdAt);
          default:
            return true;
        }
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "date":
          return b.createdAt.getTime() - a.createdAt.getTime();
        case "popularity":
          return (b.betsCount + b.likesCount + b.commentsCount) - 
                 (a.betsCount + a.likesCount + a.commentsCount);
        case "coefficient":
          return b.coefficient - a.coefficient;
        case "pool":
          return b.betAmount - a.betAmount;
        default:
          return 0;
      }
    });

    return result;
  }, [allBets, searchQuery, selectedCategory, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Hero Section */}
      <div className="relative mb-12">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
          {t('title_part1')} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{t('title_part2')}</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mb-8 leading-relaxed">
          {t('subtitle')}
        </p>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-gray-700">{t('globalMarket')}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
            <TrendingUp className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-gray-700">{t('activePredictions', {count: filteredBets.length})}</span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          <FilterPanel
            categories={categories}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar">
          <button
            onClick={() => {
              setSelectedCategory(null);
              setFilters({ ...filters, category: null });
            }}
            className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              selectedCategory === null
                ? "bg-gray-900 text-white shadow-lg"
                : "bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-gray-100"
            }`}
          >
            {t('all')}
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setFilters({ ...filters, category: category.id });
              }}
              className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-gray-900 text-white shadow-lg"
                  : "bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-gray-100"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Bets Grid */}
      {filteredBets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBets.map((bet) => (
            <BetCard key={bet.id} bet={bet} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <TrendingUp className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{t('noResults')}</h3>
          <p className="text-gray-500">{t('noResultsDesc')}</p>
        </div>
      )}
    </div>
  );
}
