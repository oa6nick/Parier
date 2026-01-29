"use client";

import React from "react";
import { Link } from "@/navigation";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  image?: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, image }) => {
  const t = useTranslations('Create'); // Reusing or using generic

  return (
    <div className="fixed inset-0 bg-white z-50 flex overflow-hidden">
      {/* Left Panel - Visuals */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 z-10" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-secondary/30 rounded-full blur-3xl animate-pulse-slow delay-700" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        </div>

        <div className="relative z-20">
          <Link href="/" className="flex items-center gap-2 group w-fit">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary rounded-xl rotate-3"></div>
              <div className="absolute inset-0 bg-white rounded-xl -rotate-3"></div>
              <span className="relative text-gray-900 font-bold text-xl">P</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Parier</span>
          </Link>
        </div>

        <div className="relative z-20 max-w-lg">
          {image}
        </div>

        <div className="relative z-20 text-sm text-gray-400">
          © 2026 Parier Platform. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 relative overflow-y-auto">
        <Link href="/" className="absolute top-6 left-6 lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Link>

        <div className="w-full max-w-md space-y-8 animate-fade-in-up">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">
              {title}
            </h1>
            <p className="text-gray-500 text-lg">
              {subtitle}
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};
