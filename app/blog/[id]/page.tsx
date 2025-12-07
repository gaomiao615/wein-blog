'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { getPostById } from '@/lib/blog/posts';
import type { BlogPost } from '@/lib/blog/posts';

interface BlogDetailPageProps {
  params: { id: string };
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = params;
  const { t, locale } = useI18n();
  const post = getPostById(Number(id));

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{t('blog.articleNotFound')}</h1>
          <p className="text-gray-600 mb-8">{t('blog.articleNotFoundDesc')}</p>
          <Link
            href="/blog"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            {t('blog.backToBlog')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 返回按钮 */}
      <Link
        href="/blog"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        ← {t('buttons.back')}
      </Link>

      {/* 文章标题和元信息 */}
      <article className="bg-white rounded-lg shadow-sm border p-8">
        <h1 className="text-4xl font-bold mb-4">
          {locale === 'de' && post.titleDe
            ? post.titleDe
            : locale === 'zh' && post.titleZh
            ? post.titleZh
            : post.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
          <span>{post.date}</span>
        </div>

        {/* 文章内容 */}
        <div className="prose prose-lg max-w-none mb-8">
          <p className="text-gray-700 leading-relaxed mb-6">
            {locale === 'de' && post.contentDe
              ? post.contentDe
              : locale === 'zh' && post.contentZh
              ? post.contentZh
              : post.content}
          </p>
        </div>

        {/* 葡萄酒产区介绍 */}
        {post.regions && post.regions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">{t('blog.featuredRegions')}</h2>
            <div className="space-y-8">
              {post.regions.map((region, index) => (
                <div
                  key={index}
                  className="border-l-4 border-blue-500 pl-6 py-4 bg-gray-50 rounded-r-lg"
                >
                  <div className="flex items-baseline gap-3 mb-3">
                    <h3 className="text-xl font-semibold">{region.name}</h3>
                    <span className="text-gray-500 text-sm">({region.nameDe})</span>
                  </div>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {locale === 'de'
                      ? region.descriptionDe
                      : locale === 'zh'
                      ? region.descriptionZh
                      : region.description}
                  </p>

                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">{t('blog.famousWines')}:</h4>
                    <div className="flex flex-wrap gap-2">
                      {region.famousWines.map((wine, wineIndex) => (
                        <span
                          key={wineIndex}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {wine}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-1">{t('blog.characteristics')}:</h4>
                    <p className="text-sm text-gray-600">
                      {locale === 'de' && region.characteristicsDe
                        ? region.characteristicsDe
                        : locale === 'zh' && region.characteristicsZh
                        ? region.characteristicsZh
                        : region.characteristics}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 词汇表 */}
        {post.vocabulary && post.vocabulary.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">{t('learning.title')}</h2>
            <div className="bg-white rounded-lg border overflow-hidden">
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
                  {post.vocabulary.map((item, index) => (
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
        )}

        {/* 食物搭配 */}
        {post.pairings && post.pairings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">{t('blog.foodPairing')}</h2>
            <div className="space-y-6">
              {post.pairings.map((pairing, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4 mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {locale === 'de' && pairing.wineDe
                          ? pairing.wineDe
                          : locale === 'zh' && pairing.wineZh
                          ? pairing.wineZh
                          : pairing.wine}
                      </h3>
                      <p className="text-gray-600 text-sm">{t('blog.with')}</p>
                      <h4 className="text-lg font-medium text-gray-800 mt-1">
                        {locale === 'de' && pairing.dishDe
                          ? pairing.dishDe
                          : locale === 'zh' && pairing.dishZh
                          ? pairing.dishZh
                          : pairing.dish}
                      </h4>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {locale === 'de' && pairing.descriptionDe
                      ? pairing.descriptionDe
                      : locale === 'zh' && pairing.descriptionZh
                      ? pairing.descriptionZh
                      : pairing.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 返回博客列表 */}
        <div className="mt-8 pt-6 border-t">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            ← {t('blog.backToBlogList')}
          </Link>
        </div>
      </article>
    </div>
  );
}

