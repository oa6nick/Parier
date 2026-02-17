"use client";

import React, { useState, useId } from "react";
import { formatDistanceToNow } from "date-fns";
import { ru, enUS } from "date-fns/locale";
import { Clock, Users, Share2, Lightbulb, Check, ArrowUpRight, X, TrendingUp, AlertCircle, Heart, MessageCircle, ExternalLink } from "lucide-react";
import { Bet } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { RatingStars } from "@/components/ui/RatingStars";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { useTranslations, useFormatter, useLocale } from "next-intl";
import { useRouter, Link } from "@/navigation";
import { cn } from "@/lib/utils";
import { CommentsModal } from "@/components/features/CommentsModal";
import { AuthPromptModal } from "@/components/features/AuthPromptModal";
import { useAuth } from "@/context/AuthContext";
import {
  joinBet,
  likeBet,
  unlikeBet,
  getBetComments,
  createBetComment,
  mapCommentResponseToComment,
} from "@/lib/api/bets";

interface BetCardProps {
  bet: Bet;
  onBetJoined?: () => void;
}

export const BetCard: React.FC<BetCardProps> = ({ bet, onBetJoined }) => {
  const t = useTranslations('BetCard');
  const tModal = useTranslations('BetModal');
  const tComments = useTranslations('BetComments');
  const format = useFormatter();
  const locale = useLocale();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);
  const [betAmount, setBetAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const inputId = useId();

  // Social state
  const [liked, setLiked] = useState(bet.likedByMe);
  const [likesCount, setLikesCount] = useState(bet.likesCount);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState<import("@/types").Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [commentsCount, setCommentsCount] = useState(bet.commentsCount);
  const [isCopied, setIsCopied] = useState(false);
  const [betsCount, setBetsCount] = useState(bet.betsCount);
  const [displayBetAmount, setDisplayBetAmount] = useState(bet.betAmount);

  const currentUser = user ?? null;

  const timeAgo = formatDistanceToNow(bet.createdAt, {
    addSuffix: true,
    locale: locale === 'ru' ? ru : enUS,
  });

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const shareData = {
      title: bet.title,
      text: t('shareText', {
        title: bet.title,
        outcome: bet.outcome,
        coefficient: bet.coefficient
      }),
      url: window.location.origin,
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

  const handleBetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (bet.status !== "open") {
      return;
    }

    setIsFlipped(true);
  };

  const handleBackClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsFlipped(false);
    setBetAmount("");
    setError("");
  };

  const handleAmountChange = (value: string) => {
    const numValue = value.replace(/[^0-9.]/g, "");
    setBetAmount(numValue);
    setError("");
  };

  const handleBetSubmit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setError("");
    const amount = parseFloat(betAmount) || 0;
    const minBet = 10;
    const maxBet = displayBetAmount;

    if (amount < minBet) {
      setError(tModal('errors.minBet', { min: minBet }));
      return;
    }

    if (amount > maxBet) {
      setError(tModal('errors.maxBet', { max: format.number(maxBet) }));
      return;
    }

    if (!isAuthenticated) {
      setIsAuthPromptOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await joinBet(bet.id, amount);
      setBetsCount((prev) => prev + 1);
      setDisplayBetAmount((prev) => prev + amount);
      setIsFlipped(false);
      setBetAmount("");
      onBetJoined?.();
    } catch (err) {
      setError((err as Error).message || tModal('errors.generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setIsAuthPromptOpen(true);
      return;
    }
    const prevLiked = liked;
    const prevCount = likesCount;
    setLiked(!liked);
    setLikesCount((c) => (liked ? c - 1 : c + 1));
    try {
      if (liked) {
        await unlikeBet(bet.id);
      } else {
        await likeBet(bet.id);
      }
    } catch {
      setLiked(prevLiked);
      setLikesCount(prevCount);
    }
  };

  const handleCommentsClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCommentsOpen(true);
    setCommentsError(null);
    if (isAuthenticated) {
      setCommentsLoading(true);
      try {
        const { comments: apiComments, total } = await getBetComments(bet.id, 0, 50, locale);
        setComments(apiComments.map(mapCommentResponseToComment));
        setCommentsCount(total);
      } catch {
        setComments([]);
        setCommentsError(tComments('failedToLoad'));
      } finally {
        setCommentsLoading(false);
      }
    } else {
      setComments([]);
    }
  };

  const handleAddComment = async (content: string) => {
    if (!isAuthenticated) {
      setIsAuthPromptOpen(true);
      return;
    }
    try {
      await createBetComment(bet.id, content);
      const { comments: apiComments, total } = await getBetComments(bet.id, 0, 50, locale);
      setComments(apiComments.map(mapCommentResponseToComment));
      setCommentsCount(total);
    } catch {
      // Error handled by modal or silently
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if text is selected
    if (window.getSelection()?.toString()) return;
    
    router.push(`/bet/${bet.id}`);
  };

  const amount = parseFloat(betAmount) || 0;
  const potentialWin = amount * bet.coefficient;
  const minBet = 10;
  const quickAmounts = [minBet, 50, 100, 500];

  return (
    <>
      <div 
        className={cn(
          "h-full transition-all duration-300",
          isFlipped ? "z-50 relative" : "z-0"
        )} 
        style={{ perspective: '1000px' }}
      >
        <div 
          className="relative w-full h-full transition-transform duration-700 ease-in-out"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front Side - Bet Card */}
          <div 
            onClick={handleCardClick}
            className={cn(
              "relative w-full h-full bg-white rounded-3xl p-6 shadow-soft border border-gray-100 transition-all duration-300 flex flex-col isolate cursor-pointer",
              !isFlipped && "hover:shadow-glow hover:-translate-y-1"
            )}
            style={{ 
              backfaceVisibility: 'hidden', 
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)'
            }}
          >
            {!isFlipped && (
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none -z-10" />
            )}

            {/* Header */}
            <div className="relative flex items-start justify-between mb-5 gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative flex-shrink-0">
                  <div className="relative">
                    <Avatar src={bet.author.avatar} alt={bet.author.username} size="md" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-secondary rounded-full border-2 border-white shadow-sm" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-bold text-gray-900 truncate">{bet.author.username === "Вы" ? (locale === "ru" ? "Вы" : "You") : bet.author.username}</span>
                    {bet.author.verified && (
                      <Check className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <RatingStars rating={bet.author.rating} size="sm" />
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-wider bg-secondary/10 px-1.5 py-0.5 rounded whitespace-nowrap">
                      {bet.author.winRate}% {t('winRate')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                <Tag
                  label={bet.status === "open" ? t('active') : t('closed')}
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
            <div className="block">
              <h2 className={cn(
                "relative text-xl font-bold text-gray-900 mb-4 leading-tight transition-colors duration-300 line-clamp-2 break-words",
                !isFlipped && "group-hover:text-primary hover:text-primary"
              )}>
                {bet.title}
              </h2>
            </div>

            {/* Outcome */}
            <div className="relative bg-gray-50/80 backdrop-blur-sm border border-gray-100 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('prediction')}</p>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed break-words">{bet.outcome}</p>
                </div>
              </div>
            </div>

      {/* Bet details */}
      <div className="relative grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100/50 flex flex-col min-w-0">
          <div className="text-xs text-gray-400 mb-2 font-medium leading-tight">{t('pool')}</div>
          <div className="text-lg font-bold text-gray-900 leading-tight break-all">
            {format.number(displayBetAmount)}
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5">{t('tokens')}</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100/50 flex flex-col min-w-0">
          <div className="text-xs text-gray-400 mb-2 font-medium leading-tight">{t('odds')}</div>
          <div className="text-lg font-bold text-primary leading-tight">{bet.coefficient}x</div>
        </div>
        <div className="bg-secondary/5 rounded-xl p-3 border border-secondary/10 flex flex-col min-w-0">
          <div className="text-xs text-secondary-dark/70 mb-2 font-medium leading-tight">{t('potential')}</div>
          <div className="text-lg font-bold text-secondary-dark leading-tight break-all">
            {format.number(displayBetAmount * bet.coefficient)}
          </div>
          <div className="text-[10px] text-secondary-dark/60 mt-0.5">{t('tokens')}</div>
        </div>
      </div>

            {/* Footer: Engagement and actions */}
            <div className="mt-auto relative flex items-center justify-between pt-4 border-t border-gray-100 gap-3">
              <div className="flex items-center gap-4 text-xs font-medium text-gray-400 min-w-0 flex-1">
                {/* Like Button */}
                <button 
                  onClick={handleLike}
                  className={cn(
                    "flex items-center gap-1.5 transition-colors hover:text-red-500",
                    liked && "text-red-500"
                  )}
                >
                  <Heart className={cn("w-4 h-4", liked && "fill-current")} />
                  <span>{likesCount}</span>
                </button>

                {/* Comment Button */}
                <button 
                  onClick={handleCommentsClick}
                  className="flex items-center gap-1.5 transition-colors hover:text-blue-500"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{commentsCount}</span>
                </button>

                {/* Bets Count */}
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <span>{betsCount}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full w-9 h-9 flex-shrink-0 p-0 relative transition-colors"
                  onClick={handleShare}
                  title={t('share')}
                >
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
                    <Share2 className="w-4 h-4" />
                  </div>
                </Button>

                <Link href={`/bet/${bet.id}`} onClick={(e) => e.stopPropagation()}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full w-9 h-9 flex-shrink-0 p-0 relative transition-colors"
                    title={t('details')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </Link>

                <Button 
                  variant="primary" 
                  size="sm" 
                  className="rounded-lg whitespace-nowrap px-4 py-2"
                  onClick={handleBetClick}
                  disabled={bet.status !== "open"}
                >
                  {t('betNow')} <ArrowUpRight className="w-4 h-4 ml-1 inline-block" />
                </Button>
              </div>
            </div>
          </div>

          {/* Back Side - Bet Form */}
          <div 
            className="absolute inset-0 bg-white rounded-3xl p-6 shadow-soft border border-gray-100 h-full flex flex-col isolate overflow-y-auto"
            style={{ 
              backfaceVisibility: 'hidden', 
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{tModal('title')}</h2>
              <button
                onClick={(e) => handleBackClick(e)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Bet Info */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {tModal('prediction')}
              </h3>
              <p className="text-gray-900 font-medium mb-3">{bet.title}</p>
            <div className="grid grid-cols-2 gap-3 text-sm pt-3 border-t border-gray-200">
              <div>
                <span className="text-gray-500">{tModal('currentPool')}</span>
                <p className="font-bold text-gray-900">{format.number(displayBetAmount)} {t('tokens')}</p>
              </div>
              <div>
                <span className="text-gray-500">{tModal('odds')}</span>
                <p className="font-bold text-primary">{bet.coefficient}x</p>
              </div>
            </div>
            </div>

            {/* Bet Amount Input */}
            <div className="mb-6">
              <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
                {tModal('betAmount')} ({t('tokens')})
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium z-10">{t('tokenSymbol')}</span>
                <input
                  id={inputId}
                  name="betAmount"
                  type="text"
                  value={betAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="0"
                  className="flex h-12 w-full rounded-xl border-2 border-gray-200 bg-white pl-12 pr-4 py-2 text-lg font-bold ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all duration-200"
                  required
                />
              </div>

              {/* Quick Amounts */}
              <div className="flex gap-2 mt-3 flex-wrap">
                {quickAmounts.map((quickAmount) => (
                  <button
                    key={quickAmount}
                    type="button"
                    onClick={() => {
                      setBetAmount(quickAmount.toString());
                      setError("");
                    }}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                      betAmount === quickAmount.toString()
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    {format.number(quickAmount)}
                  </button>
                ))}
              </div>

              {error && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Potential Win */}
            {amount > 0 && (
              <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-secondary-dark/70">
                    {tModal('potentialWin')}
                  </span>
                  <TrendingUp className="w-5 h-5 text-secondary" />
                </div>
              <p className="text-2xl font-bold text-secondary-dark">
                {format.number(potentialWin)} {t('tokens')}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {tModal('ifWin')}
              </p>
              </div>
            )}

            {/* Info */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">{tModal('disclaimer')}</p>
                  <p className="text-blue-700">{tModal('disclaimerText')}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-auto flex gap-3 pt-4 border-t border-gray-100">
              <Button
                variant="ghost"
                onClick={(e) => handleBackClick(e)}
                className="flex-1"
                disabled={isSubmitting}
              >
                {tModal('cancel')}
              </Button>
              <Button
                variant="primary"
                onClick={handleBetSubmit}
                className="flex-1"
                disabled={isSubmitting || amount < minBet}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    {tModal('placing')}
                  </>
                ) : (
                  <>
                    {tModal('placeBet')} {amount > 0 ? format.number(amount) : "0"} {t('tokens')}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CommentsModal
        bet={bet}
        initialComments={comments}
        currentUser={currentUser}
        commentsError={commentsError}
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        onAddComment={handleAddComment}
        loading={commentsLoading}
      />

      <AuthPromptModal
        isOpen={isAuthPromptOpen}
        onClose={() => setIsAuthPromptOpen(false)}
        redirectUrl={`/bet/${bet.id}`}
      />
    </>
  );
};
