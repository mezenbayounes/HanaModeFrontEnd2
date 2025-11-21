import React from 'react';
import { useTranslation } from 'react-i18next';

interface CategorySortSelectProps {
  value: 'asc' | 'desc';
  onChange: (value: 'asc' | 'desc') => void;
  className?: string;
}

export default function CategorySortSelect({ 
  value, 
  onChange, 
  className = "" 
}: CategorySortSelectProps) {
  const { t } = useTranslation();

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as 'asc' | 'desc')}
      className={`w-full mb-4 p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 ${className}`}
    >
      <option value="asc">{t('shop.sortAZ')}</option>
      <option value="desc">{t('shop.sortZA')}</option>
    </select>
  );
}

