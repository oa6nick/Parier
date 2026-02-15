"use client";

import React, { useState, useId } from 'react';
import { Bet } from '@/types';
import { Button } from '@/components/ui/Button';
import { useFormatter } from 'next-intl';
import { AlertCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AuthPromptModal } from '../AuthPromptModal';

interface BetActionsProps {
  bet: Bet;
}

export const BetActions: React.FC<BetActionsProps> = ({ bet }) => {
  const format = useFormatter();
  const { isAuthenticated } = useAuth();
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);
  const inputId = useId();

  const handleBet = () => {
    if (!isAuthenticated) {
      setIsAuthPromptOpen(true);
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Bet placed successfully!');
      setAmount('');
    }, 1000);
  };

  const potentialWin = Number(amount) * bet.coefficient;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100 sticky top-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Place a Bet</h3>
      
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Multiplier</span>
          <span className="text-lg font-bold text-primary">{bet.coefficient}x</span>
        </div>
        <div className="text-xs text-gray-400">
          Your win probability is calculated based on current pool distribution.
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
            Amount (PRR)
          </label>
          <input
            id={inputId}
            name="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-lg"
          />
        </div>

        <div className="flex gap-2">
          {[100, 500, 1000].map((val) => (
            <button
              key={val}
              onClick={() => setAmount(val.toString())}
              className="px-3 py-1.5 rounded-lg bg-gray-100 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
            >
              {val}
            </button>
          ))}
        </div>
      </div>

      {Number(amount) > 0 && (
        <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-4 mb-6 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-secondary-dark/70">Potential Win</span>
            <TrendingUp className="w-4 h-4 text-secondary" />
          </div>
          <div className="text-2xl font-bold text-secondary-dark">
            {format.number(potentialWin)} PRR
          </div>
        </div>
      )}

      <Button
        variant="primary"
        className="w-full py-6 text-lg"
        onClick={handleBet}
        disabled={!amount || Number(amount) <= 0 || isSubmitting}
      >
        {isSubmitting ? 'Processing...' : 'Place Bet'}
      </Button>
      
      <div className="mt-4 flex items-start gap-2 text-xs text-gray-400">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <p>By placing a bet, you agree to the platform terms. Funds are locked until the event outcome is verified.</p>
      </div>

      <AuthPromptModal
        isOpen={isAuthPromptOpen}
        onClose={() => setIsAuthPromptOpen(false)}
        redirectUrl={`/bet/${bet.id}`}
      />
    </div>
  );
};
