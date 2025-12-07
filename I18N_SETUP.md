# i18n 设置总结

## 文件结构

```
/locales
  ├── en.json          # 英文翻译
  ├── de.json          # 德文翻译
  └── zh.json          # 中文翻译

/lib/i18n
  ├── types.ts         # TypeScript 类型定义
  ├── translations.ts  # 翻译文件加载器
  └── context.tsx      # I18nProvider 和 useI18n hook

/components
  ├── LanguageSwitcher.tsx  # 语言切换组件
  ├── Navbar.tsx           # 导航栏（使用翻译）
  ├── Hero.tsx             # 首页 Hero 区域（使用翻译）
  ├── WineFilters.tsx      # 葡萄酒筛选器（使用翻译）
  ├── WineDetail.tsx       # 葡萄酒详情页（使用翻译）
  ├── Comments.tsx         # 评论组件（使用翻译）
  └── Toast.tsx            # 提示消息（使用翻译）

/app
  └── layout.tsx       # 根布局（包含 I18nProvider）
```

## 代码示例

### 1. Navbar 组件使用翻译

```12:30:components/Navbar.tsx
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
              <Link href="/" className="text-gray-700 hover:text-gray-900">
                {t('nav.home')}
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-gray-900">
                {t('nav.blog')}
              </Link>
              <Link href="/wines" className="text-gray-700 hover:text-gray-900">
                {t('nav.wines')}
              </Link>
              <Link href="/learning" className="text-gray-700 hover:text-gray-900">
                {t('nav.learning')}
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-gray-900">
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
```

### 2. Hero 组件使用翻译

```6:20:components/Hero.tsx
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
```

### 3. WineFilters 组件使用翻译

```53:78:components/WineFilters.tsx
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold mb-6">{t('wines.listTitle')}</h2>
      
      <div className="space-y-6">
        {/* Color Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('wines.color')}
          </label>
          <div className="flex flex-wrap gap-2">
            {['Red', 'White', 'Rose'].map((color) => (
              <button
                key={color}
                onClick={() => toggleFilter('color', color.toLowerCase())}
                className={`px-4 py-2 rounded-md text-sm ${
                  filters.color.includes(color.toLowerCase())
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t(`wines.color${color}`)}
              </button>
            ))}
          </div>
        </div>
```

### 4. Comments 组件使用翻译

```18:50:components/Comments.tsx
export function Comments({ comments = [], onSubmit }: CommentsProps) {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && message.trim()) {
      onSubmit?.(name, message);
      setName('');
      setMessage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">{t('comments.title')}</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="mb-4">
          <label htmlFor="comment-name" className="block text-sm font-medium text-gray-700 mb-2">
            {t('comments.name')}
          </label>
          <input
            id="comment-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="comment-message" className="block text-sm font-medium text-gray-700 mb-2">
            {t('comments.message')}
          </label>
          <textarea
            id="comment-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 border rounded-md min-h-[100px]"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {t('comments.submit')}
        </button>
      </form>
```

## 如何更改默认语言

编辑 `/lib/i18n/context.tsx` 文件，修改 `DEFAULT_LOCALE` 常量：

```tsx
const DEFAULT_LOCALE: Locale = 'en'; // 改为 'de' 或 'zh'
```

用户选择的语言会自动保存到 `localStorage`，下次访问时会自动恢复。

## 如何添加新的翻译键

### 步骤 1: 在所有三个 locale 文件中添加键

**locales/en.json:**
```json
{
  "newSection": {
    "title": "New Title",
    "description": "New Description"
  }
}
```

**locales/de.json:**
```json
{
  "newSection": {
    "title": "Neuer Titel",
    "description": "Neue Beschreibung"
  }
}
```

**locales/zh.json:**
```json
{
  "newSection": {
    "title": "新标题",
    "description": "新描述"
  }
}
```

### 步骤 2: 更新 TypeScript 类型

编辑 `/lib/i18n/types.ts`，在 `Translations` 接口中添加新键：

```tsx
export interface Translations {
  // ... 现有键
  newSection: {
    title: string;
    description: string;
  };
}
```

### 步骤 3: 在组件中使用

```tsx
'use client';

import { useI18n } from '@/lib/i18n/context';

export function MyComponent() {
  const { t } = useI18n();
  
  return (
    <div>
      <h1>{t('newSection.title')}</h1>
      <p>{t('newSection.description')}</p>
    </div>
  );
}
```

## 翻译键结构

所有翻译键使用点号分隔的路径格式，例如：
- `nav.home` → 导航栏的"首页"
- `wines.colorRed` → 葡萄酒筛选中的"红葡萄酒"
- `messages.saved` → 提示消息"保存成功"

完整的键列表请参考 `/locales/en.json` 文件。

