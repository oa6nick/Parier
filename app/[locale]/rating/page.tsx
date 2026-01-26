"use client";

import React, { useState } from "react";
import { Trophy, Users, Eye, DollarSign, Zap, Crown, Medal, Award, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Avatar } from "@/components/ui/Avatar";
import { RatingStars } from "@/components/ui/RatingStars";
import { Check } from "lucide-react";
import { users } from "@/lib/mockData/users";
import { platformStats } from "@/lib/mockData/stats";
import { cn } from "@/lib/utils";
import { useTranslations, useFormatter } from "next-intl";

export default function RatingPage() {
  const t = useTranslations('Rating');
  const format = useFormatter();
  const [sortBy, setSortBy] = useState<"earnings" | "active">("earnings");
  
  const sortedUsers = [...users].sort((a, b) => {
    if (sortBy === "earnings") {
      return (b.earnings || 0) - (a.earnings || 0);
    }
    return b.totalBets - a.totalBets;
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-500/30 ring-4 ring-yellow-100">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -top-3 -right-3 animate-bounce">
            <span className="text-xl">👑</span>
          </div>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center shadow-lg shadow-gray-400/30 ring-4 ring-gray-100">
          <Medal className="w-5 h-5 text-white" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30 ring-4 ring-orange-100">
          <Award className="w-5 h-5 text-white" />
        </div>
      );
    }
    return (
      <span className="text-lg font-bold text-gray-400 font-mono w-8 text-center">#{rank}</span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-yellow-50 rounded-2xl mb-4">
          <Trophy className="w-10 h-10 text-yellow-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">{t('title')}</h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard
          icon={Users}
          label={t('totalPlayers')}
          value={platformStats.totalPlayers}
          iconColor="text-blue-500"
        />
        <StatCard
          icon={Eye}
          label={t('totalPredictions')}
          value={platformStats.totalBets}
          iconColor="text-green-500"
        />
        <StatCard
          icon={DollarSign}
          label={t('totalPrizePool')}
          value={`$${platformStats.totalPrizePool}`}
          iconColor="text-yellow-500"
        />
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            {t('globalRankings')}
          </h2>
          <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm w-full md:w-auto">
            <button
              onClick={() => setSortBy("earnings")}
              className={cn(
                "flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2",
                sortBy === "earnings"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <DollarSign className="w-4 h-4" />
              {t('topEarnings')}
            </button>
            <button
              onClick={() => setSortBy("active")}
              className={cn(
                "flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2",
                sortBy === "active"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <Zap className="w-4 h-4" />
              {t('mostActive')}
            </button>
          </div>
        </div>
        
        {/* List */}
        <div className="divide-y divide-gray-100">
          {sortedUsers.map((user, index) => (
            <div
              key={user.id}
              className="p-5 hover:bg-gray-50 transition-colors flex items-center gap-4 md:gap-6 group"
            >
              {/* Rank */}
              <div className="w-12 flex justify-center flex-shrink-0">
                {getRankIcon(user.rank || index + 1)}
              </div>

              {/* Avatar */}
              <div className="relative">
                <Avatar src={user.avatar} alt={user.username} size="md" className="w-12 h-12" />
                {user.rank && user.rank <= 3 && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm text-xs">
                    🔥
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900 truncate">{user.username}</span>
                  {user.verified && (
                    <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <RatingStars rating={user.rating} size="sm" />
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {user.winRate}% {t('winRate')}
                  </span>
                </div>
              </div>

              {/* Earnings */}
              <div className="text-right">
                <div className="text-sm font-bold text-green-600 mb-0.5">
                  +${format.number(user.earnings || 0)}
                </div>
                <div className="text-xs text-gray-400 font-medium">
                  {t('totalEarned')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
