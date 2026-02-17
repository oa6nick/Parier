"use client";

import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ru, enUS } from "date-fns/locale";
import { Send } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Comment, User } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface BetCommentsProps {
  comments: Comment[];
  currentUser: User | null;
  commentsError?: string | null;
  onAddComment: (content: string) => void;
}

export const BetComments: React.FC<BetCommentsProps> = ({ comments, currentUser, commentsError, onAddComment }) => {
  const t = useTranslations('BetComments');
  const locale = useLocale();
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    onAddComment(newComment);
    setNewComment("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 p-1">
        {commentsError ? (
          <div className="text-center text-red-600 py-8">
            {commentsError}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {t('noComments')}
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="flex-shrink-0">
                <Avatar src={comment.author.avatar} alt={comment.author.username} size="sm" />
              </div>
              <div className="flex-1">
                <div className="bg-gray-50 rounded-2xl rounded-tl-none px-4 py-2 border border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-gray-900">{comment.author.username}</span>
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(comment.createdAt, {
                        addSuffix: true,
                        locale: locale === 'ru' ? ru : enUS,
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                </div>
                <div className="flex items-center gap-4 mt-1 ml-2">
                  <button className="text-xs font-semibold text-gray-400 hover:text-gray-600">
                    {t('reply')}
                  </button>
                  {/* Future: Like comment button */}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        {currentUser ? (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Avatar src={currentUser.avatar} alt={currentUser.username} size="sm" className="hidden sm:block" />
            <div className="flex-1 relative">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t('placeholder')}
                className="pr-10"
              />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 text-primary hover:text-primary-dark p-2 h-auto"
                disabled={!newComment.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center text-gray-500 py-4 text-sm">
            {t('loginToComment')}
          </div>
        )}
      </div>
    </div>
  );
};
