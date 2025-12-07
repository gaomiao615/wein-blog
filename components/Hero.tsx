'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';

export function Hero() {
  const { t } = useI18n();

  return (
    <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {t('hero.title')}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {t('hero.subtitle')}
        </p>
        <Link
          href="/blog"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          {t('hero.cta')}
        </Link>
      </div>
    </section>
  );
}

