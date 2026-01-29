import React from 'react';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import { Twitter, Instagram, Send, Github } from 'lucide-react';

export const Footer = () => {
  const t = useTranslations('Footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-24 md:pb-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
                P
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                Parier
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              {t('description')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Send className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">{t('platform')}</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link href="/rules" className="hover:text-primary transition-colors">
                  {t('rules')}
                </Link>
              </li>
              <li>
                <Link href="/rating" className="hover:text-primary transition-colors">
                  {t('leaderboard')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">{t('legal')}</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  {t('terms')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  {t('privacy')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Subscribe/Newsletter (Visual only for now) */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">{t('stayUpdated')}</h3>
            <p className="text-gray-500 text-sm mb-4">
              {t('newsletterDesc')}
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder={t('emailPlaceholder')}
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <button className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
                {t('subscribe')}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {currentYear} Parier. {t('rightsReserved')}
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span>English</span>
            <span>Русский</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
