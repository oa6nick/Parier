"use client";

import React from "react";
import { Link, usePathname, useRouter } from "@/navigation";
import { Plus, User, Menu, Globe, Wallet, LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale, useFormatter } from "next-intl";
import { getTokenBalance } from "@/lib/mockData/wallet";
import { useAuth } from "@/context/AuthContext";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const t = useTranslations('Navigation');
  const tLogin = useTranslations('Login');
  const tRegister = useTranslations('Register');
  const locale = useLocale();
  const router = useRouter();
  const format = useFormatter();
  
  const { user, isAuthenticated } = useAuth();
  const balance = user ? getTokenBalance(user.id) : { balance: 0 };

  const navItems = [
    { href: "/", label: t('feed') },
    { href: "/rating", label: t('ranking') },
  ];

  if (isAuthenticated) {
    navItems.push({ href: "/profile", label: t('profile') });
  }

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'ru' : 'en';
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
              <div className="absolute inset-0 bg-gray-900 rounded-xl -rotate-3 group-hover:-rotate-6 transition-transform duration-300"></div>
              <span className="relative text-white font-bold text-xl">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Parier</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "text-primary bg-primary/5"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="w-px h-6 bg-gray-200 mx-2"></div>
            
            {isAuthenticated ? (
              <>
                <Link href="/wallet">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group">
                    <Wallet className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-primary">
                      {format.number(balance.balance)}
                    </span>
                  </div>
                </Link>
                
                <button 
                  onClick={toggleLocale}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 flex items-center gap-1"
                >
                  <Globe className="w-4 h-4" />
                  {locale.toUpperCase()}
                </button>

                <Link href="/create">
                  <Button variant="primary" size="sm" className="shadow-glow ml-2">
                    <Plus className="w-4 h-4" /> {t('create')}
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <button 
                  onClick={toggleLocale}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 flex items-center gap-1"
                >
                  <Globe className="w-4 h-4" />
                  {locale.toUpperCase()}
                </button>
                
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="ml-2">
                    {tLogin('signIn')}
                  </Button>
                </Link>
                
                <Link href="/register">
                  <Button variant="primary" size="sm" className="shadow-glow ml-2">
                    {tRegister('createAccount')}
                  </Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={toggleLocale}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <span className="font-bold text-sm">{locale.toUpperCase()}</span>
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
