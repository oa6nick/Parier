'use client';

import React, { useState, useId } from 'react';
import { Bet } from '@/types';
import { Button } from '@/components/ui/Button';
import { useFormatter } from 'next-intl';
import { AuthPromptModal } from '../AuthPromptModal';
import { AlertCircle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/hooks/useAuth';

interface MobileBetActionsProps {
    bet: Bet;
}

export const MobileBetActions: React.FC<MobileBetActionsProps> = ({ bet }) => {
    const format = useFormatter();
    const { isAuthenticated } = useAuth();
    const [isExpanded, setIsExpanded] = useState(false);
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
            setIsExpanded(false);
        }, 1000);
    };

    const potentialWin = Number(amount) * bet.coefficient;

    return (
        <>
            <div
                className={cn(
                    'fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 lg:hidden',
                    isExpanded ? 'p-4 rounded-t-3xl' : 'p-4',
                )}
            >
                {/* Collapsed View */}
                {!isExpanded && (
                    <div className="flex gap-4 items-center">
                        <div className="flex-1">
                            <div className="text-xs text-gray-500 font-medium">Potential Win up to</div>
                            <div className="text-xl font-bold text-secondary-dark flex items-center gap-1">
                                {format.number(bet.betAmount * bet.coefficient)}{' '}
                                <span className="text-sm font-normal text-gray-400">PAR</span>
                            </div>
                        </div>
                        <Button
                            variant="primary"
                            size="lg"
                            className="flex-1 shadow-glow"
                            onClick={() => setIsExpanded(true)}
                            disabled={bet.status !== 'open'}
                        >
                            Bet Now
                        </Button>
                    </div>
                )}

                {/* Expanded View */}
                {isExpanded && (
                    <div className="space-y-4 animate-in slide-in-from-bottom-10 fade-in">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-gray-900">Place your bet</h3>
                            <button onClick={() => setIsExpanded(false)} className="text-gray-400 hover:text-gray-600">
                                Close
                            </button>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Current Odds</span>
                            <span className="text-lg font-bold text-primary">{bet.coefficient}x</span>
                        </div>

                        <div>
                            <label
                                htmlFor={inputId}
                                className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide"
                            >
                                Amount (PAR)
                            </label>
                            <div className="relative">
                                <input
                                    id={inputId}
                                    name="amount"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0"
                                    autoFocus
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-lg bg-gray-50 focus:bg-white"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                            {[100, 500, 1000, 5000].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => setAmount(val.toString())}
                                    className="px-3 py-1.5 rounded-lg bg-gray-100 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors flex-shrink-0"
                                >
                                    {val}
                                </button>
                            ))}
                        </div>

                        {Number(amount) > 0 && (
                            <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-3 animate-in fade-in slide-in-from-top-2">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-medium text-secondary-dark/70">Potential Win</span>
                                    <TrendingUp className="w-3 h-3 text-secondary" />
                                </div>
                                <div className="text-xl font-bold text-secondary-dark">
                                    {format.number(potentialWin)} PAR
                                </div>
                            </div>
                        )}

                        <Button
                            variant="primary"
                            className="w-full py-4 text-lg shadow-glow"
                            onClick={handleBet}
                            disabled={!amount || Number(amount) <= 0 || isSubmitting}
                        >
                            {isSubmitting
                                ? 'Processing...'
                                : `Place Bet • ${Number(amount) > 0 ? format.number(Number(amount)) : 0} PAR`}
                        </Button>
                        <p className="text-[10px] text-center text-gray-400">
                            Funds are locked until event verification.
                        </p>
                    </div>
                )}
            </div>

            {/* Backdrop for expanded state */}
            {isExpanded && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden animate-in fade-in backdrop-blur-sm"
                    onClick={() => setIsExpanded(false)}
                />
            )}

            <AuthPromptModal
                isOpen={isAuthPromptOpen}
                onClose={() => setIsAuthPromptOpen(false)}
                redirectUrl={`/bet/${bet.id}`}
            />
        </>
    );
};
