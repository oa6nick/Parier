'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import { Bet, Comment, User } from '@/types';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { BetComments } from './BetComments';
import { ParierServerInternalModelsBetResponse } from '@/api/client';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/api/context';

interface CommentsModalProps {
    bet: ParierServerInternalModelsBetResponse;
    currentUser: User;
    isOpen: boolean;
    onClose: () => void;
    onReload: () => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({ bet, currentUser, isOpen, onClose, onReload }) => {
    const t = useTranslations('BetComments');
    const [isAnimating, setIsAnimating] = useState(false);
    const api = useApi();
    const locale = useLocale();
    const [count, setCount] = useState(0);
    const { data: commentsData } = useQuery({
        queryKey: ['comments', bet.id, count],
        queryFn: () =>
            api.ParierApi.parierBetBetIdCommentsPost(bet.id!, {
                language: locale,
            }),
    });
    const comments = useMemo(() => commentsData?.data?.data || [], [commentsData]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setIsAnimating(true), 10);
        } else {
            setIsAnimating(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setIsAnimating(false);
            setTimeout(() => onClose(), 300);
        }
    };

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => onClose(), 300);
    };

    return (
        <div
            className={cn(
                'fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300',
                isAnimating ? 'opacity-100' : 'opacity-0',
            )}
            onClick={handleBackdropClick}
        >
            <div
                className={cn(
                    'relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg h-[80vh] sm:h-[600px] flex flex-col transform transition-transform duration-300',
                    isAnimating ? 'translate-y-0 scale-100' : 'translate-y-full sm:translate-y-4 sm:scale-95',
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{t('title')}</h2>
                        <p className="text-xs text-gray-500 truncate max-w-[200px] sm:max-w-xs">{bet.title}</p>
                    </div>
                    <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden p-4">
                    <BetComments
                        comments={comments}
                        currentUser={currentUser}
                        onAddComment={(content) => {
                            api.ParierApi.parierBetBetIdCommentPut(bet.id!, { content, language: locale }).then(() => {
                                setCount((old) => old + 1);
                                onReload();
                            });
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
