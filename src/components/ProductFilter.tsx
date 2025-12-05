import React from 'react';
import {
  LayoutGrid,
  Rows3,
  SlidersHorizontal,
  Filter,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type SortOption = 'popular' | 'priceAsc' | 'priceDesc' | 'discount';
export type ViewMode = 'grid' | 'list';

interface ProductFilterProps {
  // Filter states
  onlyInStock: boolean;
  setOnlyInStock: (value: boolean) => void;
  onlyDiscounted: boolean;
  setOnlyDiscounted: (value: boolean) => void;
  
  // Search
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  
  // Sort
  sortOption: SortOption;
  setSortOption: (value: SortOption) => void;
  
  // View mode
  viewMode: ViewMode;
  setViewMode: (value: ViewMode) => void;
  
  // Reset function
  onReset: () => void;
}

export default function ProductFilter({
  onlyInStock,
  setOnlyInStock,
  onlyDiscounted,
  setOnlyDiscounted,
  searchTerm,
  setSearchTerm,
  sortOption,
  setSortOption,
  viewMode,
  setViewMode,
  onReset,
}: ProductFilterProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      {/* Horizontal layout: Search (full width) + Sort (fixed) */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search Bar - Full Width */}
        <div className="relative w-full flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={t('category.searchPlaceholder', 'Rechercher une coupe, un style, un détail...')}
            className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
          <SlidersHorizontal className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
        </div>

        {/* Sort Dropdown - Fixed Width */}
        <select
          value={sortOption}
          onChange={e => setSortOption(e.target.value as SortOption)}
          className="w-full md:w-64 flex-shrink-0 rounded-xl border border-gray-200 py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-gray-500 focus:border-transparent"
        >
          <option value="popular">{t('category.sortPopular', 'Populaires')}</option>
          <option value="priceAsc">{t('category.sortPriceAsc', 'Prix croissant')}</option>
          <option value="priceDesc">{t('category.sortPriceDesc', 'Prix décroissant')}</option>
          <option value="discount">{t('category.sortBestDeals', 'Meilleures remises')}</option>
        </select>
      </div>
    </div>
  );
}
