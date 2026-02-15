"use client";

import React, { useState, useEffect } from "react";
import { X, CreditCard, Wallet } from "lucide-react";
import { useTranslations, useFormatter } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number) => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onDeposit }) => {
  const t = useTranslations('Wallet');
  const format = useFormatter();
  const [amount, setAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const quickAmounts = [500, 1000, 2500, 5000, 10000];

  const handleAmountChange = (value: string) => {
    const numValue = value.replace(/[^0-9.]/g, "");
    setAmount(numValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const depositAmount = parseFloat(amount) || 0;
    
    if (depositAmount < 100) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onDeposit(depositAmount);
      setAmount("");
      setIsAnimating(false);
      setTimeout(() => onClose(), 300);
    }, 1500);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      setIsAnimating(false);
      setTimeout(() => onClose(), 300);
    }
  };

  const depositAmount = parseFloat(amount) || 0;

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
          "relative bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-transform duration-300",
          isAnimating 
            ? "scale-100 opacity-100" 
            : "scale-95 opacity-0"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{t('deposit')}</h2>
          </div>
          <button
            onClick={() => {
              setIsAnimating(false);
              setTimeout(() => onClose(), 300);
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('amount')}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium z-10">
                {t('tokenSymbol')}
              </span>
              <Input
                type="text"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0"
                className="pl-12 text-lg font-bold"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {t('minDeposit')}: {format.number(100)} {t('tokens')}
            </p>
          </div>

          {/* Quick Amounts */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">{t('quickAmounts')}</p>
            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() => {
                    setAmount(quickAmount.toString());
                  }}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                    amount === quickAmount.toString()
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {format.number(quickAmount)}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          {depositAmount >= 100 && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{t('youWillReceive')}</span>
                <span className="text-lg font-bold text-primary">
                  {format.number(depositAmount)} {t('tokens')}
                </span>
              </div>
              <p className="text-xs text-gray-500">{t('depositNote')}</p>
            </div>
          )}

          {/* Payment Method Placeholder */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">{t('paymentMethod')}</p>
                <p className="text-xs text-gray-500">{t('cardPayment')}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsAnimating(false);
                setTimeout(() => onClose(), 300);
              }}
              className="flex-1"
              disabled={isSubmitting}
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={isSubmitting || depositAmount < 100}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  {t('processing')}
                </>
              ) : (
                <>
                  {t('deposit')} {depositAmount > 0 ? format.number(depositAmount) : ""}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
