'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import type { CustomTerm } from '@/lib/learning/customVocabulary';

interface AddTermModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (term: Omit<CustomTerm, 'id'>) => void;
  category?: string;
}

export function AddTermModal({ isOpen, onClose, onSave, category }: AddTermModalProps) {
  const { locale } = useI18n();
  const [formData, setFormData] = useState({
    en: '',
    de: '',
    zh: '',
    category: category || '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.de && formData.en && formData.zh) {
      onSave(formData);
      setFormData({ en: '', de: '', zh: '', category: category || '' });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-4 border-gray-900 rounded-xl p-6 shadow-[8px_8px_0_0_rgba(0,0,0,0.2)] max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-black text-gray-900 mb-2">
          {locale === 'de' ? 'Neuen Begriff hinzufügen' : locale === 'zh' ? '添加新术语' : 'Add New Term'}
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          {locale === 'de' ? 'Fügen Sie einen deutschen Begriff hinzu, den Sie lernen möchten' : 
           locale === 'zh' ? '添加您想学习的德语术语' : 
           'Add a German term you want to learn'}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 第一步：德语术语 */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
            <label className="block text-sm font-black text-blue-900 mb-1">
              {locale === 'de' ? '1. Deutscher Begriff (您看到的德语词)' : 
               locale === 'zh' ? '1. 德语术语（您看到的德语词）' : 
               '1. German Term (The German term you see)'} *
            </label>
            <input
              type="text"
              value={formData.de}
              onChange={(e) => setFormData({ ...formData, de: e.target.value })}
              placeholder={locale === 'zh' ? '例如：Trocken' : 'e.g., Trocken'}
              className="w-full px-4 py-2 border-2 border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
              required
            />
          </div>

          {/* 第二步：英语翻译 */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-3">
            <label className="block text-sm font-black text-purple-900 mb-1">
              {locale === 'de' ? '2. Englische Bedeutung (对应的英语意思)' : 
               locale === 'zh' ? '2. 英语翻译（对应的英语意思）' : 
               '2. English Translation (Corresponding English meaning)'} *
            </label>
            <input
              type="text"
              value={formData.en}
              onChange={(e) => setFormData({ ...formData, en: e.target.value })}
              placeholder={locale === 'zh' ? '例如：Dry' : 'e.g., Dry'}
              className="w-full px-4 py-2 border-2 border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium bg-white"
              required
            />
          </div>

          {/* 第三步：中文翻译 */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
            <label className="block text-sm font-black text-green-900 mb-1">
              {locale === 'de' ? '3. Chinesische Bedeutung (对应的中文意思)' : 
               locale === 'zh' ? '3. 中文翻译（对应的中文意思）' : 
               '3. Chinese Translation (Corresponding Chinese meaning)'} *
            </label>
            <input
              type="text"
              value={formData.zh}
              onChange={(e) => setFormData({ ...formData, zh: e.target.value })}
              placeholder={locale === 'zh' ? '例如：干型' : 'e.g., 干型'}
              className="w-full px-4 py-2 border-2 border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-medium bg-white"
              required
            />
          </div>

          {category && (
            <div>
              <label className="block text-sm font-black text-gray-700 mb-1">
                {locale === 'de' ? 'Kategorie' : locale === 'zh' ? '分类' : 'Category'}
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-500 text-white border-2 border-gray-900 rounded-lg font-black hover:bg-green-600 transition-colors shadow-[3px_3px_0_0_rgba(0,0,0,0.2)]"
            >
              {locale === 'de' ? 'Speichern' : locale === 'zh' ? '保存' : 'Save'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 border-2 border-gray-900 rounded-lg font-black hover:bg-gray-300 transition-colors shadow-[3px_3px_0_0_rgba(0,0,0,0.2)]"
            >
              {locale === 'de' ? 'Abbrechen' : locale === 'zh' ? '取消' : 'Cancel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

