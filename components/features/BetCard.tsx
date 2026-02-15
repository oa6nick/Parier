'use client';

import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import {
    Clock,
    Users,
    Share2,
    Lightbulb,
    Check,
    ArrowUpRight,
    X,
    TrendingUp,
    AlertCircle,
    Heart,
    MessageCircle,
} from 'lucide-react';
import { Bet } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { RatingStars } from '@/components/ui/RatingStars';
import { Tag } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import { useTranslations, useFormatter, useLocale } from 'next-intl';
import { useRouter } from '@/navigation';
import { cn, GetMediaUrl } from '@/lib/utils';
import { CommentsModal } from '@/components/features/CommentsModal';
import { users } from '@/lib/mockData/users';
import { getComments } from '@/lib/mockData/comments';
import { ParierServerInternalModelsBetResponse } from '@/api/client';
import moment from 'moment';
import { getSessionIsAuthenticated } from '@/lib/store/Session/model/selectors';
import { useSelector } from 'react-redux';
import { useAuth } from '@/lib/hooks/useAuth';
import { useApi } from '@/api/context';

interface BetCardProps {
    bet: ParierServerInternalModelsBetResponse;
    onReload: () => void;
}

export const BetCard: React.FC<BetCardProps> = ({ bet, onReload }) => {
    const t = useTranslations('BetCard');
    const tModal = useTranslations('BetModal');
    const format = useFormatter();
    const locale = useLocale();
    const router = useRouter();
    const api = useApi();
    const { isAuthenticated, login } = useAuth();
    const [isFlipped, setIsFlipped] = useState(false);
    const [betAmount, setBetAmount] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>('');

    // Social state
    const [liked, setLiked] = useState(bet.is_liked_by_me);
    const [likesCount, setLikesCount] = useState(bet.likes);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const commentsCount = bet.comments || 0;

    const currentUser = users[0]; // Mock current user

    const timeAgo = formatDistanceToNow(moment(bet.created_at).toDate(), {
        addSuffix: true,
        locale: locale === 'ru' ? ru : enUS,
    });

    const handleBetClick = () => {
        if (!isAuthenticated) {
            login(new MouseEvent('click') as any);
            return;
        }

        if (bet.status_id !== 'open') {
            return;
        }

        setIsFlipped(true);
    };

    const handleBackClick = () => {
        setIsFlipped(false);
        setBetAmount('');
        setError('');
    };

    const handleAmountChange = (value: string) => {
        const numValue = value.replace(/[^0-9.]/g, '');
        setBetAmount(numValue);
        setError('');
    };

    const handleBetSubmit = () => {
        setError('');
        const amount = parseFloat(betAmount) || 0;
        const minBet = 10;
        const maxBet = bet.amount || 0;

        if (amount < minBet) {
            setError(tModal('errors.minBet', { min: minBet }));
            return;
        }

        if (amount > maxBet) {
            setError(tModal('errors.maxBet', { max: format.number(maxBet) }));
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            console.log(`Placing bet: $${amount} on bet ${bet.id}`);
            setIsFlipped(false);
            setBetAmount('');
        }, 1500);
    };

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (liked) {
            setLiked(false);
            setLikesCount((prev) => prev || 0 - 1);
            api.ParierApi.parierBetBetIdLikePost(bet.id!).then(() => {
                onReload();
            });
        } else {
            setLiked(true);
            setLikesCount((prev) => prev || 0 + 1);
            api.ParierApi.parierBetBetIdUnlikePost(bet.id!).then(() => {
                onReload();
            });
        }
    };

    const handleCommentsClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsCommentsOpen(true);
    };

    const amount = parseFloat(betAmount) || 0;
    const potentialWin = amount * (bet.coefficient || 0);
    const minBet = 10;
    const quickAmounts = [minBet, 50, 100, 500];

    return (
        <>
            <div
                className={cn('h-full transition-all duration-300', isFlipped ? 'z-50 relative' : 'z-0')}
                style={{ perspective: '1000px' }}
            >
                <div
                    className="relative w-full h-full transition-transform duration-700 ease-in-out"
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                >
                    {/* Front Side - Bet Card */}
                    <div
                        className={cn(
                            'relative w-full h-full bg-white rounded-3xl p-6 shadow-soft border border-gray-100 transition-all duration-300 flex flex-col isolate',
                            !isFlipped && 'hover:shadow-glow hover:-translate-y-1',
                        )}
                        style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'rotateY(0deg)',
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
                                        <Avatar
                                            src={GetMediaUrl(bet.author?.avatar)}
                                            alt={bet.author?.username || 'avatar'}
                                            size="md"
                                        />
                                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-secondary rounded-full border-2 border-white shadow-sm" />
                                    </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <span className="font-bold text-gray-900 truncate">
                                            {bet.author?.username === 'Вы'
                                                ? locale === 'ru'
                                                    ? 'Вы'
                                                    : 'You'
                                                : bet.author?.username}
                                        </span>
                                        {bet.author?.verified && (
                                            <Check className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10 flex-shrink-0" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <RatingStars rating={bet.author?.rating || 0} size="sm" />
                                        <span className="text-[10px] font-bold text-secondary uppercase tracking-wider bg-secondary/10 px-1.5 py-0.5 rounded whitespace-nowrap">
                                            {bet.author?.win_rate || 0}% {t('winRate')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                                <Tag
                                    label={bet.status_id === 'open' ? t('active') : t('closed')}
                                    variant="status"
                                    status={bet.status_id as any}
                                />
                                <Tag
                                    label={bet.category_name as any}
                                    category={{ id: bet.category_id || '', name: bet.category_name || '' } as any}
                                    variant="category"
                                />
                            </div>
                        </div>

                        {/* Title */}
                        <h2
                            className={cn(
                                'relative text-xl font-bold text-gray-900 mb-4 leading-tight transition-colors duration-300 line-clamp-2 break-words',
                                !isFlipped && 'group-hover:text-primary',
                            )}
                        >
                            {bet.title}
                        </h2>

                        {/* Outcome */}
                        <div className="relative bg-gray-50/80 backdrop-blur-sm border border-gray-100 rounded-xl p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                                    <Lightbulb className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                        {t('prediction')}
                                    </p>
                                    <p className="text-sm text-gray-700 font-medium leading-relaxed break-words">
                                        {bet.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bet details */}
                        <div className="relative grid grid-cols-3 gap-3 mb-6">
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100/50 flex flex-col min-w-0">
                                <div className="text-xs text-gray-400 mb-2 font-medium leading-tight">{t('pool')}</div>
                                <div className="text-lg font-bold text-gray-900 leading-tight break-all">
                                    ${format.number(bet.amount || 0)}
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100/50 flex flex-col min-w-0">
                                <div className="text-xs text-gray-400 mb-2 font-medium leading-tight">{t('odds')}</div>
                                <div className="text-lg font-bold text-primary leading-tight">{bet.coefficient}x</div>
                            </div>
                            <div className="bg-secondary/5 rounded-xl p-3 border border-secondary/10 flex flex-col min-w-0">
                                <div className="text-xs text-secondary-dark/70 mb-2 font-medium leading-tight">
                                    {t('potential')}
                                </div>
                                <div className="text-lg font-bold text-secondary-dark leading-tight break-all">
                                    ${format.number(potentialWin)}
                                </div>
                            </div>
                        </div>

                        {/* Footer: Engagement and actions */}
                        <div className="mt-auto relative flex items-center justify-between pt-4 border-t border-gray-100 gap-3">
                            <div className="flex items-center gap-4 text-xs font-medium text-gray-400 min-w-0 flex-1">
                                {/* Like Button */}
                                <button
                                    onClick={handleLike}
                                    className={cn(
                                        'flex items-center gap-1.5 transition-colors hover:text-red-500',
                                        liked && 'text-red-500',
                                    )}
                                >
                                    <Heart className={cn('w-4 h-4', liked && 'fill-current')} />
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
                                    <span>{bet.bets_count}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                                <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 flex-shrink-0 p-0">
                                    <Share2 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="rounded-lg whitespace-nowrap px-4 py-2"
                                    onClick={handleBetClick}
                                    disabled={bet.status_id !== 'open' ? true : false}
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
                            transform: 'rotateY(180deg)',
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">{tModal('title')}</h2>
                            <button
                                onClick={handleBackClick}
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
                                    <p className="font-bold text-gray-900">${format.number(bet.amount || 0)}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">{tModal('odds')}</span>
                                    <p className="font-bold text-primary">{bet.coefficient}x</p>
                                </div>
                            </div>
                        </div>

                        {/* Bet Amount Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {tModal('betAmount')}
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium z-10">
                                    $
                                </span>
                                <input
                                    type="text"
                                    value={betAmount}
                                    onChange={(e) => handleAmountChange(e.target.value)}
                                    placeholder="0"
                                    className="flex h-12 w-full rounded-xl border-2 border-gray-200 bg-white pl-8 pr-4 py-2 text-lg font-bold ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all duration-200"
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
                                            setError('');
                                        }}
                                        className={cn(
                                            'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
                                            betAmount === quickAmount.toString()
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                                        )}
                                    >
                                        ${quickAmount}
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
                                <p className="text-2xl font-bold text-secondary-dark">${format.number(potentialWin)}</p>
                                <p className="text-xs text-gray-500 mt-1">{tModal('ifWin')}</p>
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
                                onClick={handleBackClick}
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
                                        {tModal('placeBet')} ${amount > 0 ? format.number(amount) : '0'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <CommentsModal
                bet={bet}
                currentUser={currentUser}
                isOpen={isCommentsOpen}
                onClose={() => setIsCommentsOpen(false)}
                onReload={onReload}
            />
        </>
    );
};
