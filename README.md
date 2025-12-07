# Wein Blog - Wine & German Learning

A Next.js blog application for wine lovers and German learners, with full internationalization support (EN/DE/ZH).

## Features

- 🌍 Full i18n support (English, German, Chinese)
- 🍷 Wine catalog with filtering
- 📝 Personal notes and ratings
- 💬 Comments system
- 🎨 Modern UI with Tailwind CSS

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## i18n Setup

The project uses a custom i18n solution built with React Context API.

### File Structure

```
/locales
  - en.json
  - de.json
  - zh.json

/lib/i18n
  - types.ts          # TypeScript types for translations
  - translations.ts   # Translation loader
  - context.tsx       # I18nProvider and useI18n hook

/components
  - LanguageSwitcher.tsx
```

### Usage in Components

```tsx
'use client';

import { useI18n } from '@/lib/i18n/context';

export function MyComponent() {
  const { t } = useI18n();
  
  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.subtitle')}</p>
    </div>
  );
}
```

### Changing Default Language

Edit `/lib/i18n/context.tsx`:

```tsx
const DEFAULT_LOCALE: Locale = 'en'; // Change to 'de' or 'zh'
```

The selected language is persisted in `localStorage` with the key `wein-blog-locale`.

### Adding New Translation Keys

1. Add the key to all three locale files (`/locales/en.json`, `/locales/de.json`, `/locales/zh.json`)
2. Update the TypeScript type in `/lib/i18n/types.ts`
3. Use the key in your components with `t('your.key.path')`

Example:

**en.json:**
```json
{
  "newSection": {
    "title": "New Title"
  }
}
```

**types.ts:**
```ts
export interface Translations {
  // ... existing keys
  newSection: {
    title: string;
  };
}
```

**Component:**
```tsx
const { t } = useI18n();
<h1>{t('newSection.title')}</h1>
```

## Project Structure

```
/app
  /wines
    page.tsx              # Wine list with filters
    /[id]
      page.tsx            # Wine detail page
      /comments
        page.tsx          # Comments section

/components
  - Navbar.tsx
  - Hero.tsx
  - WineFilters.tsx
  - WineDetail.tsx
  - Comments.tsx
  - LanguageSwitcher.tsx
  - Toast.tsx
```

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React 18

