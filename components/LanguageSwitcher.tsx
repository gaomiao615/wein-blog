'use client';

import { useI18n } from '@/lib/i18n/context';
import type { Locale } from '@/lib/i18n/types';

const localeLabels: Record<Locale, string> = {
  en: 'EN',
  de: 'DE',
  zh: '中文',
};

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center gap-2">
      {(['en', 'de', 'zh'] as Locale[]).map((loc) => (
        <button
          key={loc}
          onClick={() => setLocale(loc)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            locale === loc
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          aria-label={`Switch to ${localeLabels[loc]}`}
        >
          {localeLabels[loc]}
        </button>
      ))}
    </div>
  );
}

