'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Link, usePathname, useRouter } from '@/navigation';
import { Plus, User, Menu, X, Globe, Wallet, LogOut, Bell } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useTranslations, useLocale, useFormatter } from 'next-intl';
import { getTokenBalance } from '@/lib/mockData/wallet';
import { useAuth } from '@/lib/hooks/useAuth';

const HeaderContent: React.FC = () => {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);
    const t = useTranslations('Navigation');
    const tLogin = useTranslations('Login');
    const tRegister = useTranslations('Register');
    const locale = useLocale();
    const router = useRouter();
    const format = useFormatter();

    const { session, isAuthenticated, logout, login } = useAuth();
    const balance = session ? getTokenBalance(session.id!) : { balance: 0 };

    const navItems = [
        { href: '/', label: t('feed') },
        { href: '/rating', label: t('ranking') },
        { href: '/rules', label: 'Rules' }, // Added Rules for better nav balance
    ] as { href: string; label: string; onClick?: (event: React.MouseEvent<HTMLElement>) => void }[];

    if (isAuthenticated) {
        navItems.push({ href: '/profile', label: t('profile') });
    }

    const toggleLocale = () => {
        const newLocale = locale === 'en' ? 'ru' : 'en';
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100/50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Left: Logo */}
                    <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
                        <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg shadow-gray-900/10 group-hover:shadow-gray-900/20 transition-all duration-300">
                            <span className="text-white font-bold text-xl">P</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight hidden sm:block">Parier</span>
                    </Link>

                    {/* Center: Navigation (Desktop) */}
                    <nav className="hidden md:flex items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200',
                                        isActive
                                            ? 'text-gray-900 bg-gray-100/80 font-semibold'
                                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50',
                                    )}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                        {isAuthenticated ? (
                            <>
                                <div className="hidden md:flex items-center gap-2">
                                    <Link href="/wallet">
                                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group">
                                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                <Wallet className="w-3 h-3 text-primary" />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
                                                {format.number(balance.balance)}
                                            </span>
                                        </div>
                                    </Link>

                                    <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all">
                                        <Bell className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="h-6 w-px bg-gray-200 hidden md:block mx-1"></div>

                                <Link href="/create" className="hidden md:block">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        className="h-10 px-6 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 text-sm font-semibold tracking-wide"
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> {t('create')}
                                    </Button>
                                </Link>

                                <div className="flex items-center gap-2">
                                    {/* Mobile Locale Toggle */}
                                    <button
                                        onClick={toggleLocale}
                                        className="flex w-10 h-10 rounded-full items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all uppercase text-xs font-bold border border-transparent hover:border-gray-100"
                                    >
                                        {locale}
                                    </button>

                                    <button
                                        onClick={logout}
                                        className="hidden md:flex w-10 h-10 rounded-full items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                        title={tLogin('signOut')}
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={toggleLocale}
                                    className="hidden md:flex px-3 py-1.5 rounded-full text-xs font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all items-center gap-1 uppercase"
                                >
                                    <Globe className="w-3.5 h-3.5" />
                                    {locale}
                                </button>

                                <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

                                <Link href="/login" onClick={login} className="hidden md:block">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-10 px-5 rounded-full text-sm font-medium hover:bg-gray-50 text-gray-600"
                                    >
                                        {tLogin('signIn')}
                                    </Button>
                                </Link>
                            </>
                        )}

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center gap-2">
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                                aria-label="Open menu"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile drawer overlay */}
            {isMobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-hidden="true"
                    />
                    <div
                        className={cn(
                            'fixed top-0 right-0 bottom-0 z-[60] w-[min(320px,85vw)] max-w-full bg-white shadow-2xl md:hidden',
                            'flex flex-col mobile-drawer-slide-in',
                        )}
                    >
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <span className="text-lg font-bold text-gray-900">Menu</span>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                                aria-label="Close menu"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            'flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors min-h-[48px]',
                                            isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50',
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                            {isAuthenticated && (
                                <>
                                    <div className="h-px bg-gray-100 my-3" />
                                    <Link
                                        href="/wallet"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors min-h-[48px]"
                                    >
                                        <Wallet className="w-5 h-5 text-primary" />
                                        <span>{format.number(balance.balance)} PRR</span>
                                    </Link>
                                    <Link
                                        href="/create"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-primary hover:bg-primary/5 transition-colors min-h-[48px]"
                                    >
                                        <Plus className="w-5 h-5" />
                                        <span>{t('create')}</span>
                                    </Link>
                                    <button
                                        onClick={(event) => {
                                            logout(event);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-colors min-h-[48px] text-left"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>{tLogin('signOut')}</span>
                                    </button>
                                </>
                            )}
                            {!isAuthenticated && (
                                <>
                                    <div className="h-px bg-gray-100 my-3" />
                                    <Link
                                        href="/login"
                                        onClick={(event) => {
                                            setIsMobileMenuOpen(false);
                                            event.preventDefault();
                                            event.stopPropagation();
                                            login(event);
                                        }}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors min-h-[48px]"
                                    >
                                        {tLogin('signIn')}
                                    </Link>
                                </>
                            )}
                            <div className="h-px bg-gray-100 my-3" />
                            <button
                                onClick={(event) => {
                                    toggleLocale();
                                    event.preventDefault();
                                    event.stopPropagation();
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors min-h-[48px] text-left"
                            >
                                <Globe className="w-5 h-5" />
                                <span>
                                    {locale === 'en' ? 'English' : 'Русский'} →{' '}
                                    {locale === 'en' ? 'Русский' : 'English'}
                                </span>
                            </button>
                        </nav>
                    </div>
                </>
            )}
        </header>
    );
};

export const Header: React.FC = () => {
    return (
        <Suspense
            fallback={
                <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-white/80 backdrop-blur-md border-b border-gray-100/50" />
            }
        >
            <HeaderContent />
        </Suspense>
    );
};
