'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { WineDetailModern } from '@/components/WineDetailModern';
import { WineLearning } from '@/components/WineLearning';
import { getWineById } from '@/lib/wines/data';
import { isInCollection, toggleCollection, getWineNotes, saveNotes } from '@/lib/wines/collection';
import { getSourceUrl } from '@/lib/wines/sourceUrls';

interface WineDetailPageProps {
  params: { id: string };
}

export default function WineDetailPage({ params }: WineDetailPageProps) {
  const { id } = params;
  const { locale } = useI18n();
  const wine = getWineById(id);
  const [inCollection, setInCollection] = useState(false);
  const [personalNotes, setPersonalNotes] = useState('');
  const [sourceUrl, setSourceUrl] = useState<string | undefined>(wine?.sourceUrl);

  // 加载收藏状态、笔记和源URL
  useEffect(() => {
    if (wine) {
      setInCollection(isInCollection(wine.id));
      setPersonalNotes(getWineNotes(wine.id));
      // 优先使用保存的源URL，否则使用数据中的源URL
      const savedUrl = getSourceUrl(wine.id);
      setSourceUrl(savedUrl || wine.sourceUrl);
    }
  }, [wine]);

  if (!wine) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Wine Not Found</h1>
        <p className="text-gray-600 mb-8">The wine you're looking for doesn't exist.</p>
      </div>
    );
  }

  // 转换数据格式以匹配 WineDetailModern 组件
  const wineData = {
    name: locale === 'de' && wine.nameDe ? wine.nameDe :
          locale === 'zh' && wine.nameZh ? wine.nameZh :
          wine.name,
    country: locale === 'de' && wine.countryDe ? wine.countryDe :
             locale === 'zh' && wine.countryZh ? wine.countryZh :
             wine.country,
    region: locale === 'de' && wine.regionDe ? wine.regionDe :
            locale === 'zh' && wine.regionZh ? wine.regionZh :
            wine.region,
    grapes: locale === 'de' && wine.grapesDe ? wine.grapesDe :
            locale === 'zh' && wine.grapesZh ? wine.grapesZh :
            wine.grapes,
    tasting: locale === 'de' && wine.tastingDe ? wine.tastingDe :
             locale === 'zh' && wine.tastingZh ? wine.tastingZh :
             wine.tasting,
    pairing: locale === 'de' && wine.pairingDe ? wine.pairingDe :
             locale === 'zh' && wine.pairingZh ? wine.pairingZh :
             wine.pairing,
    personalNotes,
    inCollection,
    rating: undefined,
    imageUrl: wine.imageUrl,
    sourceUrl: sourceUrl,
    year: wine.year,
    alcohol: wine.alcohol,
    color: wine.color,
    style: wine.style,
  };

  const handleToggleCollection = () => {
    const newState = toggleCollection(wine.id);
    setInCollection(newState);
  };

  const handleSaveNotes = (notes: string) => {
    saveNotes(wine.id, notes);
    setPersonalNotes(notes);
  };

  return (
    <div>
      <WineDetailModern
        wine={wineData}
        onToggleCollection={handleToggleCollection}
        onSaveNotes={handleSaveNotes}
        wineId={wine.id}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <WineLearning wine={wine} />
      </div>
    </div>
  );
}

