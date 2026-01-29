"use client";

import React, { useState, useEffect } from "react";
import { X, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { Bet } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTranslations, useFormatter, useLocale } from "next-intl";
import { cn } from "@/lib/utils";

interface BetModalProps {
  bet: Bet;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

export const BetModal: React.FC<BetModalProps> = ({ bet, isOpen, onClose, onConfirm }) => {
  const t = useTranslations('BetModal');
  const tBetCard = useTranslations('BetCard');
  const format = useFormatter();
  const [betAmount, setBetAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset form when opening
      setBetAmount("");
      setError("");
      setIsSubmitting(false);
      // Trigger animation
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const amount = parseFloat(betAmount) || 0;
  const potentialWin = amount * bet.coefficient;
  const minBet = 10;
  const maxBet = bet.betAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (amount < minBet) {
      setError(t('errors.minBet', { min: minBet }));
      return;
    }

    if (amount > maxBet) {
      setError(t('errors.maxBet', { max: format.number(maxBet) }));
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirm(amount);
      setBetAmount("");
      setIsAnimating(false);
      setTimeout(() => onClose(), 300);
    }, 1500);
  };

  const handleAmountChange = (value: string) => {
    const numValue = value.replace(/[^0-9.]/g, "");
    setBetAmount(numValue);
    setError("");
  };

  const quickAmounts = [minBet, 50, 100, 500];

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      setIsAnimating(false);
      setTimeout(() => onClose(), 300);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setIsAnimating(false);
      setTimeout(() => onClose(), 300);
    }
  };

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
        isAnimating ? "opacity-100" : "opacity-0"
      )}
      onClick={handleBackdropClick}
    >
      <div 
        className={cn(
          "relative bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform",
          isAnimating 
            ? "animate-modal-slide-up opacity-100" 
            : "opacity-0 scale-95 translate-y-4"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-3xl flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">{t('title')}</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Bet Info */}
          <div 
            className={cn(
              "bg-gray-50 rounded-xl p-4 border border-gray-100 transition-all duration-300 delay-75",
              isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            )}
          >
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {t('prediction')}
            </h3>
            <p className="text-gray-900 font-medium">{bet.title}</p>
            <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">{t('currentPool')}</span>
                <p className="font-bold text-gray-900">{format.number(bet.betAmount)} {tBetCard('tokens')}</p>
              </div>
              <div>
                <span className="text-gray-500">{t('odds')}</span>
                <p className="font-bold text-primary">{bet.coefficient}x</p>
              </div>
            </div>
          </div>

          {/* Bet Amount Input */}
          <div 
            className={cn(
              "transition-all duration-300 delay-150",
              isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            )}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('betAmount')} ({tBetCard('tokens')})
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium z-10">{tBetCard('tokenSymbol')}</span>
              <input
                type="text"
                value={betAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0"
                className="flex h-12 w-full rounded-xl border-2 border-gray-200 bg-white pl-14 pr-4 py-2 text-lg font-bold ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all duration-200"
                required
              />
            </div>

            {/* Quick Amounts */}
            <div className="flex gap-2 mt-3">
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
            <div 
              className={cn(
                "bg-secondary/5 border border-secondary/20 rounded-xl p-4 transition-all duration-300 delay-200 animate-scale-in",
                isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-secondary-dark/70">
                  {t('potentialWin')}
                </span>
                <TrendingUp className="w-5 h-5 text-secondary" />
              </div>
              <p className="text-2xl font-bold text-secondary-dark">
                {format.number(potentialWin)} {tBetCard('tokens')}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {t('ifWin')}
              </p>
            </div>
          )}

          {/* Info */}
          <div 
            className={cn(
              "bg-blue-50 border border-blue-100 rounded-xl p-4 transition-all duration-300 delay-100",
              isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            )}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">{t('disclaimer')}</p>
                <p className="text-blue-700">{t('disclaimerText')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div 
          className={cn(
            "sticky bottom-0 bg-white border-t border-gray-100 p-6 rounded-b-3xl flex gap-3 transition-all duration-300 delay-200",
            isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <Button
            variant="ghost"
            onClick={handleClose}
            className="flex-1"
            disabled={isSubmitting}
          >
            {t('cancel')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            onClick={handleSubmit}
            className="flex-1"
            disabled={isSubmitting || amount < minBet}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                {t('placing')}
              </>
            ) : (
              <>
                {t('placeBet')} {amount > 0 ? format.number(amount) : "0"} {tBetCard('tokens')}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
