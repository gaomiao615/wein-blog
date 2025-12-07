'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Navbar() {
  const { t } = useI18n();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Wein Blog
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/" className="text-gray-700 hover:text-gray-900" suppressHydrationWarning>
                {t('nav.home')}
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-gray-900" suppressHydrationWarning>
                {t('nav.blog')}
              </Link>
              <Link href="/wines" className="text-gray-700 hover:text-gray-900" suppressHydrationWarning>
                {t('nav.wines')}
              </Link>
              <Link href="/learning" className="text-gray-700 hover:text-gray-900" suppressHydrationWarning>
                {t('nav.learning')}
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-gray-900" suppressHydrationWarning>
                {t('nav.about')}
              </Link>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}

