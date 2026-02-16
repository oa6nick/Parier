"use client";

import React, { useState } from 'react';
import { Bet } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Tag } from '@/components/ui/Tag';
import { format, formatDistanceToNow } from 'date-fns';
import { Calendar, Clock, Trophy, Share2, Check, TrendingUp, Users, Wallet } from 'lucide-react';
import { useTranslations, useFormatter } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface BetHeaderProps {
  bet: Bet;
}

export const BetHeader: React.FC<BetHeaderProps> = ({ bet }) => {
  const t = useTranslations('BetCard');
  const fmt = useFormatter();
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: bet.title,
      text: t('shareText', {
        title: bet.title,
        outcome: bet.outcome,
        coefficient: bet.coefficient
      }),
      url: window.location.origin + `/bet/${bet.id}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Error copying to clipboard:', err);
      }
    }
  };

  const timeRemaining = bet.eventDate 
    ? formatDistanceToNow(bet.eventDate, { addSuffix: true })
    : 'N/A';

  return (
    <div className="relative overflow-hidden bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      {/* Background Gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/3" />
      
      {/* Top Row: Author & Actions */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
             <Avatar src={bet.author.avatar} alt={bet.author.username} size="md" />
             {bet.author.verified && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                   <Check className="w-3 h-3 text-blue-500 bg-blue-50 rounded-full p-0.5" />
                </div>
             )}
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">Created by</div>
            <div className="font-bold text-gray-900 flex items-center gap-1">
               {bet.author.username}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <div className="hidden sm:flex gap-2">
             <Tag label={bet.status} variant="status" status={bet.status} />
             <Tag label={bet.category.name} category={bet.category} variant="category" />
           </div>
          
          <Button 
            variant="secondary" 
            size="sm" 
            className="rounded-full flex items-center gap-2 ml-2 hover:bg-gray-100 border-gray-200"
            onClick={handleShare}
            title={t('share')}
          >
            <div className="relative w-4 h-4">
              <div className={cn(
                "absolute inset-0 flex items-center justify-center transition-all duration-200",
                isCopied ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50"
              )}>
                <Check className="w-4 h-4 text-green-500" />
              </div>
              <div className={cn(
                "absolute inset-0 flex items-center justify-center transition-all duration-200",
                isCopied ? "opacity-0 -rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
              )}>
                <Share2 className="w-4 h-4 text-gray-500" />
              </div>
            </div>
            <span className="hidden sm:inline text-gray-600 font-medium">Share</span>
          </Button>
        </div>
      </div>
       
       <div className="sm:hidden flex gap-2 mb-4">
          <Tag label={bet.status} variant="status" status={bet.status} />
          <Tag label={bet.category.name} category={bet.category} variant="category" />
       </div>

      {/* Hero Title */}
      <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
        {bet.title}
      </h1>
      
      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-100">
           <div className="flex items-center gap-2 text-gray-500 mb-1">
             <Trophy className="w-4 h-4" />
             <span className="text-xs font-medium uppercase tracking-wide">Outcome</span>
           </div>
           <div className="text-lg font-bold text-gray-900 line-clamp-1" title={bet.outcome}>
             {bet.outcome}
           </div>
        </div>

        <div className="bg-primary/5 backdrop-blur-sm rounded-2xl p-4 border border-primary/10">
           <div className="flex items-center gap-2 text-primary/70 mb-1">
             <TrendingUp className="w-4 h-4" />
             <span className="text-xs font-medium uppercase tracking-wide">Odds</span>
           </div>
           <div className="text-2xl font-bold text-primary">
             {bet.coefficient}x
           </div>
        </div>

        <div className="bg-secondary/5 backdrop-blur-sm rounded-2xl p-4 border border-secondary/10">
           <div className="flex items-center gap-2 text-secondary-dark/70 mb-1">
             <Wallet className="w-4 h-4" />
             <span className="text-xs font-medium uppercase tracking-wide">Pool</span>
           </div>
           <div className="text-lg font-bold text-secondary-dark">
             {fmt.number(bet.betAmount)} <span className="text-sm font-normal">PAR</span>
           </div>
        </div>

         <div className="bg-gray-50/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-100">
           <div className="flex items-center gap-2 text-gray-500 mb-1">
             <Clock className="w-4 h-4" />
             <span className="text-xs font-medium uppercase tracking-wide">Ends</span>
           </div>
           <div className="text-lg font-bold text-gray-900">
             {bet.eventDate ? format(bet.eventDate, 'MMM d') : 'N/A'}
           </div>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-t border-gray-100 pt-4">
        <div className="flex items-center gap-2">
           <Users className="w-4 h-4 text-gray-400" />
           <span className="font-medium text-gray-700">{bet.betsCount}</span> participants
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>Created {format(bet.createdAt, 'PP')}</span>
        </div>
      </div>
    </div>
  );
};
