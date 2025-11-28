import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../types/Product';
import { useTranslation } from 'react-i18next';
import { useFavorites } from '../context/FavoritesContext';
import React, { useState } from 'react';
import { API_URL } from '../config';

interface ProductCardProps {
  product: Product;
  size?: 'small' | 'default';
}

export default function ProductCard({ product, size = 'default' }: ProductCardProps) {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(false);
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const hasDiscount = !!product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price;
  const displayPrice = (product.discountPrice && product.discountPrice > 0) ? product.discountPrice : product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const mainImage = product.images[0];
  const hoverImage = product.images[1] || product.images[0]; // fallback if no second image

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product.id);
    }
  };

  // Size-specific classes
  const sizeClasses = {
    small: {
      card: 'w-40',
      padding: 'p-2',
      title: 'text-sm',
      priceMain: 'text-base',
      priceStrike: 'text-xs',
      priceGap: 'gap-1',
      buttonPadding: 'px-12 py-4',
      buttonText: 'text-base',
      buttonMargin: 'mt-4',
      buttonWidth: 'w-80'
    },
    default: {
      card: 'w-80',
      padding: 'p-4',
      title: 'text-lg',
      priceMain: 'text-2xl',
      priceStrike: 'text-sm',
      priceGap: 'gap-3',
      buttonPadding: 'px-20 py-4',
      buttonText: '',
      buttonMargin: 'mt-6',
      buttonWidth: 'w-auto'
    }
  };

  const classes = sizeClasses[size];

  return (
    <Link
      to={`/product/${product.id}`}
      className={`group bg-white rounded-l overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 ${classes.card}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        {/* Main Image */}
        <img
          src={`${API_URL}${mainImage}`}
          alt={product.name}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            hovered ? 'opacity-0' : 'opacity-100'
          }`}
        />
        {/* Hover Image */}
        <img
          src={`${API_URL}${hoverImage}`}
          alt={product.name}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 text-sm font-bold rounded">
            -{discountPercent}%
          </div>
        )}
        {/* Action Buttons */}
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="bg-white text-gray-900 p-2 rounded-l shadow-lg hover:bg-gray-100 transition-colors"
            onClick={(e) => { e.stopPropagation(); /* add to cart logic placeholder */ }}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
          <button
            className="bg-white text-gray-900 p-2 rounded-l shadow-lg hover:bg-gray-100 transition-colors"
            onClick={handleFavorite}
          >
            <Heart className={isFavorite(product.id) ? 'w-5 h-5 text-red-600' : 'w-5 h-5 text-gray-600'} />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className={classes.padding}>
        {/* Category */}
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
          {product.category.replace('-', ' ')}
        </div>
        {/* Name */}
        <h3 className={`font-bold ${classes.title} mb-2 text-gray-900 line-clamp-1`}>
          {product.name}
        </h3>
        {/* Sizes */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="text-xs text-gray-500 mb-1">
            <span className="font-semibold">{t('product.sizes')} : </span>
            {product.sizes.map((s) => (s as any).size || s).join(', ')}
          </div>
        )}
        {/* Colors */}
        <div className="flex flex-wrap items-center gap-1 text-xs mb-2 min-h-[1rem]">
          <span className={`font-semibold mr-1 ${
            product.sizes && product.sizes.some((s) => (s as any).colors && (s as any).colors.length > 0)
              ? 'text-gray-500'
              : 'text-white'
          }`}>{t('product.colors')} :</span>
          {product.sizes && product.sizes.some((s) => (s as any).colors && (s as any).colors.length > 0) ? (
            <>
              {Array.from(
                new Map(
                  product.sizes
                    .flatMap((s) => (s as any).colors || [])
                    .map((c) => [c.name, c])
                ).values()
              ).map((color, index) => (
                <div
                  key={index}
                  className="w-3 h-3 rounded-full border"
                  style={{ backgroundColor: color.code }}
                  title={color.name}
                />
              ))}
            </>
          ) : (
            <div className="w-3 h-3" />
          )}
        </div>
        {/* Price */}
        <div className={`flex items-baseline ${classes.priceGap}`}>
          <span className={`${classes.priceMain} font-bold text-gray-900`}>{displayPrice.toFixed(2)} DNT</span>
          {hasDiscount && (
            <span className={`${classes.priceStrike} text-gray-400 line-through`}>{product.price.toFixed(2)} DNT</span>
          )}
        </div>
        {/* View Details Button */}
        <div className={`w-full flex justify-center ${classes.buttonMargin}`}>
          <button className={`${classes.buttonWidth} ${classes.buttonPadding} ${classes.buttonText} font-semibold border-2 border-gray-600 text-black bg-white transition-all duration-300 hover:bg-black hover:text-white hover:border-black hover:shadow-xl hover:scale-105`}>
            {t('common.viewDetails')}
          </button>
        </div>
      </div>
    </Link>
  );
}
