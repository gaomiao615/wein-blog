'use client';

import { useState } from 'react';
import { WineFilters } from '@/components/WineFilters';
import { WineList } from '@/components/WineList';
import type { WineFilterState } from '@/components/WineFilters';

export default function WinesPage() {
  const [filters, setFilters] = useState<WineFilterState | undefined>();
  const [showCollectionOnly, setShowCollectionOnly] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <WineFilters 
        onFilterChange={setFilters}
        onCollectionToggle={setShowCollectionOnly}
      />
      <WineList filters={filters} showCollectionOnly={showCollectionOnly} />
    </div>
  );
}

