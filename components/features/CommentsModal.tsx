"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Bet, Comment, User } from "@/types";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { BetComments } from "./BetComments";

interface CommentsModalProps {
  bet: Bet;
  initialComments: Comment[];
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (content: string) => void;
  loading?: boolean;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({ 
  bet, 
  initialComments, 
  currentUser, 
  isOpen, 
  onClose,
  onAddComment,
  loading = false,
}) => {
  const t = useTranslations('BetComments');
  const [isAnimating, setIsAnimating] = useState(false);

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
        "fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
        isAnimating ? "opacity-100" : "opacity-0"
      )}
      onClick={handleBackdropClick}
    >
      <div 
        className={cn(
          "relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg h-[80vh] sm:h-[600px] flex flex-col transform transition-transform duration-300",
          isAnimating 
            ? "translate-y-0 scale-100" 
            : "translate-y-full sm:translate-y-4 sm:scale-95"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{t('title')}</h2>
            <p className="text-xs text-gray-500 truncate max-w-[200px] sm:max-w-xs">
              {bet.title}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-4">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-gray-500">{t('loading')}</div>
          ) : (
            <BetComments 
              comments={initialComments} 
              currentUser={currentUser}
              onAddComment={onAddComment}
            />
          )}
        </div>
      </div>
    </div>
  );
};
