import React from 'react';
import { useTranslations } from 'next-intl';

export default function PrivacyPage() {
  const t = useTranslations('Privacy');

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('title')}</h1>
      
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 prose prose-gray max-w-none">
        <p className="text-gray-500 mb-8">{t('lastUpdated')}: 2025-01-28</p>
        
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">1. {t('collection.title')}</h2>
          <p className="text-gray-600">{t('collection.content')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">2. {t('usage.title')}</h2>
          <p className="text-gray-600">{t('usage.content')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">3. {t('protection.title')}</h2>
          <p className="text-gray-600">{t('protection.content')}</p>
        </section>
      </div>
    </div>
  );
}
