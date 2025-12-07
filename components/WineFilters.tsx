'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';

interface WineFiltersProps {
  onFilterChange?: (filters: WineFilterState) => void;
  onCollectionToggle?: (showCollection: boolean) => void;
}

export interface WineFilterState {
  color: string[];
  style: string[];
  sweetness: string[];
  body: string[];
  price: string[];
}

export function WineFilters({ onFilterChange, onCollectionToggle }: WineFiltersProps) {
  const { t } = useI18n();
  const [filters, setFilters] = useState<WineFilterState>({
    color: [],
    style: [],
    sweetness: [],
    body: [],
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
      onFilterChange?.(newFilters);
      return newFilters;
    });
  };

  const resetFilters = () => {
    const emptyFilters: WineFilterState = {
      color: [],
      style: [],
      sweetness: [],
      body: [],
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
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{t('wines.listTitle')}</h2>
          <button
            onClick={handleCollectionToggle}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              showCollectionOnly
                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ⭐ {t('wines.showCollection')}
          </button>
        </div>
      
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

        {/* Style Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('wines.style')}
          </label>
          <div className="flex flex-wrap gap-2">
            {['Still', 'Sparkling', 'Fortified'].map((style) => (
              <button
                key={style}
                onClick={() => toggleFilter('style', style.toLowerCase())}
                className={`px-4 py-2 rounded-md text-sm ${
                  filters.style.includes(style.toLowerCase())
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t(`wines.style${style}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Sweetness Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('wines.sweetness')}
          </label>
          <div className="flex flex-wrap gap-2">
            {['Dry', 'OffDry', 'Medium', 'Sweet'].map((sweetness) => (
              <button
                key={sweetness}
                onClick={() => toggleFilter('sweetness', sweetness.toLowerCase())}
                className={`px-4 py-2 rounded-md text-sm ${
                  filters.sweetness.includes(sweetness.toLowerCase())
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t(`wines.sweetness${sweetness}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Body Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('wines.body')}
          </label>
          <div className="flex flex-wrap gap-2">
            {['Light', 'Medium', 'Full'].map((body) => (
              <button
                key={body}
                onClick={() => toggleFilter('body', body.toLowerCase())}
                className={`px-4 py-2 rounded-md text-sm ${
                  filters.body.includes(body.toLowerCase())
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t(`wines.body${body}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('wines.price')}
          </label>
          <div className="flex flex-wrap gap-2">
            {['Budget', 'Mid', 'Premium'].map((price) => (
              <button
                key={price}
                onClick={() => toggleFilter('price', price.toLowerCase())}
                className={`px-4 py-2 rounded-md text-sm ${
                  filters.price.includes(price.toLowerCase())
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t(`wines.price${price}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => onFilterChange?.(filters)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {t('wines.filtersApply')}
        </button>
        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          {t('wines.filtersReset')}
        </button>
      </div>
      </div>
    </div>
  );
}

