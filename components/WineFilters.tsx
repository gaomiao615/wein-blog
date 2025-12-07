'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';

interface WineFiltersProps {
  onFilterChange?: (filters: WineFilterState) => void;
  onCollectionToggle?: (showCollection: boolean) => void;
  columns?: 2 | 3;
  onColumnsChange?: (columns: 2 | 3) => void;
}

export interface WineFilterState {
  color: string[];
  style: string[];
  price: string[];
}

export function WineFilters({ onFilterChange, onCollectionToggle, columns = 2, onColumnsChange }: WineFiltersProps) {
  const { t, locale } = useI18n();
  const [filters, setFilters] = useState<WineFilterState>({
    color: [],
    style: [],
    price: [],
  });
  const [showCollectionOnly, setShowCollectionOnly] = useState(false);

  const toggleFilter = (category: keyof WineFilterState, value: string) => {
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [category]: prev[category].includes(value)
          ? prev[category].filter((v) => v !== value)
          : [...prev[category], value],
      };
      // 实时应用筛选，无需点击"应用"按钮
      onFilterChange?.(newFilters);
      return newFilters;
    });
  };

  const resetFilters = () => {
    const emptyFilters: WineFilterState = {
      color: [],
      style: [],
      price: [],
    };
    setFilters(emptyFilters);
    onFilterChange?.(emptyFilters);
  };

  const handleCollectionToggle = () => {
    const newValue = !showCollectionOnly;
    setShowCollectionOnly(newValue);
    onCollectionToggle?.(newValue);
  };

  return (
    <div>
      <div className="bg-white border-4 border-gray-900 rounded-xl p-6 shadow-[6px_6px_0_0_rgba(0,0,0,0.1)] mb-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-3xl font-black text-gray-900">{t('wines.listTitle')}</h2>
          <div className="flex items-center gap-2">
            {/* 布局切换按钮 */}
            <div className="flex items-center gap-1 bg-gray-100 border-2 border-gray-900 rounded-lg p-1">
              <button
                onClick={() => onColumnsChange?.(2)}
                className={`px-3 py-1.5 rounded-md text-xs font-black transition-colors ${
                  columns === 2
                    ? 'bg-blue-500 text-white shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
                title={locale === 'de' ? '2 Spalten' : locale === 'zh' ? '两排显示' : '2 Columns'}
              >
                2
              </button>
              <button
                onClick={() => onColumnsChange?.(3)}
                className={`px-3 py-1.5 rounded-md text-xs font-black transition-colors ${
                  columns === 3
                    ? 'bg-blue-500 text-white shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
                title={locale === 'de' ? '3 Spalten' : locale === 'zh' ? '三排显示' : '3 Columns'}
              >
                3
              </button>
            </div>
            <button
              onClick={handleCollectionToggle}
              className={`px-4 py-2 border-2 border-gray-900 rounded-lg font-black text-sm transition-colors shadow-[3px_3px_0_0_rgba(0,0,0,0.2)] ${
                showCollectionOnly
                  ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              ⭐ {t('wines.showCollection')}
            </button>
          </div>
        </div>
      
        {/* 精简的筛选选项 - 分成三排显示 */}
        <div className="space-y-4">
          {/* Color Filter - 第一排 */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-black text-gray-700 min-w-[80px]">{t('wines.color')}:</span>
            <div className="flex gap-2 flex-wrap">
              {['Red', 'White', 'Rose'].map((color) => (
                <button
                  key={color}
                  onClick={() => toggleFilter('color', color.toLowerCase())}
                  className={`px-4 py-2 border-2 border-gray-900 rounded-lg text-sm font-black transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] ${
                    filters.color.includes(color.toLowerCase())
                      ? color.toLowerCase() === 'red' ? 'bg-red-500 text-white' :
                        color.toLowerCase() === 'white' ? 'bg-yellow-200 text-gray-900' :
                        'bg-pink-400 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {t(`wines.color${color}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Style Filter - 第二排 */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-black text-gray-700 min-w-[80px]">{t('wines.style')}:</span>
            <div className="flex gap-2 flex-wrap">
              {['Still', 'Sparkling', 'Fortified'].map((style) => (
                <button
                  key={style}
                  onClick={() => toggleFilter('style', style.toLowerCase())}
                  className={`px-4 py-2 border-2 border-gray-900 rounded-lg text-sm font-black transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] ${
                    filters.style.includes(style.toLowerCase())
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {t(`wines.style${style}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter - 第三排 */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-black text-gray-700 min-w-[80px]">{t('wines.price')}:</span>
            <div className="flex gap-2 flex-wrap">
              {['Budget', 'Mid', 'Premium'].map((price) => (
                <button
                  key={price}
                  onClick={() => toggleFilter('price', price.toLowerCase())}
                  className={`px-4 py-2 border-2 border-gray-900 rounded-lg text-sm font-black transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] ${
                    filters.price.includes(price.toLowerCase())
                      ? price.toLowerCase() === 'premium' ? 'bg-purple-500 text-white' :
                        price.toLowerCase() === 'mid' ? 'bg-blue-500 text-white' :
                        'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {t(`wines.price${price}`)}
                </button>
              ))}
            </div>
            {/* 重置按钮放在第三排右侧 */}
            {(filters.color.length > 0 || filters.style.length > 0 || filters.price.length > 0) && (
              <button
                onClick={resetFilters}
                className="ml-auto px-4 py-2 bg-gray-200 border-2 border-gray-900 rounded-lg text-sm font-black text-gray-900 hover:bg-gray-300 transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]"
              >
                {t('wines.filtersReset')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

