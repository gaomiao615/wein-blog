'use client';

import { useI18n } from '@/lib/i18n/context';
import type { Wine } from '@/lib/wines/data';

interface WineLearningProps {
  wine: Wine;
}

export function WineLearning({ wine }: WineLearningProps) {
  const { locale } = useI18n();

  // 获取多语言名称
  const wineName = locale === 'de' && wine.nameDe ? wine.nameDe :
                   locale === 'zh' && wine.nameZh ? wine.nameZh :
                   wine.name;

  const wineNameEn = wine.name;
  const wineNameDe = wine.nameDe || wine.name;
  const wineNameZh = wine.nameZh || wine.name;

  // 获取多语言葡萄品种
  const grapes = locale === 'de' && wine.grapesDe ? wine.grapesDe :
                 locale === 'zh' && wine.grapesZh ? wine.grapesZh :
                 wine.grapes;

  const grapesEn = wine.grapes;
  const grapesDe = wine.grapesDe || wine.grapes;
  const grapesZh = wine.grapesZh || wine.grapes;

  // 获取多语言地区
  const region = locale === 'de' && wine.regionDe ? wine.regionDe :
                 locale === 'zh' && wine.regionZh ? wine.regionZh :
                 wine.region;

  const regionEn = wine.region;
  const regionDe = wine.regionDe || wine.region;
  const regionZh = wine.regionZh || wine.region;

  // 获取多语言国家
  const country = locale === 'de' && wine.countryDe ? wine.countryDe :
                  locale === 'zh' && wine.countryZh ? wine.countryZh :
                  wine.country;

  const countryEn = wine.country;
  const countryDe = wine.countryDe || wine.country;
  const countryZh = wine.countryZh || wine.country;

  // 获取多语言品鉴描述
  const tasting = locale === 'de' && wine.tastingDe ? wine.tastingDe :
                  locale === 'zh' && wine.tastingZh ? wine.tastingZh :
                  wine.tasting;

  const tastingEn = wine.tasting;
  const tastingDe = wine.tastingDe || wine.tasting;
  const tastingZh = wine.tastingZh || wine.tasting;

  // 获取多语言配餐建议
  const pairing = locale === 'de' && wine.pairingDe ? wine.pairingDe :
                  locale === 'zh' && wine.pairingZh ? wine.pairingZh :
                  wine.pairing;

  const pairingEn = wine.pairing;
  const pairingDe = wine.pairingDe || wine.pairing;
  const pairingZh = wine.pairingZh || wine.pairing;

  // 构建学习词汇表
  const vocabulary = [
    {
      term: wineNameEn,
      de: wineNameDe,
      zh: wineNameZh,
      category: 'Wine Name'
    },
    ...grapes.map((grape, idx) => ({
      term: grapesEn[idx],
      de: grapesDe[idx],
      zh: grapesZh[idx],
      category: 'Grape Variety'
    })),
    {
      term: regionEn,
      de: regionDe,
      zh: regionZh,
      category: 'Region'
    },
    {
      term: countryEn,
      de: countryDe,
      zh: countryZh,
      category: 'Country'
    }
  ];

  // 常用葡萄酒术语
  const wineTerms = [
    { en: 'Dry', de: 'Trocken', zh: '干型' },
    { en: 'Sweet', de: 'Süß', zh: '甜型' },
    { en: 'Light', de: 'Leicht', zh: '轻盈' },
    { en: 'Full-bodied', de: 'Körperreich', zh: '饱满' },
    { en: 'Acidity', de: 'Säure', zh: '酸度' },
    { en: 'Tannin', de: 'Tannin', zh: '单宁' },
    { en: 'Aroma', de: 'Aroma', zh: '香气' },
    { en: 'Finish', de: 'Abgang', zh: '余味' },
  ];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 mb-6 border border-purple-200">
      <h2 className="text-2xl font-bold mb-4 text-purple-800">
        {locale === 'de' ? 'Wein-Lernen' : locale === 'zh' ? '葡萄酒学习' : 'Wine Learning'}
      </h2>

      {/* 词汇表 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-purple-700">
          {locale === 'de' ? 'Wichtige Begriffe' : locale === 'zh' ? '重要词汇' : 'Key Vocabulary'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {vocabulary.map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-500 mb-1">{item.category}</div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-800">{item.term}</span>
                <span className="text-purple-600">→</span>
                <span className="text-blue-600">{item.de}</span>
                <span className="text-purple-600">→</span>
                <span className="text-green-600">{item.zh}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 品鉴描述对比 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-purple-700">
          {locale === 'de' ? 'Geschmacksbeschreibung' : locale === 'zh' ? '品鉴描述' : 'Tasting Notes'}
        </h3>
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">English</div>
            <p className="text-gray-800">{tastingEn}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">Deutsch</div>
            <p className="text-blue-700">{tastingDe}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">中文</div>
            <p className="text-green-700">{tastingZh}</p>
          </div>
        </div>
      </div>

      {/* 配餐建议对比 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-purple-700">
          {locale === 'de' ? 'Essensempfehlungen' : locale === 'zh' ? '配餐建议' : 'Food Pairing'}
        </h3>
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">English</div>
            <p className="text-gray-800">{pairingEn}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">Deutsch</div>
            <p className="text-blue-700">{pairingDe}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">中文</div>
            <p className="text-green-700">{pairingZh}</p>
          </div>
        </div>
      </div>

      {/* 常用术语 */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-purple-700">
          {locale === 'de' ? 'Häufige Weintermine' : locale === 'zh' ? '常用术语' : 'Common Wine Terms'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {wineTerms.map((term, idx) => (
            <div key={idx} className="bg-white rounded-lg p-2 shadow-sm text-center">
              <div className="text-sm font-semibold text-gray-800">{term.en}</div>
              <div className="text-xs text-blue-600">{term.de}</div>
              <div className="text-xs text-green-600">{term.zh}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

