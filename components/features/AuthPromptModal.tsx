"use client";

import React, { useState, useEffect } from "react";
import { X, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useRouter } from "@/navigation";

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectUrl: string;
}

export const AuthPromptModal: React.FC<AuthPromptModalProps> = ({ isOpen, onClose, redirectUrl }) => {
  const t = useTranslations('AuthPrompt');
  const router = useRouter();
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

  const handleLogin = () => {
    router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
  };

  const handleRegister = () => {
    router.push(`/register?redirect=${encodeURIComponent(redirectUrl)}`);
  };

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
        isAnimating ? "opacity-100" : "opacity-0"
      )}
      onClick={handleBackdropClick}
    >
      <div 
        className={cn(
          "relative bg-white rounded-3xl shadow-2xl max-w-sm w-full transform transition-all duration-300",
          isAnimating 
            ? "animate-modal-slide-up opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-95 translate-y-4"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('title')}</h2>
          <p className="text-gray-500 mb-8">{t('subtitle')}</p>

          <div className="space-y-3">
            <Button
              variant="primary"
              onClick={handleLogin}
              className="w-full h-12 text-lg shadow-lg shadow-primary/20"
            >
              <LogIn className="w-5 h-5 mr-2" />
              {t('login')}
            </Button>
            
            <Button
              variant="secondary"
              onClick={handleRegister}
              className="w-full h-12 text-lg"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              {t('register')}
            </Button>

            <Button
              variant="ghost"
              onClick={handleClose}
              className="w-full"
            >
              {t('cancel')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
