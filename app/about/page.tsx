'use client';

import { useI18n } from '@/lib/i18n/context';

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">{t('nav.about')}</h1>
      
      <div className="bg-white rounded-lg shadow-sm border p-8 space-y-6">
        <p className="text-lg text-gray-700 leading-relaxed">
          Welcome to Wein Blog! This is a space for wine enthusiasts and German language learners 
          to explore the wonderful world of wine while learning German vocabulary and expressions.
        </p>
        
        <p className="text-lg text-gray-700 leading-relaxed">
          Whether you're discovering new wine regions, learning how to describe wines in German, 
          or simply enjoying the journey of tasting and learning, we hope this blog serves as a 
          helpful resource.
        </p>
        
        <div className="pt-6 border-t">
          <h2 className="text-2xl font-semibold mb-4">What You'll Find Here</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Wine recommendations and tasting notes</li>
            <li>German vocabulary for wine enthusiasts</li>
            <li>Food pairing suggestions</li>
            <li>Personal notes and ratings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

