import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Product } from '../types/Product';
import { API_URL } from '../config';

interface ProductListItemProps {
  product: Product;
  actions?: React.ReactNode;
  onClick?: () => void;
}

export default function ProductListItem({ product, actions, onClick }: ProductListItemProps) {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  const hasDiscount = !!product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price;
  const displayPrice = (product.discountPrice && product.discountPrice > 0) ? product.discountPrice : product.price;

  return (
    <div
      className="bg-white rounded-3xl shadow-sm p-6 flex flex-col md:flex-row gap-6 hover:shadow-lg transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full md:w-1/3">
        <div 
          className="relative aspect-[4/5]  overflow-hidden bg-gray-100 cursor-pointer"
          onClick={onClick}
        >
          <img
            src={`${API_URL}${product.images[0]}`}
            alt={product.name}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isHovered ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <img
            src={`${API_URL}${product.images[1] || product.images[0]}`}
            alt={product.name}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      </div>
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-500">
              {product.category.replace('-', ' ')}
            </p>
            <h3 
              className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-gray-600 transition-colors"
              onClick={onClick}
            >
              {product.name}
            </h3>
          </div>
          {product.bestSeller && (
            <span className="px-3 py-1 text-xs font-semibold  bg-amber-50 text-amber-600">
              {t('product.bestSeller')}
            </span>
          )}
        </div>

        <p className="text-gray-600 line-clamp-2">{product.description}</p>

        {/* Colors */}
        {product.color && product.color.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">{t('product.colors')}:</p>
            <div className="flex flex-wrap gap-2">
              {product.color.map((color, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50"
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: color.code }}
                  />
                  <span className="text-xs font-medium text-gray-700 capitalize">
                    {color.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {product.sizes?.map(size => (
            <span
              key={size.size}
              className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                size.inStock
                  ? 'border-gray-200 text-gray-700'
                  : 'border-gray-100 text-gray-400 line-through'
              }`}
            >
              {size.size}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">
              {displayPrice.toFixed(2)} DNT
            </span>
            {hasDiscount && (
              <span className="text-lg text-gray-400 line-through">
                {product.price.toFixed(2)} DNT
              </span>
            )}
          </div>
          
          {actions && (
            <div className="flex gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
