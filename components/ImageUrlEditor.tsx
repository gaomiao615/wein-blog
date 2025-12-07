'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';

interface ImageUrlEditorProps {
  currentUrl?: string;
  onSave: (url: string) => void;
  wineId: string;
}

/**
 * 图片URL编辑器组件
 * 允许用户手动输入或编辑图片URL
 */
export function ImageUrlEditor({ currentUrl, onSave, wineId }: ImageUrlEditorProps) {
  const { t, locale } = useI18n();
  const [url, setUrl] = useState(currentUrl || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (url.trim()) {
      // 保存原始URL到localStorage（不保存代理URL）
      const key = `wine-image-${wineId}`;
      const originalUrl = url.trim();
      localStorage.setItem(key, originalUrl);
      // 如果URL是外部链接，使用代理API
      const finalUrl = originalUrl.startsWith('http') 
        ? `/api/image-proxy?url=${encodeURIComponent(originalUrl)}`
        : originalUrl;
      onSave(finalUrl);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setUrl(currentUrl || '');
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="text-xs text-blue-600 hover:text-blue-800 underline"
      >
        {locale === 'de' ? 'Bild-URL bearbeiten' : locale === 'zh' ? '编辑图片链接' : 'Edit Image URL'}
      </button>
    );
  }

  return (
    <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {locale === 'de' ? 'Bild-URL eingeben' : locale === 'zh' ? '输入图片链接' : 'Enter Image URL'}
      </label>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com/wine-image.jpg"
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="mt-2 flex gap-2">
        <button
          onClick={handleSave}
          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t('buttons.save')}
        </button>
        <button
          onClick={handleCancel}
          className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          {locale === 'de' ? 'Abbrechen' : locale === 'zh' ? '取消' : 'Cancel'}
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        {locale === 'de' 
          ? 'Tipp: Sie können die Bild-URL von der Produktseite kopieren (Rechtsklick auf Bild → Bildadresse kopieren)'
          : locale === 'zh'
          ? '提示：您可以从产品页面复制图片链接（右键点击图片 → 复制图片地址）'
          : 'Tip: You can copy the image URL from the product page (Right-click image → Copy image address)'}
      </p>
    </div>
  );
}

