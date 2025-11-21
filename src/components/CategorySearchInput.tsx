import React from 'react';
import { useTranslation } from 'react-i18next';

interface CategorySearchInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function CategorySearchInput({ 
  value, 
  onChange, 
  className = "" 
}: CategorySearchInputProps) {
  const { t } = useTranslation();

  return (
    <input
      type="text"
      placeholder={t('shop.searchCategory')}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full mb-4 p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 ${className}`}
    />
  );
}

