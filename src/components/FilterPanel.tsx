import React from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CategorySearchInput from './CategorySearchInput';
import CategorySortSelect from './CategorySortSelect';
import CategoryList from './CategoryList';

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
  sortOrder,
  onSortChange,
  categories,
  selectedCategory,
  onCategoryChange,
  showInStockOnly,
  onInStockChange,
  onResetFilters,
  className = ""
}: FilterPanelProps) {
  const { t } = useTranslation();

  // Adjust padding and spacing based on number of categories for more compact design
  const categoryCount = categories.length;
  const paddingClass = categoryCount <= 2 ? 'p-4' : 'p-6';
  const headerMarginClass = categoryCount <= 2 ? 'mb-3' : 'mb-4';
  const sectionMarginClass = categoryCount <= 2 ? 'mb-4' : 'mb-6';

  return (
    <div className={`bg-white rounded-2xl shadow-md ${paddingClass} lg:sticky lg:top-24 ${className}`}>
      <div className={`flex items-center gap-3 ${headerMarginClass}`}>
        <Search className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg md:text-xl font-bold text-gray-900">{t('shop.categories')}</h2>
      </div>

      {/* Search Input */}
      <CategorySearchInput 
        value={searchTerm} 
        onChange={onSearchChange} 
      />

      {/* Sorting */}
      <CategorySortSelect 
        value={sortOrder} 
        onChange={onSortChange} 
      />

      {/* Categories List */}
      <CategoryList 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />

      {/* Availability */}
      <div className={sectionMarginClass}>
        <h3 className="text-sm md:text-md font-semibold text-gray-800 mb-3">{t('shop.availability')}</h3>
        <label className="flex items-center gap-3 cursor-pointer text-sm md:text-base">
          <input
            type="checkbox"
            checked={showInStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="w-4 h-4 text-red-500"
          />
          <span className="text-gray-700">{t('shop.inStockOnly')}</span>
        </label>
      </div>

      <button
        onClick={onResetFilters}
        className="w-full bg-gray-100 text-gray-700 py-2 rounded-xl hover:bg-gray-200 transition-colors"
      >
        {t('shop.resetFilters')}
      </button>
    </div>
  );
}

