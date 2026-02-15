"use client";

import React, { useState } from "react";
import { Filter, X, ChevronDown, ChevronUp, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Category, BetStatus } from "@/types";
import { cn } from "@/lib/utils";

export type SortOption = "date" | "popularity" | "coefficient" | "pool";

export interface FilterState {
  category: string | null;
  status: BetStatus | null;
  minCoefficient: number | null;
  maxCoefficient: number | null;
  minPool: number | null;
  maxPool: number | null;
  dateRange: "all" | "today" | "week" | "month";
  location: string | null;
  sortBy: SortOption;
}

interface FilterPanelProps {
  categories: Category[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  categories,
  filters,
  onFiltersChange,
  className,
}) => {
  const t = useTranslations('Filters');
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      category: null,
      status: null,
      minCoefficient: null,
      maxCoefficient: null,
      minPool: null,
      maxPool: null,
      dateRange: "all",
      location: null,
      sortBy: "date",
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const hasActiveFilters = 
    localFilters.category !== null ||
    localFilters.status !== null ||
    localFilters.minCoefficient !== null ||
    localFilters.maxCoefficient !== null ||
    localFilters.minPool !== null ||
    localFilters.maxPool !== null ||
    localFilters.dateRange !== "all" ||
    (localFilters.location !== null && localFilters.location !== "");

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2 bg-white hover:bg-gray-50 border-gray-200 text-gray-600 h-9 rounded-full px-4 text-sm font-medium shadow-sm transition-all border"
      >
        <Filter className="w-3.5 h-3.5" />
        {t('filters')}
        {hasActiveFilters && (
          <span className="w-1.5 h-1.5 bg-primary rounded-full" />
        )}
        {isOpen ? (
          <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
        )}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 md:bg-transparent"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-[min(calc(100vw-2rem),384px)] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50 max-h-[80vh] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">{t('filters')}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Status Filter */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                {t('status')}
              </label>
              <div className="flex flex-wrap gap-2">
                {(["open", "closed", "completed"] as BetStatus[]).map((status) => {
                  const isActive = localFilters.status === status;
                  return (
                    <button
                      key={status}
                      onClick={() => updateFilter("status", isActive ? null : status)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                        isActive
                          ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      {t(`statuses.${status}`)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location Filter */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                {t('location')}
              </label>
              <Input
                placeholder={t('locationPlaceholder')}
                value={localFilters.location || ""}
                onChange={(e) => updateFilter("location", e.target.value || null)}
                className="w-full"
              />
            </div>

            {/* Coefficient Range */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                {t('coefficient')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">{t('min')}</span>
                  <Input
                    type="number"
                    value={localFilters.minCoefficient || ""}
                    onChange={(e) => updateFilter("minCoefficient", e.target.value ? parseFloat(e.target.value) : null)}
                    className="pl-10 h-11"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">{t('max')}</span>
                  <Input
                    type="number"
                    value={localFilters.maxCoefficient || ""}
                    onChange={(e) => updateFilter("maxCoefficient", e.target.value ? parseFloat(e.target.value) : null)}
                    className="pl-10 h-11"
                  />
                </div>
              </div>
            </div>

            {/* Pool Range */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                {t('pool')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">{t('min')}</span>
                  <Input
                    type="number"
                    value={localFilters.minPool || ""}
                    onChange={(e) => updateFilter("minPool", e.target.value ? parseFloat(e.target.value) : null)}
                    className="pl-10 h-11"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">{t('max')}</span>
                  <Input
                    type="number"
                    value={localFilters.maxPool || ""}
                    onChange={(e) => updateFilter("maxPool", e.target.value ? parseFloat(e.target.value) : null)}
                    className="pl-10 h-11"
                  />
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                {t('dateRange')}
              </label>
              <div className="flex flex-wrap gap-2">
                {(["all", "today", "week", "month"] as const).map((range) => {
                  const isActive = localFilters.dateRange === range;
                  return (
                    <button
                      key={range}
                      onClick={() => updateFilter("dateRange", range)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                        isActive
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      {t(`dateRanges.${range}`)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                {t('sortBy')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["date", "popularity", "coefficient", "pool"] as SortOption[]).map((option) => {
                  const isActive = localFilters.sortBy === option;
                  return (
                    <button
                      key={option}
                      onClick={() => updateFilter("sortBy", option)}
                      className={cn(
                        "flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all border text-left",
                        isActive
                          ? "bg-primary/5 text-primary border-primary/20"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      {t(`sortOptions.${option}`)}
                      {isActive && <Check className="w-4 h-4 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reset Button */}
            <div className="pt-6 border-t border-gray-100">
              <Button
                variant={hasActiveFilters ? "secondary" : "ghost"}
                onClick={resetFilters}
                className="w-full"
                disabled={!hasActiveFilters}
              >
                {t('reset')}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
