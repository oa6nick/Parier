"use client";

import React, { useState } from "react";
import { Link, useRouter } from "@/navigation";
import { useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";
import { Mail, Lock, User, CheckCircle, TrendingUp } from "lucide-react";

export default function RegisterPage() {
  const t = useTranslations('Register');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await register(username, email);
    setLoading(false);
    const redirect = searchParams.get('redirect');
    router.push(redirect || "/onboarding");
  };

  return (
    <AuthLayout
      title={t('title')}
      subtitle={t('subtitle')}
      image={
        <div className="space-y-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-300">Top Predictor</p>
                <p className="font-bold text-white">Alex just won 500 PRR</p>
              </div>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-3/4 animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>

          <div className="space-y-4">
            {[
              "Vote on real-world events",
              "Earn reputation and tokens",
              "Climb the global leaderboard"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="font-medium text-gray-200">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <Input
            label={t('username')}
            name="username"
            placeholder={t('usernamePlaceholder')}
            icon={<User className="w-4 h-4" />}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          
          <Input
            label={t('email')}
            name="email"
            type="email"
            placeholder={t('emailPlaceholder')}
            icon={<Mail className="w-4 h-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input
            label={t('password')}
            name="password"
            type="password"
            placeholder={t('passwordPlaceholder')}
            icon={<Lock className="w-4 h-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-base shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-secondary hover:brightness-110"
          disabled={loading}
        >
          {loading ? t('creating') : t('startJourney')}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">{t('orVia')}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button type="button" className="flex items-center justify-center gap-2 h-12 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="text-sm font-medium text-gray-700">{t('google')}</span>
          </button>
          <button type="button" className="flex items-center justify-center gap-2 h-12 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24.02-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.31-.89 3.51-.84 1.54.06 2.68.74 3.37 1.74-2.92 1.61-2.42 5.89.51 7.1-.51 1.56-1.3 3.12-2.47 4.19zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">{t('apple')}</span>
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          {t('alreadyHaveAccount')}{" "}
          <Link href="/login" className="font-bold text-primary hover:text-primary-dark transition-colors">
            {t('signIn')}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
