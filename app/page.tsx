import { Hero } from '@/components/Hero';
import { WineSearchAdvanced } from '@/components/WineSearchAdvanced';

export default function Home() {
  return (
    <div>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <WineSearchAdvanced />
      </div>
    </div>
  );
}

