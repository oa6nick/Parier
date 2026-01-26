"use client";

import React, { useState } from "react";
import { Link } from "@/navigation";
import { useRouter } from "@/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Lock, User, ArrowRight, Github, Apple } from "lucide-react";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const t = useTranslations('Register');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      alert(t('validation.required'));
      return;
    }

    if (formData.password.length < 6) {
      alert(t('validation.passwordLength'));
      return;
    }

    setIsLoading(true);
    // Mock registration
    setTimeout(() => {
      setIsLoading(false);
      // In real app, save user data and redirect
      router.push("/onboarding");
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Visual & Branding */}
        <div className="md:w-1/2 bg-gradient-to-br from-primary to-primary-light p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute top-12 right-12 w-32 h-32 bg-yellow-300 opacity-20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-8 border border-white/30">
              <span className="text-2xl font-bold">P</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {t('title')}
            </h1>
            <p className="text-lg text-white/90 font-medium leading-relaxed">
              {t('subtitle')}
            </p>
          </div>

          <div className="relative z-10 mt-12 md:mt-0">
            <div className="flex items-center gap-4 text-sm font-medium text-white/80">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-primary bg-gray-200 flex items-center justify-center text-xs text-gray-500 overflow-hidden`}>
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                  </div>
                ))}
              </div>
              <p>{t('predictors')}</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-8 md:p-12 bg-white flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('createAccount')}</h2>
              <p className="text-gray-500">
                {t('alreadyHaveAccount')}{" "}
                <Link href="/auth/login" className="text-primary font-semibold hover:text-primary-light transition-colors">
                  {t('signIn')}
                </Link>
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <Input
                label={t('username')}
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder={t('usernamePlaceholder')}
                icon={<User className="w-5 h-5" />}
                required
              />
              <Input
                label={t('email')}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('emailPlaceholder')}
                icon={<Mail className="w-5 h-5" />}
                required
              />
              <Input
                label={t('password')}
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t('passwordPlaceholder')}
                icon={<Lock className="w-5 h-5" />}
                required
              />

              <div className="pt-2">
                <Button type="submit" className="w-full h-12 text-lg shadow-lg shadow-primary/20" disabled={isLoading}>
                  {isLoading ? t('creating') : t('startJourney')}
                  {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
                </Button>
              </div>
            </form>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-sm text-gray-400 font-medium">{t('orVia')}</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all font-medium text-gray-700">
                <div className="w-5 h-5">
                   <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.849 L -8.284 53.849 C -8.574 55.399 -9.424 56.774 -10.754 57.659 L -10.754 60.839 L -6.844 60.839 C -4.564 58.739 -3.264 55.629 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.844 60.359 L -10.754 57.179 C -11.814 57.909 -13.174 58.359 -14.754 58.359 C -17.884 58.359 -20.534 56.249 -21.484 53.369 L -25.464 53.369 L -25.464 56.469 C -23.494 60.379 -19.464 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.369 C -21.734 52.619 -21.874 51.819 -21.874 50.989 C -21.874 50.159 -21.734 49.359 -21.484 48.609 L -21.484 45.509 L -25.464 45.509 C -26.284 47.129 -26.754 48.999 -26.754 50.989 C -26.754 52.979 -26.284 54.849 -25.464 56.469 L -21.484 53.369 Z"/><path fill="#EA4335" d="M -14.754 43.619 C -12.984 43.619 -11.404 44.229 -10.154 45.429 L -6.734 42.019 C -8.804 40.089 -11.514 38.929 -14.754 38.929 C -19.464 38.929 -23.494 41.789 -25.464 45.699 L -21.484 48.799 C -20.534 45.919 -17.884 43.619 -14.754 43.619 Z"/></g></svg>
                </div>
                {t('google')}
              </button>
              <button className="flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all font-medium text-gray-700">
                <Apple className="w-5 h-5" />
                {t('apple')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
