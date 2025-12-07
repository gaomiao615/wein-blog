'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { getAllPosts } from '@/lib/blog/posts';

export default function BlogPage() {
  const { t, locale } = useI18n();
  const blogPosts = getAllPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">{t('nav.blog')}</h1>
      
      <div className="space-y-8">
        {blogPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-2">
              {locale === 'de' && post.titleDe
                ? post.titleDe
                : locale === 'zh' && post.titleZh
                ? post.titleZh
                : post.title}
            </h2>
            <p className="text-gray-600 mb-4">
              {locale === 'de' && post.excerptDe
                ? post.excerptDe
                : locale === 'zh' && post.excerptZh
                ? post.excerptZh
                : post.excerpt}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{post.date}</span>
              <Link
                href={`/blog/${post.id}`}
                className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
              >
                {t('buttons.readMore')} →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

