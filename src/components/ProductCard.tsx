import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../types/Product';
import { useTranslation } from 'react-i18next';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import React, { useState } from 'react';
import { API_URL } from '../config';
import LoginRequiredModal from './LoginRequiredModal';

interface ProductCardProps {
  product: Product;
  size?: 'small' | 'default' | 'home';
}

export default function ProductCard({ product, size = 'default' }: ProductCardProps) {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();

  const hasDiscount = !!product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price;
  const displayPrice = (product.discountPrice && product.discountPrice > 0) ? product.discountPrice : product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const mainImage = product.images[0];
  const hoverImage = product.images[1] || product.images[0]; // fallback if no second image

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
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
      category: 'text-xs',
      sizes: 'text-xs',
      colors: 'text-xs',
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
      category: 'text-xs',
      sizes: 'text-xs',
      colors: 'text-xs',
      priceMain: 'text-2xl',
      priceStrike: 'text-sm',
      priceGap: 'gap-3',
      buttonPadding: 'px-20 py-4',
      buttonText: '',
      buttonMargin: 'mt-6',
      buttonWidth: 'w-auto'
    },
    home: {
      card: 'w-65',
      padding: 'p-4',
      title: 'text-xl',
      category: 'text-sm',
      sizes: 'text-sm',
      colors: 'text-sm',
      priceMain: 'text-2xl',
      priceStrike: 'text-sm',
      priceGap: 'gap-2',
      buttonPadding: 'px-16 py-3',
      buttonText: 'text-lg',
      buttonMargin: 'mt-4',
      buttonWidth: 'w-80'
    }
  };

  const classes = sizeClasses[size];

  return (
    <>
    <Link
      to={`/product/${product.id}`}
      className={`group bg-white rounded-l overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 ${classes.card}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 group/image">
        {/* Scrollable Images */}
        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full w-full">
          {product.images.map((img, index) => (
            <img
              key={index}
              src={`${API_URL}${img}`}
              alt={`${product.name} - View ${index + 1}`}
              className="w-full h-full object-cover flex-shrink-0 snap-center"
            />
          ))}
        </div>

        {/* Navigation Dots (only if more than 1 image) */}
        {product.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
            {product.images.map((_, index) => (
              <div 
                key={index}
                className="w-1.5 h-1.5 rounded-full bg-white/80 shadow-sm backdrop-blur-sm"
              />
            ))}
          </div>
        )}

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 text-sm font-bold rounded z-10">
            -{discountPercent}%
          </div>
        )}
        {/* Favorite Button - Always Visible */}
        <button
          className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all hover:scale-110 z-10"
          onClick={handleFavorite}
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${
              isFavorite(product.id) 
                ? 'fill-red-500 text-red-500' 
                : 'text-gray-600'
            }`} 
          />
        </button>
        {/* Add to Cart Button - Visible on Hover */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            className="bg-white text-gray-900 p-2 rounded-l shadow-lg hover:bg-gray-100 transition-colors"
            onClick={(e) => { e.stopPropagation(); /* add to cart logic placeholder */ }}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className={classes.padding}>
        {/* Category */}
        <div className={`${classes.category} text-gray-500 uppercase tracking-wider mb-1`}>
          {product.category.replace('-', ' ')}
        </div>
        {/* Name */}
        <h3 className={`font-bold ${classes.title} mb-2 text-gray-900 line-clamp-1`}>
          {product.name}
        </h3>
        {/* Sizes */}
        {product.sizes && product.sizes.length > 0 && (
          <div className={`${classes.sizes} text-gray-500 mb-1`}>
            <span className="font-semibold">{t('product.sizes')} : </span>
            {product.sizes.map((s) => (s as any).size || s).join(', ')}
          </div>
        )}
        {/* Colors */}
        <div className={`flex flex-wrap items-center gap-1 ${classes.colors} mb-2 min-h-[1rem]`}>
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
    
    {/* Login Required Modal */}
    <LoginRequiredModal 
      isOpen={showLoginModal}
      onClose={() => setShowLoginModal(false)}
    />
    </>
  );
}
