"use client";

import React, { useState } from "react";
import { Calendar, MapPin, Trophy, Target, Award, DollarSign, TrendingUp, Check, Settings, Share2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { RatingStars } from "@/components/ui/RatingStars";
import { StatCard } from "@/components/ui/StatCard";
import { BetCard } from "@/components/features/BetCard";
import { users } from "@/lib/mockData/users";
import { getBets } from "@/lib/mockData/bets";
import { getCategories } from "@/lib/mockData/categories";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useTranslations, useFormatter, useLocale } from "next-intl";

export default function ProfilePage() {
  const t = useTranslations('Profile');
  const format = useFormatter();
  const locale = useLocale();
  const categories = getCategories(locale);
  const bets = getBets(locale);
  const currentUser = users[0]; // "You"
  const userBets = bets.filter((bet) => bet.author.id === currentUser.id);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">("all");

  const filteredBets = userBets.filter((bet) => {
    if (activeTab === "active") return bet.status === "open";
    if (activeTab === "completed") return bet.status === "completed";
    return true;
  });

  const userStats = {
    activeBets: userBets.filter((b) => b.status === "open").length,
    wonBets: userBets.filter((b) => b.status === "completed").length,
    totalWinnings: 0,
    rating: currentUser.rank || 0,
  };

  const userInterests = categories.filter((cat) =>
    currentUser.interests?.includes(cat.id)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Profile Header Card */}
      <div className="relative bg-white rounded-3xl p-8 shadow-soft border border-gray-100 mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/5 to-secondary/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start gap-8">
          <div className="relative">
            <div className="p-1 bg-gradient-to-br from-primary to-secondary rounded-full">
              <div className="p-1 bg-white rounded-full">
                <Avatar src={currentUser.avatar} alt={currentUser.username} size="lg" className="w-32 h-32" />
              </div>
            </div>
            {currentUser.verified && (
              <div className="absolute bottom-2 right-2 w-8 h-8 bg-blue-500 rounded-full border-4 border-white flex items-center justify-center shadow-md">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{currentUser.username}</h1>
                <p className="text-gray-500 font-medium">{t('predictorLevel', {level: 5})} • {t('eliteAnalyst')}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="rounded-full">
                  <Share2 className="w-4 h-4 mr-2" /> {t('share')}
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Settings className="w-5 h-5 text-gray-400" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 rounded-lg border border-yellow-100">
                <RatingStars rating={currentUser.rating} size="md" />
                <span className="text-sm font-bold text-yellow-700 ml-1">4.8</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-lg border border-green-100">
                <Trophy className="w-4 h-4 text-green-600" />
                <span className="text-sm font-bold text-green-700">{currentUser.winRate}% {t('winRate')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{t('joined', {date: 'July 2025'})}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>{t('location')}</span>
              </div>
            </div>

            {/* Interests */}
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
        <StatCard
          icon={Award}
          label={t('wins')}
          value={userStats.wonBets}
          iconColor="text-green-500"
        />
        <StatCard
          icon={DollarSign}
          label={t('totalEarnings')}
          value={`$${userStats.totalWinnings}`}
          iconColor="text-yellow-500"
        />
        <StatCard
          icon={TrendingUp}
          label={t('globalRank')}
          value={`#${userStats.rating || "-"}`}
          iconColor="text-purple-500"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100/50 rounded-xl mb-8 w-fit">
        {(["all", "active", "completed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 capitalize",
              activeTab === tab
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
            )}
          >
            {t(`tabs.${tab}`)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {filteredBets.length > 0 ? (
          filteredBets.map((bet) => <BetCard key={bet.id} bet={bet} />)
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <Target className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{t('empty.title')}</h3>
            <p className="text-gray-500 mb-6">{t('empty.desc')}</p>
            <Button>{t('empty.create')}</Button>
          </div>
        )}
      </div>
    </div>
  );
}
