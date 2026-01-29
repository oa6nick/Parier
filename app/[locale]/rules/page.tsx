import React from 'react';
import { useTranslations } from 'next-intl';

export default function RulesPage() {
  const t = useTranslations('Rules');

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('title')}</h1>
      
      <div className="space-y-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('basics.title')}</h2>
          <p className="text-gray-600 mb-4">{t('basics.description')}</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>{t('basics.point1')}</li>
            <li>{t('basics.point2')}</li>
            <li>{t('basics.point3')}</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('settlement.title')}</h2>
          <p className="text-gray-600">{t('settlement.description')}</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('disputes.title')}</h2>
          <p className="text-gray-600">{t('disputes.description')}</p>
        </div>
      </div>
    </div>
  );
}
