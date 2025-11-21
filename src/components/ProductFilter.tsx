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
    <div className="bg-white rounded-3xl shadow-sm p-6 space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-900 rounded-full text-sm font-medium">
            <Filter className="w-4 h-4" />
            {t('filters.title', 'Filtres')}
          </div>
          <button
            onClick={onReset}
            className="text-sm text-gray-500 hover:text-gray-800 underline"
          >
            {t('filters.reset', 'Réinitialiser')}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setOnlyInStock(!onlyInStock)}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              onlyInStock ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'border-gray-200 text-gray-600'
            }`}
          >
            {t('category.onlyStock', 'En stock')}
          </button>
          <button
            onClick={() => setOnlyDiscounted(!onlyDiscounted)}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              onlyDiscounted ? 'bg-amber-50 border-amber-200 text-amber-700' : 'border-gray-200 text-gray-600'
            }`}
          >
            {t('category.onlyPromotions', 'En promotion')}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={t('category.searchPlaceholder', 'Rechercher une coupe, un style, un détail...')}
              className="w-full rounded-2xl border border-gray-200 py-3 pl-4 pr-12 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
            <SlidersHorizontal className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={sortOption}
            onChange={e => setSortOption(e.target.value as SortOption)}
            className="rounded-2xl border border-gray-200 py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          >
            <option value="popular">{t('category.sortPopular', 'Populaires')}</option>
            <option value="priceAsc">{t('category.sortPriceAsc', 'Prix croissant')}</option>
            <option value="priceDesc">{t('category.sortPriceDesc', 'Prix décroissant')}</option>
            <option value="discount">{t('category.sortBestDeals', 'Meilleures remises')}</option>
          </select>

          <div className="inline-flex rounded-2xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 flex items-center gap-2 text-sm font-medium ${
                viewMode === 'grid'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              {t('category.viewGrid', 'Grille')}
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 flex items-center gap-2 text-sm font-medium ${
                viewMode === 'list'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Rows3 className="w-4 h-4" />
              {t('category.viewList', 'Liste')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
