'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import type { CustomDialogue } from '@/lib/learning/customVocabulary';

interface AddDialogueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dialogue: Omit<CustomDialogue, 'id'>) => void;
  scenario?: string;
}

export function AddDialogueModal({ isOpen, onClose, onSave, scenario }: AddDialogueModalProps) {
  const { locale } = useI18n();
  const [formData, setFormData] = useState({
    en: '',
    de: '',
    zh: '',
    scenario: scenario || '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.de && formData.en && formData.zh) {
      onSave(formData);
      setFormData({ en: '', de: '', zh: '', scenario: scenario || '' });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-4 border-gray-900 rounded-xl p-6 shadow-[8px_8px_0_0_rgba(0,0,0,0.2)] max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-black text-gray-900 mb-2">
          {locale === 'de' ? 'Neuen Dialog hinzufügen' : locale === 'zh' ? '添加新对话' : 'Add New Dialogue'}
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          {locale === 'de' ? 'Fügen Sie einen deutschen Satz hinzu, den Sie lernen möchten' : 
           locale === 'zh' ? '添加您想学习的德语句子' : 
           'Add a German sentence you want to learn'}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 第一步：德语句子 */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
            <label className="block text-sm font-black text-blue-900 mb-1">
              {locale === 'de' ? '1. Deutscher Satz (您看到的德语句子)' : 
               locale === 'zh' ? '1. 德语句子（您看到的德语句子）' : 
               '1. German Sentence (The German sentence you see)'} *
            </label>
            <textarea
              value={formData.de}
              onChange={(e) => setFormData({ ...formData, de: e.target.value })}
              placeholder={locale === 'zh' ? '例如：Können Sie einen Wein empfehlen?' : 'e.g., Können Sie einen Wein empfehlen?'}
              className="w-full px-4 py-2 border-2 border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium min-h-[80px] bg-white"
              required
            />
          </div>

          {/* 第二步：英语翻译 */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-3">
            <label className="block text-sm font-black text-purple-900 mb-1">
              {locale === 'de' ? '2. Englische Übersetzung (对应的英语意思)' : 
               locale === 'zh' ? '2. 英语翻译（对应的英语意思）' : 
               '2. English Translation (Corresponding English meaning)'} *
            </label>
            <textarea
              value={formData.en}
              onChange={(e) => setFormData({ ...formData, en: e.target.value })}
              placeholder={locale === 'zh' ? '例如：Could you recommend a wine?' : 'e.g., Could you recommend a wine?'}
              className="w-full px-4 py-2 border-2 border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium min-h-[80px] bg-white"
              required
            />
          </div>

          {/* 第三步：中文翻译 */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
            <label className="block text-sm font-black text-green-900 mb-1">
              {locale === 'de' ? '3. Chinesische Übersetzung (对应的中文意思)' : 
               locale === 'zh' ? '3. 中文翻译（对应的中文意思）' : 
               '3. Chinese Translation (Corresponding Chinese meaning)'} *
            </label>
            <textarea
              value={formData.zh}
              onChange={(e) => setFormData({ ...formData, zh: e.target.value })}
              placeholder={locale === 'zh' ? '例如：您能推荐一款酒吗？' : 'e.g., 您能推荐一款酒吗？'}
              className="w-full px-4 py-2 border-2 border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-medium min-h-[80px] bg-white"
              required
            />
          </div>

          {scenario && (
            <div>
              <label className="block text-sm font-black text-gray-700 mb-1">
                {locale === 'de' ? 'Szenario' : locale === 'zh' ? '场景' : 'Scenario'}
              </label>
              <input
                type="text"
                value={formData.scenario}
                onChange={(e) => setFormData({ ...formData, scenario: e.target.value })}
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

