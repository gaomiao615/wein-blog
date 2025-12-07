'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Locale, Translations } from './types';
import { translations } from './translations';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  translations: Translations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const STORAGE_KEY = 'wein-blog-locale';
const DEFAULT_LOCALE: Locale = 'en';

// Get initial locale from localStorage or default
function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && (stored === 'en' || stored === 'de' || stored === 'zh')) {
    return stored as Locale;
  }
  return DEFAULT_LOCALE;
}

// Helper function to get nested translation value by dot-notation key
function getTranslationValue(translations: Translations, key: string): string {
  const keys = key.split('.');
  let value: any = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k as keyof typeof value];
    } else {
      return key; // Return key if not found
    }
  }
  
  return typeof value === 'string' ? value : key;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  // 始终从默认语言开始，避免服务器和客户端不一致
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [isMounted, setIsMounted] = useState(false);

  // Sync locale changes to localStorage
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newLocale);
    }
  };

  // Translation function
  const t = (key: string): string => {
    return getTranslationValue(translations[locale], key);
  };

  // Hydrate from localStorage on mount (client-side only)
  // 这确保服务器和客户端首次渲染时使用相同的默认语言
  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (stored === 'en' || stored === 'de' || stored === 'zh')) {
      setLocaleState(stored as Locale);
    }
  }, []);

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t,
        translations: translations[locale],
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

