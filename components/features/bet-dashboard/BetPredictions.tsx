'use client';

import React, { useState, useEffect } from 'react';
import { Bet, Comment } from '@/types';
import { getComments } from '@/lib/mockData/comments';
import { useApi } from '@/api/context';
import { Avatar } from '@/components/ui/Avatar';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, ThumbsUp } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/hooks/useAuth';
import { api } from '@/api/api';

interface BetPredictionsProps {
    bet: Bet;
}

export const BetPredictions: React.FC<BetPredictionsProps> = ({ bet }) => {
    const locale = useLocale();
    const t = useTranslations('BetComments');
    const { isAuthenticated } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        let cancelled = false;
        if (isAuthenticated) {
            setLoading(true);
            api.ParierApi.parierBetBetIdCommentsPost(bet.id, { language: locale, offset: 0, limit: 50 })
                .then((res) => res.data?.data)
                .then((res) => {
                    if (!cancelled) setComments(res as any);
                })
                .catch(() => {
                    if (!cancelled) setComments(getComments(bet.id));
                })
                .finally(() => {
                    if (!cancelled) setLoading(false);
                });
        } else {
            setComments(getComments(bet.id));
            setLoading(false);
        }
        return () => {
            cancelled = true;
        };
    }, [bet.id, locale, isAuthenticated]);

    const handleAddComment = async () => {
        if (!newComment.trim() || !isAuthenticated || submitting) return;
        setSubmitting(true);
        try {
            await api.ParierApi.parierBetBetIdCommentPut(bet.id, { language: locale, content: newComment.trim() });
            setNewComment('');
            const apiComments = await api.ParierApi.parierBetBetIdCommentsPost(bet.id, {
                language: locale,
                offset: 0,
                limit: 50,
            }).then((res) => res.data?.data);
            setComments(apiComments as any);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-gray-400" />
                    Discussion & Predictions
                </h3>
                <span className="text-sm text-gray-500">{comments.length} comments</span>
            </div>

            <div className="space-y-6">
                {loading ? (
                    <div className="text-center py-8 text-gray-400">{t('loading')}</div>
                ) : comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                            <Avatar src={comment.author.avatar} alt={comment.author.username} size="sm" />
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold text-sm text-gray-900">
                                        {comment.author.username}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed mb-2">{comment.content}</p>
                                <div className="flex items-center gap-4">
                                    <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                                        <ThumbsUp className="w-3.5 h-3.5" />
                                        <span>{comment.likesCount}</span>
                                    </button>
                                    <button className="text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors">
                                        Reply
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        No predictions yet. Be the first to share your thoughts!
                    </div>
                )}

                {isAuthenticated && (
                    <div className="pt-4 border-t border-gray-100">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder={t('placeholder')}
                            rows={2}
                            className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary resize-none mb-2"
                        />
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleAddComment}
                            disabled={!newComment.trim() || submitting}
                        >
                            {submitting ? t('sending') : t('send')}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
