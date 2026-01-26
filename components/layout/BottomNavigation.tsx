"use client";

import React from "react";
import { Link, usePathname } from "@/navigation";
import {
  Search,
  Users,
  TrendingUp,
  User,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export const BottomNavigation: React.FC = () => {
  const pathname = usePathname();
  const t = useTranslations('Navigation');

  const navItems = [
    { id: "feed", href: "/", icon: Search, label: t('feed') },
    { id: "rating", href: "/rating", icon: Users, label: t('ranking') },
    { id: "trends", href: "/", icon: TrendingUp, label: t('trends') },
    { id: "profile", href: "/profile", icon: User, label: t('profile') },
  ];

  return (
    <nav className="md:hidden fixed bottom-6 left-4 right-4 h-16 bg-white/90 backdrop-blur-xl border border-white/20 shadow-glass rounded-2xl z-50 flex items-center justify-between px-2">
      {navItems.map((item, index) => {
        const isActive = pathname === item.href;
        
        // Add create button in the middle
        if (index === 2) {
          return (
            <React.Fragment key="create-wrapper">
              <div className="relative -top-6">
                <Link href="/create">
                  <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center text-white shadow-glow hover:scale-105 transition-transform duration-200">
                    <Plus className="w-6 h-6" />
                  </div>
                </Link>
              </div>
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-12 h-full gap-1 transition-colors",
                  isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
                )}
              >
                <item.icon className={cn("w-6 h-6", isActive && "fill-current")} />
              </Link>
            </React.Fragment>
          );
        }

        return (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-12 h-full gap-1 transition-colors",
              isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <item.icon className={cn("w-6 h-6", isActive && "fill-current")} />
          </Link>
        );
      })}
    </nav>
  );
};
