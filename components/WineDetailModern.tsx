'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { getWineBottleSVG, getWineImageFromUnsplash } from '@/lib/wines/imageExtractor';
import { getWineImageFromSource, getMoevenpickProductImage } from '@/lib/wines/imageFetcher';
import { WineBottlePlaceholder } from './WineBottlePlaceholder';
import { ImageUrlEditor } from './ImageUrlEditor';

/**
 * 使用代理API获取图片URL
 * 这样可以绕过CORS限制
 */
function getProxiedImageUrl(originalUrl: string): string {
  if (!originalUrl) return '';
  return `/api/image-proxy?url=${encodeURIComponent(originalUrl)}`;
}

interface WineDetailModernProps {
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
    year?: number;
    alcohol?: number;
    color?: string;
    style?: string;
    id?: string;
  };
  onToggleCollection?: () => void;
  onSaveNotes?: (notes: string) => void;
  wineId?: string;
}

export function WineDetailModern({ wine, onToggleCollection, onSaveNotes, wineId }: WineDetailModernProps) {
  const { t, locale } = useI18n();
  const [notes, setNotes] = useState(wine.personalNotes || '');
  const [imageUrl, setImageUrl] = useState<string | null>(wine.imageUrl || null);
  const [imageError, setImageError] = useState(false);
  const [usePlaceholder, setUsePlaceholder] = useState(!wine.imageUrl);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  // 从localStorage加载保存的图片URL
  useEffect(() => {
    if (wineId) {
      const savedImageUrl = localStorage.getItem(`wine-image-${wineId}`);
      if (savedImageUrl) {
        // 如果是外部URL，使用代理
        const finalUrl = savedImageUrl.startsWith('http') 
          ? getProxiedImageUrl(savedImageUrl)
          : savedImageUrl;
        setImageUrl(finalUrl);
        setUsePlaceholder(false);
      }
    }
  }, [wineId]);

  useEffect(() => {
    const loadImage = async () => {
      if (wine.imageUrl) {
        // 优先使用数据中的图片URL
        setImageUrl(wine.imageUrl);
        setUsePlaceholder(false);
        return;
      }

      // 如果有源URL，尝试从源URL提取图片
      if (wine.sourceUrl) {
        setIsLoadingImage(true);
        try {
          // 优先尝试Mövenpick Wein的图片提取
          let sourceImage: string | null = null;
          if (wine.sourceUrl.includes('moevenpick-wein.de')) {
            sourceImage = getMoevenpickProductImage(wine.sourceUrl);
          } else {
            sourceImage = await getWineImageFromSource(wine.sourceUrl);
          }
          
          if (sourceImage) {
            // 如果图片URL是外部链接，使用代理API
            const finalImageUrl = sourceImage.startsWith('http') 
              ? getProxiedImageUrl(sourceImage)
              : sourceImage;
            
            // 验证图片是否可访问
            const img = new Image();
            img.onload = () => {
              setImageUrl(finalImageUrl);
              setUsePlaceholder(false);
              setIsLoadingImage(false);
            };
            img.onerror = () => {
              console.log('图片加载失败，尝试备用方案');
              // 如果第一个URL失败，尝试Unsplash
              const unsplashUrl = getWineImageFromUnsplash(wine.name, (wine.color as 'red' | 'white' | 'rose') || 'red');
              setImageUrl(unsplashUrl);
              setIsLoadingImage(false);
            };
            img.src = finalImageUrl;
            return;
          }
        } catch (error) {
          console.error('Failed to load image from source:', error);
        }
        setIsLoadingImage(false);
      }

      // 如果都没有，尝试使用Unsplash
      const unsplashUrl = getWineImageFromUnsplash(wine.name, (wine.color as 'red' | 'white' | 'rose') || 'red');
      setImageUrl(unsplashUrl);
    };

    loadImage();
  }, [wine.imageUrl, wine.sourceUrl, wine.name, wine.color]);

  // 获取颜色文本
  const getColorText = () => {
    if (!wine.color) return '';
    return locale === 'de' ? 
      (wine.color === 'red' ? 'Rotwein' : wine.color === 'white' ? 'Weißwein' : 'Roséwein') :
      locale === 'zh' ?
      (wine.color === 'red' ? '红葡萄酒' : wine.color === 'white' ? '白葡萄酒' : '桃红葡萄酒') :
      (wine.color === 'red' ? 'Red Wine' : wine.color === 'white' ? 'White Wine' : 'Rosé Wine');
  };

  // 获取风格文本
  const getStyleText = () => {
    if (!wine.style) return '';
    return locale === 'de' ?
      (wine.style === 'sparkling' ? 'Sekt' : wine.style === 'fortified' ? 'Likörwein' : 'Still') :
      locale === 'zh' ?
      (wine.style === 'sparkling' ? '起泡酒' : wine.style === 'fortified' ? '加强型' : '静止酒') :
      (wine.style === 'sparkling' ? 'Sparkling' : wine.style === 'fortified' ? 'Fortified' : 'Still');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-black mb-8 text-gray-900 border-b-4 border-gray-900 pb-4">{t('wines.detailsTitle')}</h1>
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* 左侧：酒瓶图片 - 漫画风格 */}
          <div className="flex-shrink-0 w-full lg:w-96 flex items-center justify-center bg-white border-4 border-gray-900 rounded-2xl p-8 lg:p-12 shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]">
            <div className="relative w-full h-96 lg:h-[600px] flex items-center justify-center">
              {isLoadingImage ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 border-4 border-gray-900 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-sm font-bold text-gray-900">
                    {locale === 'de' ? 'Bild wird geladen...' : locale === 'zh' ? '正在加载图片...' : 'Loading image...'}
                  </p>
                </div>
              ) : usePlaceholder ? (
                <div className="relative">
                  {/* 简单的漫画风格酒瓶 */}
                  <div className={`w-32 h-64 lg:w-40 lg:h-80 rounded-t-3xl rounded-b-lg border-4 border-gray-900 ${
                    wine.color === 'red' ? 'bg-red-500' : 
                    wine.color === 'white' ? 'bg-yellow-200' : 
                    'bg-pink-400'
                  } shadow-[6px_6px_0_0_rgba(0,0,0,0.2)]`}>
                    {/* 瓶口 */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gray-300 border-2 border-gray-900 rounded-t-lg"></div>
                    {/* 标签 */}
                    <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-white border-2 border-gray-900 rounded-lg flex items-center justify-center">
                      <span className="text-4xl">🍷</span>
                    </div>
                  </div>
                  {wine.inCollection && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 border-2 border-gray-900 rounded-full p-2 shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] z-10">
                      <span className="text-2xl">⭐</span>
                    </div>
                  )}
                </div>
              ) : imageUrl ? (
                <div className="relative">
                  <img
                    src={imageUrl.startsWith('http') ? getProxiedImageUrl(imageUrl) : imageUrl}
                    alt={wine.name}
                    className="max-w-full max-h-full object-contain border-4 border-gray-900 rounded-lg shadow-[6px_6px_0_0_rgba(0,0,0,0.2)]"
                    onError={(e) => {
                      if (!imageError) {
                        setImageError(true);
                        setUsePlaceholder(true);
                      }
                    }}
                    onLoad={() => {
                      setImageError(false);
                      setIsLoadingImage(false);
                    }}
                  />
                  {wine.inCollection && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 border-2 border-gray-900 rounded-full p-2 shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] z-10">
                      <span className="text-2xl">⭐</span>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
            {/* 图片URL编辑器 */}
            {wineId && (
              <div className="mt-4 text-center">
                <ImageUrlEditor
                  currentUrl={imageUrl || undefined}
                  onSave={(url) => {
                    setImageUrl(url);
                    setUsePlaceholder(false);
                  }}
                  wineId={wineId}
                />
              </div>
            )}
          </div>

          {/* 右侧：详细信息 - 漫画风格 */}
          <div className="flex-1 space-y-6">
            {/* 酒名和基本信息 */}
            <div className="bg-white border-4 border-gray-900 rounded-2xl p-6 shadow-[6px_6px_0_0_rgba(0,0,0,0.1)]">
              <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                {wine.name}
              </h2>
              {wine.sourceUrl && (
                <div className="mt-4">
                  <a
                    href={wine.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white border-2 border-gray-900 rounded-lg font-black hover:bg-blue-600 transition-colors shadow-[3px_3px_0_0_rgba(0,0,0,0.2)]"
                  >
                    <span>🔗</span>
                    {t('wines.viewSource')}
                  </a>
                  <p className="text-xs text-gray-600 mt-2 break-all max-w-2xl font-medium">{wine.sourceUrl}</p>
                </div>
              )}
            </div>

            {/* 信息块区域 - 漫画风格卡片 */}
            <div className="space-y-4">
              {/* 地区信息 */}
              {(wine.country || wine.region) && (
                <div className="bg-white border-4 border-gray-900 rounded-xl p-5 shadow-[4px_4px_0_0_rgba(0,0,0,0.1)]">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-blue-200 border-2 border-gray-900 rounded-xl flex items-center justify-center text-3xl">
                      🌍
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-black text-gray-600 uppercase tracking-wide mb-2">
                        {locale === 'de' ? 'REGION' : locale === 'zh' ? '产区' : 'REGION'}
                      </div>
                      <div className="text-2xl font-black text-gray-900">
                        {wine.country && (
                          <span>{wine.country}</span>
                        )}
                        {wine.country && wine.region && <span>, </span>}
                        {wine.region && <span>{wine.region}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 葡萄品种 */}
              {wine.grapes && wine.grapes.length > 0 && (
                <div className="bg-white border-4 border-gray-900 rounded-xl p-5 shadow-[4px_4px_0_0_rgba(0,0,0,0.1)]">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-purple-200 border-2 border-gray-900 rounded-xl flex items-center justify-center text-3xl">
                      🍇
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-black text-gray-600 uppercase tracking-wide mb-2">
                        {locale === 'de' ? 'REBSORTEN' : locale === 'zh' ? '葡萄品种' : 'GRAPE VARIETIES'}
                      </div>
                      <div className="text-2xl font-black text-gray-900">
                        {wine.grapes.join(', ')}
                      </div>
                      {(wine.color || wine.style) && (
                        <div className="mt-3 flex gap-2">
                          {wine.color && (
                            <span className={`px-4 py-2 border-2 border-gray-900 rounded-lg text-sm font-black ${
                              wine.color === 'red' ? 'bg-red-500 text-white' : 
                              wine.color === 'white' ? 'bg-yellow-200 text-gray-900' : 
                              'bg-pink-400 text-white'
                            } shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]`}>
                              {getColorText()}
                            </span>
                          )}
                          {wine.style && (
                            <span className="px-4 py-2 bg-gray-200 border-2 border-gray-900 rounded-lg text-sm font-black text-gray-900 shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
                              {getStyleText()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 品鉴描述 */}
              {wine.tasting && (
                <div className="bg-white border-4 border-gray-900 rounded-xl p-5 shadow-[4px_4px_0_0_rgba(0,0,0,0.1)]">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-green-200 border-2 border-gray-900 rounded-xl flex items-center justify-center text-3xl">
                      ✨
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-black text-gray-600 uppercase tracking-wide mb-2">
                        {locale === 'de' ? 'AROMA & GESCHMACK' : locale === 'zh' ? '香气与风味' : 'AROMA & FLAVOR'}
                      </div>
                      <p className="text-gray-900 leading-relaxed font-medium text-lg">
                        {wine.tasting}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 配餐建议 */}
              {wine.pairing && (
                <div className="bg-white border-4 border-gray-900 rounded-xl p-5 shadow-[4px_4px_0_0_rgba(0,0,0,0.1)]">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-orange-200 border-2 border-gray-900 rounded-xl flex items-center justify-center text-3xl">
                      🍽️
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-black text-gray-600 uppercase tracking-wide mb-2">
                        {locale === 'de' ? 'ESSENSEMPFEHLUNGEN' : locale === 'zh' ? '配餐建议' : 'PAIRING SUGGESTIONS'}
                      </div>
                      <p className="text-gray-900 leading-relaxed font-medium text-lg">
                        {wine.pairing}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 技术信息 */}
              {(wine.year || wine.alcohol) && (
                <div className="bg-white border-4 border-gray-900 rounded-xl p-5 shadow-[4px_4px_0_0_rgba(0,0,0,0.1)]">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-indigo-200 border-2 border-gray-900 rounded-xl flex items-center justify-center text-3xl">
                      📊
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-black text-gray-600 uppercase tracking-wide mb-3">
                        {locale === 'de' ? 'TECHNISCHE DETAILS' : locale === 'zh' ? '技术信息' : 'TECHNICAL DETAILS'}
                      </div>
                      <div className="flex flex-wrap gap-4">
                        {wine.year && (
                          <div className="px-4 py-2 bg-blue-100 border-2 border-gray-900 rounded-lg font-black text-gray-900">
                            <span className="text-xs">{locale === 'de' ? 'Jahrgang' : locale === 'zh' ? '年份' : 'Vintage'}: </span>
                            <span className="text-lg">{wine.year}</span>
                          </div>
                        )}
                        {wine.alcohol && (
                          <div className="px-4 py-2 bg-green-100 border-2 border-gray-900 rounded-lg font-black text-gray-900">
                            <span className="text-xs">{locale === 'de' ? 'Alkohol' : locale === 'zh' ? '酒精度' : 'Alcohol'}: </span>
                            <span className="text-lg">{wine.alcohol}%</span>
                          </div>
                        )}
                        <div className="px-4 py-2 bg-purple-100 border-2 border-gray-900 rounded-lg font-black text-gray-900">
                          <span className="text-xs">{locale === 'de' ? 'Volumen' : locale === 'zh' ? '容量' : 'Volume'}: </span>
                          <span className="text-lg">0.75L</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 个人笔记和收藏 - 漫画风格 */}
            <div className="bg-white border-4 border-gray-900 rounded-xl p-6 shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] space-y-4">
              <div>
                <h3 className="text-lg font-black text-gray-900 mb-3">
                  {t('wines.personalNotes')}
                </h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-4 border-4 border-gray-900 rounded-lg min-h-[100px] focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium text-gray-900"
                  placeholder={t('wines.personalNotes')}
                />
                <button
                  onClick={() => onSaveNotes?.(notes)}
                  className="mt-3 px-6 py-3 bg-green-500 text-white border-2 border-gray-900 rounded-lg hover:bg-green-600 transition-colors font-black shadow-[3px_3px_0_0_rgba(0,0,0,0.2)]"
                >
                  {t('buttons.save')}
                </button>
              </div>

              <button
                onClick={onToggleCollection}
                className={`px-6 py-3 border-2 border-gray-900 rounded-lg font-black transition-colors shadow-[3px_3px_0_0_rgba(0,0,0,0.2)] ${
                  wine.inCollection
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {wine.inCollection ? '❌ ' : '⭐ '}
                {wine.inCollection
                  ? t('wines.removeFromCollection')
                  : t('wines.addToCollection')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

