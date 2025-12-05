import React from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CategoryOption {
  value: string;
  label: string;
}

interface FilterPanelProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortChange: (value: 'asc' | 'desc') => void;
  categories: CategoryOption[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  showInStockOnly: boolean;
  onInStockChange: (value: boolean) => void;
  onResetFilters: () => void;
  className?: string;
}

export default function FilterPanel({
  searchTerm,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  className = ""
}: FilterPanelProps) {
  const { t } = useTranslation();

  return (
    <div className={`bg-white rounded-2xl shadow-md p-6 ${className}`}>
      {/* Horizontal layout: Search (full width) + Categories (fixed) */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search Bar - Full Width */}
        <div className="relative w-full flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('shop.searchCategory', 'Search...')}
            className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
        </div>

        {/* Categories Dropdown - Fixed Width */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full md:w-64 flex-shrink-0 rounded-xl border border-gray-200 py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-gray-500 focus:border-transparent"
        >
          <option value="all">{t('shop.allCategories')}</option>
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
