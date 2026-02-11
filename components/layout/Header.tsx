'use client';

import React from 'react';
import { Link, usePathname, useRouter } from '@/navigation';
import { Plus, User, Menu, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/lib/hooks/useAuth';

export const Header: React.FC = () => {
    const pathname = usePathname();
    const auth = useAuth();
    const t = useTranslations('Navigation');
    const locale = useLocale();
    const router = useRouter();

    const navItems = [
        { href: '/', label: t('feed') },
        { href: '/rating', label: t('ranking') },
        { href: '/profile', label: t('profile'), isAuthenticated: true },
        { href: '/login', label: t('login'), isAuthenticated: false, onClick: auth.login },
        { href: '/logout', label: t('logout'), isAuthenticated: true, onClick: auth.logout },
    ];

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
                        {navItems
                            .filter((item) =>
                                typeof item.isAuthenticated === 'boolean'
                                    ? auth.isAuthenticated === item.isAuthenticated
                                    : true,
                            )
                            .map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={item.onClick}
                                        className={cn(
                                            'px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
                                            isActive
                                                ? 'text-primary bg-primary/5'
                                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50',
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        <div className="w-px h-6 bg-gray-200 mx-2"></div>

                        <button
                            onClick={toggleLocale}
                            className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 flex items-center gap-1"
                        >
                            <Globe className="w-4 h-4" />
                            {locale.toUpperCase()}
                        </button>

                        {auth.isAuthenticated && (
                            <Link href="/create">
                                <Button variant="primary" size="sm" className="shadow-glow ml-2">
                                    <Plus className="w-4 h-4" /> {t('create')}
                                </Button>
                            </Link>
                        )}
                    </nav>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center gap-2">
                        <button onClick={toggleLocale} className="p-2 text-gray-600 hover:text-gray-900">
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
