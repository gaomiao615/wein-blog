'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { wines } from '@/lib/wines/data';
import { getCollection } from '@/lib/wines/collection';
import { WineCardModern } from './WineCardModern';
import type { Wine } from '@/lib/wines/data';
import type { WineFilterState } from './WineFilters';

interface WineListProps {
  filters?: WineFilterState;
  showCollectionOnly?: boolean;
}

export function WineList({ filters, showCollectionOnly = false }: WineListProps) {
  const { locale } = useI18n();
  const [displayedWines, setDisplayedWines] = useState<Wine[]>([]);
  const [collectionIds, setCollectionIds] = useState<string[]>([]);

  useEffect(() => {
    setCollectionIds(getCollection());
  }, []);

  useEffect(() => {
    let filtered = wines;

    // 如果只显示收藏
    if (showCollectionOnly) {
      filtered = filtered.filter(wine => collectionIds.includes(wine.id));
    }

    // 应用筛选器
    if (filters) {
      if (filters.color.length > 0) {
        filtered = filtered.filter(wine => filters.color.includes(wine.color));
      }
      if (filters.style.length > 0) {
        filtered = filtered.filter(wine => filters.style.includes(wine.style));
      }
      if (filters.sweetness.length > 0) {
        filtered = filtered.filter(wine => filters.sweetness.includes(wine.sweetness));
      }
      if (filters.body.length > 0) {
        filtered = filtered.filter(wine => filters.body.includes(wine.body));
      }
      if (filters.price.length > 0) {
        filtered = filtered.filter(wine => filters.price.includes(wine.price));
      }
    }

    setDisplayedWines(filtered);
  }, [filters, showCollectionOnly, collectionIds]);

  if (displayedWines.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {showCollectionOnly 
          ? (locale === 'de' ? 'Keine Weine in Ihrer Sammlung' : 
             locale === 'zh' ? '您的收藏中还没有葡萄酒' : 
             'No wines in your collection')
          : (locale === 'de' ? 'Keine Weine gefunden' : 
             locale === 'zh' ? '未找到葡萄酒' : 
             'No wines found')}
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {displayedWines.map((wine) => {
        const isCollected = collectionIds.includes(wine.id);
        return (
          <WineCardModern
            key={wine.id}
            wine={wine}
            isCollected={isCollected}
          />
        );
      })}
    </div>
  );
}

