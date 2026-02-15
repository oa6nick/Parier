"use client";

import React, { useState } from 'react';
import { Bet, Comment } from '@/types';
import { getComments } from '@/lib/mockData/comments';
import { Avatar } from '@/components/ui/Avatar';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, ThumbsUp } from 'lucide-react';

interface BetPredictionsProps {
  bet: Bet;
}

export const BetPredictions: React.FC<BetPredictionsProps> = ({ bet }) => {
  const [comments] = useState<Comment[]>(getComments(bet.id));

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
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar src={comment.author.avatar} alt={comment.author.username} size="sm" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-gray-900">{comment.author.username}</span>
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
      </div>
    </div>
  );
};
