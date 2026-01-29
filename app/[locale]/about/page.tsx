import React from 'react';
import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('About');

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('title')}</h1>
      
      <div className="prose prose-lg max-w-none text-gray-600 space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('mission.title')}</h2>
          <p>{t('mission.description')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('vision.title')}</h2>
          <p>{t('vision.description')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('values.title')}</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>{t('values.transparency')}</strong>: {t('values.transparencyDesc')}</li>
            <li><strong>{t('values.integrity')}</strong>: {t('values.integrityDesc')}</li>
            <li><strong>{t('values.innovation')}</strong>: {t('values.innovationDesc')}</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
