import React from 'react';
import { Bet } from '@/types';
import { users } from '@/lib/mockData/users';
import { Avatar } from '@/components/ui/Avatar';
import { format } from 'date-fns';

interface BetParticipantsProps {
  bet: Bet;
}

// Deterministic hash for consistent server/client rendering (avoids hydration mismatch)
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i) | 0;
  }
  return Math.abs(h);
}

export const BetParticipants: React.FC<BetParticipantsProps> = ({ bet }) => {
  // Mock participants - deterministic based on bet.id to avoid hydration mismatch
  const participants = users.slice(0, 8).map((user, i) => {
    const h = hash(`${bet.id}-${user.id}-${i}`);
    const baseDate = new Date('2025-01-15T12:00:00').getTime();
    return {
      user,
      amount: 50 + (h % 950),
      timestamp: new Date(baseDate - (h % 86400000) * 7),
      side: (h % 2) === 0 ? 'For' as const : 'Against' as const
    };
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Participants</h3>
      <div className="space-y-4">
        {participants.map((p, i) => (
          <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <Avatar src={p.user.avatar} alt={p.user.username} size="sm" />
              <div>
                <div className="font-semibold text-sm text-gray-900">{p.user.username}</div>
                <div className="text-xs text-gray-500">{format(p.timestamp, 'MMM d, HH:mm')}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">{p.amount} PRR</div>
              <div className={`text-xs font-medium ${p.side === 'For' ? 'text-green-600' : 'text-red-500'}`}>
                {p.side}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
