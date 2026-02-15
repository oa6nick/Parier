"use client";

import React from "react";
import { Lightbulb, Users, ArrowRight } from "lucide-react";
import { Bet } from "@/types";
import { useTranslations } from "next-intl";
import { Avatar } from "@/components/ui/Avatar";
import { RatingStars } from "@/components/ui/RatingStars";
import { Tag } from "@/components/ui/Tag";
import { useFormatter } from "next-intl";
import { Link } from "@/navigation";
import { cn } from "@/lib/utils";

interface SelectableBetCardProps {
  bet: Bet;
  href: string;
  mode?: "create" | "share";
}

export const SelectableBetCard: React.FC<SelectableBetCardProps> = ({
  bet,
  href,
  mode = "share",
}) => {
  const t = useTranslations("Pick");
  const tCard = useTranslations("BetCard");
  const format = useFormatter();

  return (
    <Link
      href={href}
      className={cn(
        "group block relative w-full bg-white rounded-3xl p-6 shadow-soft border border-gray-100",
        "transition-all duration-300 hover:shadow-glow hover:-translate-y-1 hover:border-primary/20",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-3xl"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Avatar src={bet.author.avatar} alt={bet.author.username} size="md" />
          <div className="min-w-0 flex-1">
            <span className="font-bold text-gray-900 truncate block">
              {bet.author.username}
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <RatingStars rating={bet.author.rating} size="sm" />
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider bg-secondary/10 px-1.5 py-0.5 rounded whitespace-nowrap">
                {bet.author.winRate}% {tCard("winRate")}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Tag
            label={bet.status === "open" ? tCard("active") : tCard("closed")}
            variant="status"
            status={bet.status}
          />
          <Tag
            label={bet.category.name}
            category={bet.category}
            variant="category"
          />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-lg font-bold text-gray-900 mb-3 leading-tight line-clamp-2 group-hover:text-primary transition-colors">
        {bet.title}
      </h2>

      {/* Outcome preview */}
      <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-3 mb-4">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700 line-clamp-2">{bet.outcome}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <div className="text-xs text-gray-400 font-medium">{tCard("pool")}</div>
          <div className="text-sm font-bold text-gray-900">
            {format.number(bet.betAmount)}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <div className="text-xs text-gray-400 font-medium">{tCard("odds")}</div>
          <div className="text-sm font-bold text-primary">{bet.coefficient}x</div>
        </div>
        <div className="bg-secondary/5 rounded-lg p-2 text-center border border-secondary/10">
          <div className="text-xs text-secondary-dark/70 font-medium">{tCard("potential")}</div>
          <div className="text-sm font-bold text-secondary-dark">
            {format.number(bet.potentialWinnings)}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Users className="w-3.5 h-3.5" />
          <span>{bet.betsCount} bets</span>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
          {mode === "create" ? t("useAsTemplate") : t("viewAndShare")}
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
};
