'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { getWineImageFromUnsplash } from '@/lib/wines/imageExtractor';
import { WineBottlePlaceholder } from './WineBottlePlaceholder';
import type { Wine } from '@/lib/wines/data';

interface WineCardModernProps {
  wine: Wine;
  isCollected?: boolean;
}

// 国家国旗图标映射
const countryFlags: Record<string, string> = {
  'Germany': '🇩🇪',
  'Spain': '🇪🇸',
  'France': '🇫🇷',
  'Italy': '🇮🇹',
  'USA': '🇺🇸',
  'Deutschland': '🇩🇪',
  'Spanien': '🇪🇸',
  'Frankreich': '🇫🇷',
  'Italien': '🇮🇹',
  '德国': '🇩🇪',
  '西班牙': '🇪🇸',
  '法国': '🇫🇷',
  '意大利': '🇮🇹',
  '美国': '🇺🇸',
};

export function WineCardModern({ wine, isCollected = false }: WineCardModernProps) {
  const { locale } = useI18n();
  const [imageError, setImageError] = useState(false);
  const [usePlaceholder, setUsePlaceholder] = useState(!wine.imageUrl);

  const wineName = locale === 'de' && wine.nameDe ? wine.nameDe :
                   locale === 'zh' && wine.nameZh ? wine.nameZh :
                   wine.name;
  
  const country = locale === 'de' && wine.countryDe ? wine.countryDe :
                  locale === 'zh' && wine.countryZh ? wine.countryZh :
                  wine.country;
  
  const region = locale === 'de' && wine.regionDe ? wine.regionDe :
                 locale === 'zh' && wine.regionZh ? wine.regionZh :
                 wine.region;
  
  const grapes = locale === 'de' && wine.grapesDe ? wine.grapesDe :
                 locale === 'zh' && wine.grapesZh ? wine.grapesZh :
                 wine.grapes;
  
  const tasting = locale === 'de' && wine.tastingDe ? wine.tastingDe :
                  locale === 'zh' && wine.tastingZh ? wine.tastingZh :
                  wine.tasting;

  // 获取图片URL或使用Unsplash
  const imageUrl = wine.imageUrl || getWineImageFromUnsplash(wineName, wine.color);

  // 获取国旗
  const flag = countryFlags[country] || '🍷';

  // 获取颜色标签文本
  const colorText = locale === 'de' ? 
    (wine.color === 'red' ? 'Rotwein' : wine.color === 'white' ? 'Weißwein' : 'Roséwein') :
    locale === 'zh' ?
    (wine.color === 'red' ? '红葡萄酒' : wine.color === 'white' ? '白葡萄酒' : '桃红葡萄酒') :
    (wine.color === 'red' ? 'Red Wine' : wine.color === 'white' ? 'White Wine' : 'Rosé Wine');

  // 格式化价格
  const priceText = locale === 'de' ?
    (wine.price === 'budget' ? 'Günstig' : wine.price === 'mid' ? 'Mittel' : 'Premium') :
    locale === 'zh' ?
    (wine.price === 'budget' ? '亲民' : wine.price === 'mid' ? '中等' : '高端') :
    (wine.price === 'budget' ? 'Budget' : wine.price === 'mid' ? 'Mid-range' : 'Premium');

  return (
    <Link
      href={`/wines/${wine.id}`}
      className="group block bg-white rounded-2xl border-4 border-gray-900 hover:border-blue-500 transition-all duration-200 overflow-hidden shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] hover:shadow-[12px_12px_0_0_rgba(59,130,246,0.2)]"
    >
      <div className="flex flex-col md:flex-row">
        {/* 左侧：酒瓶图片 - 漫画风格 */}
        <div className="flex-shrink-0 w-full md:w-48 bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center p-4 border-r-4 md:border-r-4 md:border-b-0 border-b-4 border-gray-900">
          <div className="relative w-full h-64 md:h-80 flex items-center justify-center">
            {usePlaceholder ? (
              <div className="relative">
                {/* 简单的漫画风格酒瓶 */}
                <div className={`w-24 h-48 md:w-32 md:h-64 rounded-t-3xl rounded-b-lg border-4 border-gray-900 ${
                  wine.color === 'red' ? 'bg-red-500' : 
                  wine.color === 'white' ? 'bg-yellow-200' : 
                  'bg-pink-400'
                } shadow-[4px_4px_0_0_rgba(0,0,0,0.2)]`}>
                  {/* 瓶口 */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gray-300 border-2 border-gray-900 rounded-t-lg"></div>
                  {/* 标签 */}
                  <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white border-2 border-gray-900 rounded-lg flex items-center justify-center">
                    <span className="text-3xl">🍷</span>
                  </div>
                </div>
                {isCollected && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 border-2 border-gray-900 rounded-full p-2 shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] z-10">
                    <span className="text-xl">⭐</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imageUrl}
                  alt={wineName}
                  className="max-w-full max-h-full object-contain border-2 border-gray-900 rounded-lg shadow-[4px_4px_0_0_rgba(0,0,0,0.2)]"
                  onError={(e) => {
                    if (!imageError) {
                      setImageError(true);
                      setUsePlaceholder(true);
                    }
                  }}
                  onLoad={() => {
                    setImageError(false);
                  }}
                />
                {isCollected && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 border-2 border-gray-900 rounded-full p-2 shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] z-10">
                    <span className="text-xl">⭐</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 右侧：详细信息 - 漫画风格 */}
        <div className="flex-1 p-6 flex flex-col justify-between bg-white">
          <div>
            {/* 酒名 - 粗体大字 */}
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 group-hover:text-blue-600 transition-colors" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              {wineName}
            </h3>

            {/* 类型标签 - 漫画风格 */}
            <div className="mb-4">
              <span className={`inline-block px-4 py-2 border-2 border-gray-900 rounded-xl text-sm font-black ${
                wine.color === 'red' ? 'bg-red-500 text-white' : 
                wine.color === 'white' ? 'bg-yellow-200 text-gray-900' : 
                'bg-pink-400 text-white'
              } shadow-[3px_3px_0_0_rgba(0,0,0,0.2)]`}>
                {colorText}
              </span>
            </div>

            {/* 国家/地区 - 大图标 */}
            <div className="flex items-center gap-3 mb-3 text-gray-900">
              <span className="text-4xl">{flag}</span>
              <span className="font-black text-lg">
                {country}{region ? `, ${region}` : ''}
              </span>
            </div>

            {/* 葡萄品种 - 简单标签 */}
            <div className="mb-4">
              <p className="text-base text-gray-800">
                <span className="font-black text-gray-900">
                  {locale === 'de' ? '🍇 Rebsorten' : locale === 'zh' ? '🍇 葡萄品种' : '🍇 Grapes'}:
                </span>{' '}
                <span className="font-bold">{grapes.join(', ')}</span>
              </p>
            </div>

            {/* 描述 - 简单文本 */}
            <div className="mb-4">
              <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 font-medium">
                {tasting}
              </p>
            </div>
          </div>

          {/* 底部：数据点 - 漫画风格标签 */}
          <div className="flex items-center justify-between pt-4 border-t-4 border-gray-900">
            <div className="flex items-center gap-3 text-sm">
              <div className="px-3 py-1 bg-blue-100 border-2 border-gray-900 rounded-lg font-black text-gray-900">
                0.75L
              </div>
              <div className="px-3 py-1 bg-green-100 border-2 border-gray-900 rounded-lg font-black text-gray-900">
                {wine.alcohol || 'N/A'}%
              </div>
              <div className={`px-3 py-1 border-2 border-gray-900 rounded-lg font-black ${
                wine.price === 'premium' ? 'bg-purple-200' : 
                wine.price === 'mid' ? 'bg-blue-200' : 
                'bg-green-200'
              } text-gray-900`}>
                {priceText}
              </div>
            </div>
            <div className="text-blue-600 font-black text-lg group-hover:text-blue-800 transition-colors">
              {locale === 'de' ? '👉 Details' : locale === 'zh' ? '👉 查看详情' : '👉 View Details'}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

