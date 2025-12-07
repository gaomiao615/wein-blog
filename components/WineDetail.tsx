'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { getWineBottleSVG } from '@/lib/wines/imageExtractor';

interface WineDetailProps {
  wine: {
    name: string;
    country?: string;
    region?: string;
    grapes?: string[];
    tasting?: string;
    pairing?: string;
    personalNotes?: string;
    inCollection?: boolean;
    rating?: number;
    imageUrl?: string;
    sourceUrl?: string;
  };
  onToggleCollection?: () => void;
  onSaveNotes?: (notes: string) => void;
}

export function WineDetail({ wine, onToggleCollection, onSaveNotes }: WineDetailProps) {
  const { t } = useI18n();
  const [notes, setNotes] = useState(wine.personalNotes || '');
  const [imageUrl, setImageUrl] = useState<string | null>(
    wine.imageUrl || getWineBottleSVG(wine.name)
  );
  const [imageError, setImageError] = useState(false);

  // 如果没有图片URL，使用占位符
  useEffect(() => {
    if (!wine.imageUrl) {
      setImageUrl(getWineBottleSVG(wine.name));
    } else {
      setImageUrl(wine.imageUrl);
    }
  }, [wine.imageUrl, wine.name]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{t('wines.detailsTitle')}</h1>
      
      <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
        {/* 图片和标题区域 */}
        <div className="flex flex-col md:flex-row gap-6">
          {imageUrl && (
            <div className="flex-shrink-0">
              <img
                src={imageUrl}
                alt={wine.name}
                className="w-full md:w-64 h-auto rounded-lg object-cover shadow-md border border-gray-200"
                onError={(e) => {
                  // 如果图片加载失败，使用SVG占位符
                  if (!imageError) {
                    setImageError(true);
                    setImageUrl(getWineBottleSVG(wine.name));
                  }
                }}
              />
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-4">{wine.name}</h2>
            {wine.sourceUrl && (
              <div className="mb-4">
                <a
                  href={wine.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {t('wines.viewSource')}
                </a>
                <p className="text-xs text-gray-500 mt-1 break-all max-w-md">{wine.sourceUrl}</p>
              </div>
            )}
          </div>
        </div>

        {wine.country && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              {t('wines.country')}
            </h3>
            <p className="text-gray-900">{wine.country}</p>
          </div>
        )}

        {wine.region && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              {t('wines.region')}
            </h3>
            <p className="text-gray-900">{wine.region}</p>
          </div>
        )}

        {wine.grapes && wine.grapes.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              {t('wines.grapes')}
            </h3>
            <p className="text-gray-900">{wine.grapes.join(', ')}</p>
          </div>
        )}

        {wine.tasting && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              {t('wines.tasting')}
            </h3>
            <p className="text-gray-900">{wine.tasting}</p>
          </div>
        )}

        {wine.pairing && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              {t('wines.pairing')}
            </h3>
            <p className="text-gray-900">{wine.pairing}</p>
          </div>
        )}

        {wine.rating !== undefined && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              {t('wines.myRating')}
            </h3>
            <p className="text-gray-900">{wine.rating}/5</p>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            {t('wines.personalNotes')}
          </h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 border rounded-md min-h-[100px]"
            placeholder={t('wines.personalNotes')}
          />
          <button
            onClick={() => onSaveNotes?.(notes)}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {t('buttons.save')}
          </button>
        </div>

        <button
          onClick={onToggleCollection}
          className={`px-4 py-2 rounded-md ${
            wine.inCollection
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {wine.inCollection
            ? t('wines.removeFromCollection')
            : t('wines.addToCollection')}
        </button>
      </div>
    </div>
  );
}

