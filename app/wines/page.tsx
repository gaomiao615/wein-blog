'use client';

import { useState, useEffect } from 'react';
import { WineFilters } from '@/components/WineFilters';
import { WineList } from '@/components/WineList';
import type { WineFilterState } from '@/components/WineFilters';

export default function WinesPage() {
  const [filters, setFilters] = useState<WineFilterState | undefined>();
  const [showCollectionOnly, setShowCollectionOnly] = useState(false);
  const [columns, setColumns] = useState<2 | 3>(2);

  // 从 localStorage 加载布局偏好
  useEffect(() => {
    const savedColumns = localStorage.getItem('wine-list-columns');
    if (savedColumns === '2' || savedColumns === '3') {
      setColumns(parseInt(savedColumns) as 2 | 3);
    }
  }, []);

  // 保存布局偏好到 localStorage
  const handleColumnsChange = (newColumns: 2 | 3) => {
    setColumns(newColumns);
    localStorage.setItem('wine-list-columns', newColumns.toString());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <WineFilters 
        onFilterChange={setFilters}
        onCollectionToggle={setShowCollectionOnly}
        columns={columns}
        onColumnsChange={handleColumnsChange}
      />
      <WineList 
        filters={filters} 
        showCollectionOnly={showCollectionOnly}
        columns={columns}
        onColumnsChange={handleColumnsChange}
      />
    </div>
  );
}

