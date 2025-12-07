// Load translations dynamically
import type { Translations } from './types';
import enTranslations from '@/locales/en.json';
import deTranslations from '@/locales/de.json';
import zhTranslations from '@/locales/zh.json';

export const translations: Record<'en' | 'de' | 'zh', Translations> = {
  en: enTranslations as Translations,
  de: deTranslations as Translations,
  zh: zhTranslations as Translations,
};

// Helper function to get nested translation value by dot-notation key
export function getTranslation(
  translations: Translations,
  key: string
): string {
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

