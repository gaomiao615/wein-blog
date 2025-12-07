'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';

interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
  hasAlpha?: boolean;
  channels?: number;
  density?: number;
}

/**
 * 图片代理演示组件
 * 展示如何使用图片代理API和元数据API
 */
export function ImageProxyDemo() {
  const { locale } = useI18n();
  const [imageUrl, setImageUrl] = useState('');
  const [proxyImageUrl, setProxyImageUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 构建代理图片URL
  const getProxyImageUrl = (url: string) => {
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  };

  // 获取图片元数据
  const fetchMetadata = async (url: string) => {
    try {
      const response = await fetch(`/api/image-meta?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.statusText}`);
      }
      const data = await response.json();
      setMetadata(data);
    } catch (err) {
      console.error('Failed to fetch metadata:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch metadata');
    }
  };

  // 处理加载图片
  const handleLoadImage = async () => {
    if (!imageUrl.trim()) {
      setError(locale === 'de' ? 'Bitte geben Sie eine URL ein' : 
               locale === 'zh' ? '请输入图片URL' : 
               'Please enter an image URL');
      return;
    }

    setLoading(true);
    setError(null);
    setMetadata(null);

    try {
      // 验证URL格式
      new URL(imageUrl);
      
      // 设置代理图片URL
      const proxyUrl = getProxyImageUrl(imageUrl);
      setProxyImageUrl(proxyUrl);

      // 获取元数据
      await fetchMetadata(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid URL');
      setProxyImageUrl(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-bold mb-4">
        {locale === 'de' ? 'Bild-Proxy-Demo' : locale === 'zh' ? '图片代理演示' : 'Image Proxy Demo'}
      </h3>

      {/* URL输入 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {locale === 'de' ? 'Bild-URL' : locale === 'zh' ? '图片链接' : 'Image URL'}
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleLoadImage()}
          />
          <button
            onClick={handleLoadImage}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading 
              ? (locale === 'de' ? 'Lädt...' : locale === 'zh' ? '加载中...' : 'Loading...')
              : (locale === 'de' ? 'Laden' : locale === 'zh' ? '加载' : 'Load')}
          </button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* 图片显示 */}
      {proxyImageUrl && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            {locale === 'de' ? 'Bild (über Proxy)' : locale === 'zh' ? '图片（通过代理）' : 'Image (via Proxy)'}
          </h4>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex items-center justify-center">
            <img
              src={proxyImageUrl}
              alt="Proxied image"
              className="max-w-full max-h-96 object-contain rounded-lg"
              onError={(e) => {
                setError(locale === 'de' ? 'Bild konnte nicht geladen werden' : 
                         locale === 'zh' ? '图片加载失败' : 
                         'Failed to load image');
              }}
            />
          </div>
        </div>
      )}

      {/* 元数据展示 */}
      {metadata && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            {locale === 'de' ? 'Bild-Metadaten' : locale === 'zh' ? '图片元数据' : 'Image Metadata'}
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">
                {locale === 'de' ? 'Breite' : locale === 'zh' ? '宽度' : 'Width'}:
              </span>
              <span className="ml-2 font-semibold">{metadata.width}px</span>
            </div>
            <div>
              <span className="text-gray-600">
                {locale === 'de' ? 'Höhe' : locale === 'zh' ? '高度' : 'Height'}:
              </span>
              <span className="ml-2 font-semibold">{metadata.height}px</span>
            </div>
            <div>
              <span className="text-gray-600">
                {locale === 'de' ? 'Format' : locale === 'zh' ? '格式' : 'Format'}:
              </span>
              <span className="ml-2 font-semibold">{metadata.format}</span>
            </div>
            <div>
              <span className="text-gray-600">
                {locale === 'de' ? 'Größe' : locale === 'zh' ? '大小' : 'Size'}:
              </span>
              <span className="ml-2 font-semibold">
                {(metadata.size / 1024).toFixed(2)} KB
              </span>
            </div>
            {metadata.hasAlpha !== undefined && (
              <div>
                <span className="text-gray-600">
                  {locale === 'de' ? 'Alpha-Kanal' : locale === 'zh' ? '透明通道' : 'Alpha Channel'}:
                </span>
                <span className="ml-2 font-semibold">
                  {metadata.hasAlpha ? 'Yes' : 'No'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-800">
        <p className="font-semibold mb-1">
          {locale === 'de' ? 'Wie es funktioniert:' : locale === 'zh' ? '工作原理：' : 'How it works:'}
        </p>
        <p className="text-xs">
          {locale === 'de' 
            ? 'Der Server lädt das Bild im Hintergrund und leitet es an den Browser weiter. Dadurch wird das CORS-Problem umgangen, da der Server keine CORS-Beschränkungen hat.'
            : locale === 'zh'
            ? '服务器在后台加载图片并转发给浏览器。这样可以绕过CORS限制，因为服务器不受CORS限制。'
            : 'The server fetches the image in the background and forwards it to the browser. This bypasses CORS restrictions since servers are not subject to CORS policies.'}
        </p>
      </div>
    </div>
  );
}

