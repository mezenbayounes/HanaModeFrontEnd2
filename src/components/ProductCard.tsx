import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../types/Product';
import { useTranslation } from 'react-i18next';
import { useFavorites } from '../context/FavoritesContext';
import React, { useState } from 'react';
import { API_URL } from '../config';

interface ProductCardProps {
  product: Product;
  size?: 'small' | 'default' | 'home';
}

export default function ProductCard({ product, size = 'default' }: ProductCardProps) {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(false);
  const { isFavorite } = useFavorites();

  const hasDiscount = !!product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price;
  const displayPrice = (product.discountPrice && product.discountPrice > 0) ? product.discountPrice : product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const mainImage = product.images[0];
  const hoverImage = product.images[1] || product.images[0]; // fallback if no second image

  // Size-specific classes
  const sizeClasses = {
    small: {
      card: '',
      padding: 'p-2',
      title: 'text-sm',
      category: 'text-xs',
      sizes: 'text-xs',
      colors: 'text-xs',
      priceMain: 'text-base',
      priceStrike: 'text-xs',
      priceGap: 'gap-1',
      buttonPadding: 'px-3 py-2',
      buttonText: 'text-xs',
      buttonMargin: 'mt-2',
      titleMargin: 'mb-1',
      categoryMargin: 'mb-0.5',
      sizeMargin: 'mb-0.5',
      colorMargin: 'mb-1',
    },
    default: {
      card: '',
      padding: 'p-2 md:p-3',
      title: 'text-base md:text-lg',
      category: 'text-xs',
      sizes: 'text-xs',
      colors: 'text-xs',
      priceMain: 'text-lg md:text-xl',
      priceStrike: 'text-xs md:text-sm',
      priceGap: 'gap-2',
      buttonPadding: 'px-4 py-2.5 md:px-6 md:py-3',
      buttonText: 'text-sm md:text-base',
      buttonMargin: 'mt-3 md:mt-4',
      titleMargin: 'mb-1 md:mb-1.5',
      categoryMargin: 'mb-0.5',
      sizeMargin: 'mb-0.5',
      colorMargin: 'mb-1.5',
    },
    home: {
      card: '',
      padding: 'p-2 md:p-3',
      title: 'text-sm md:text-base lg:text-base',
      category: 'text-xs',
      sizes: 'text-xs',
      colors: 'text-xs',
      priceMain: 'text-base md:text-lg lg:text-lg',
      priceStrike: 'text-xs md:text-sm',
      priceGap: 'gap-1.5',
      buttonPadding: 'px-4 py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3',
      buttonText: 'text-xs md:text-sm lg:text-base',
      buttonMargin: 'mt-2 md:mt-3',
      titleMargin: 'mb-1',
      categoryMargin: 'mb-0.5',
      sizeMargin: 'mb-0.5',
      colorMargin: 'mb-1',
    }
  };

  const classes = sizeClasses[size];

  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      if (hovered && product.images.length > 1) {
        scrollRef.current.scrollTo({
          left: scrollRef.current.clientWidth,
          behavior: 'smooth'
        });
      } else {
        scrollRef.current.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      }
    }
  }, [hovered, product.images.length]);

  return (
    <>
    <Link
      to={`/product/${product.id}`}
      className={`group bg-white rounded-md overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 group/image">
        {/* Scrollable Images */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full w-full"
        >
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
                className={`w-1.5 h-1.5 rounded-full shadow-sm backdrop-blur-sm transition-colors ${
                  (index === 1 && hovered) || (index === 0 && !hovered) ? 'bg-white' : 'bg-white/40' 
                }`}
              />
            ))}
          </div>
        )}

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-1.5 left-1.5 md:top-3 md:left-3 bg-red-500 text-white px-1.5 py-0.5 md:px-3 md:py-1 text-xs md:text-sm font-bold rounded z-10">
            -{discountPercent}%
          </div>
        )}
        {/* Favorite Indicator - Read Only */}
        <div
          className="absolute top-1.5 right-1.5 md:top-3 md:right-3 bg-white/80 backdrop-blur-sm p-1 md:p-2 rounded-full shadow-lg"
        >
          <Heart 
            className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${
              isFavorite(product.id) 
                ? 'fill-red-500 text-red-500' 
                : 'text-gray-400'
            }`} 
          />
        </div>
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
        <div className={`${classes.category} text-gray-500 uppercase tracking-wider ${classes.categoryMargin}`}>
          {product.category.replace('-', ' ')}
        </div>
        {/* Name */}
        <h3 className={`font-bold ${classes.title} ${classes.titleMargin} text-gray-900 line-clamp-1`}>
          {product.name}
        </h3>
        {/* Sizes */}
        {product.sizes && product.sizes.length > 0 && (
          <div className={`${classes.sizes} text-gray-500 ${classes.sizeMargin}`}>
            <span className="font-semibold">{t('product.sizes')} : </span>
            {product.sizes.map((s) => (s as any).size || s).join(', ')}
          </div>
        )}
        {/* Colors */}
        <div className={`flex flex-wrap items-center gap-1 ${classes.colors} ${classes.colorMargin} min-h-[1rem]`}>
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
        {/* View Details Button 
        <div className={`w-full ${classes.buttonMargin}`}>
          <button className={`w-full ${classes.buttonPadding} ${classes.buttonText} font-semibold border-2 border-gray-900 text-gray-900 bg-transparent transition-all duration-300 hover:bg-gray-900 hover:text-white transform hover:scale-[1.02] active:scale-95`}>
            {t('common.viewDetails')}
          </button>
        </div>
        */}
      </div>
    </Link>
    </>
  );
}
