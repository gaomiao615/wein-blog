'use client';

import { useI18n } from '@/lib/i18n/context';

// 示例德语词汇数据
const vocabulary = [
  {
    word: 'trocken',
    meaning: 'dry',
    example: 'Dieser Wein ist sehr trocken. (This wine is very dry.)',
  },
  {
    word: 'fruchtig',
    meaning: 'fruity',
    example: 'Ein fruchtiger Weißwein. (A fruity white wine.)',
  },
  {
    word: 'kräftig',
    meaning: 'full-bodied',
    example: 'Ein kräftiger Rotwein. (A full-bodied red wine.)',
  },
  {
    word: 'süß',
    meaning: 'sweet',
    example: 'Ein süßer Dessertwein. (A sweet dessert wine.)',
  },
  {
    word: 'säure',
    meaning: 'acidity',
    example: 'Die Säure ist gut ausbalanciert. (The acidity is well balanced.)',
  },
];

export default function LearningPage() {
  const { t } = useI18n();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('learning.title')}</h1>
        <p className="text-xl text-gray-600">{t('learning.subtitle')}</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('learning.word')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('learning.meaning')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('learning.example')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vocabulary.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.word}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.meaning}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {item.example}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

