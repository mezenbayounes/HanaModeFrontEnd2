import React from 'react';
import { useTranslation } from 'react-i18next';

interface CategoryOption {
  value: string;
  label: string;
}

interface CategoryListProps {
  categories: CategoryOption[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

export default function CategoryList({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  className = "" 
}: CategoryListProps) {
  const { t } = useTranslation();

  // Calculate max-height based on number of categories
  const getMaxHeight = () => {
    const categoryCount = categories.length;
    if (categoryCount <= 2) {
      return 'max-h-none'; // No max height for 1-2 categories, just fit content
    } else if (categoryCount <= 5) {
      return 'max-h-48'; // Medium height for 3-5 categories (192px)
    } else {
      return 'max-h-64'; // Larger height for 6+ categories (256px)
    }
  };

  const maxHeightClass = getMaxHeight();
  const shouldScroll = categories.length > 5;
  // Adjust margin based on number of categories
  const marginClass = categories.length <= 2 ? 'mb-4' : 'mb-6';

  return (
    <div className={`${marginClass} flex flex-col gap-3 ${maxHeightClass} ${shouldScroll ? 'overflow-y-auto pr-2' : 'overflow-visible'} ${className}`}>
      {categories.map((cat) => (
        <label
          key={cat.value}
          className="flex items-center gap-3 cursor-pointer text-sm md:text-base"
        >
          <input
            type="radio"
            name="category"
            checked={selectedCategory === cat.value}
            onChange={() => onCategoryChange(cat.value)}
            className="w-4 h-4 text-red-500"
          />
          <span className="text-gray-700">{cat.label}</span>
        </label>
      ))}

      {categories.length === 0 && (
        <p className="text-gray-500 text-sm">{t('shop.noCategoryFound')}</p>
      )}
    </div>
  );
}

