import { Link } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
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

  // Size config
  const config = {
    small: {
      titleSize: 'text-xs',
      priceSize: 'text-sm',
      iconSize: 'w-4 h-4',
      gap: 'gap-1'
    },
    default: {
      titleSize: 'text-[10px] sm:text-xs md:text-sm lg:text-base',
      priceSize: 'text-xs sm:text-sm md:text-base lg:text-lg',
      iconSize: 'w-3.5 h-3.5 md:w-5 md:h-5', 
      gap: 'gap-1.5 md:gap-2'
    },
    home: {
      titleSize: 'text-[10px] sm:text-xs md:text-sm',
      priceSize: 'text-xs sm:text-sm md:text-base',
      iconSize: 'w-3.5 h-3.5 md:w-5 md:h-5',
      gap: 'gap-1 md:gap-1.5'
    }
  };

  const { titleSize, priceSize, iconSize } = config[size];

  // Extract unique colors
  const uniqueColors = Array.from(
    new Map(
      product.sizes
        .flatMap((s) => (s as any).colors || [])
        .map((c: any) => [c.name, c])
    ).values()
  ).slice(0, 4); // Limit to 4 colors

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col h-full border border-gray-100 bg-white rounded-xl p-0.5 md:p-2 shadow-sm hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 rounded-md mb-2 md:mb-3 shadow-sm group-hover:shadow-md transition-shadow duration-300">
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

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md text-white px-2 py-1 text-[10px] uppercase font-bold tracking-wider">
            -{discountPercent}%
          </div>
        )}

        {/* Favorite Button */}
        <div className="absolute top-2 right-2">
            <div className="bg-white/90 backdrop-blur rounded-full p-1.5 shadow-sm hover:scale-110 transition-transform">
                <Heart 
                    className={`w-4 h-4 transition-colors ${
                    isFavorite(product.id) 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-900'
                    }`} 
                />
            </div>
        </div>
      </div>

      {/* Info Section - Fixed Height for Uniformity */}
      <div className="flex flex-col h-[70px] shrink-0 px-1 border-t border-transparent">
        {/* Category Centered (Swapped with Name) */}
        <h3 className={`text-center font-medium uppercase tracking-wide text-gray-500 ${titleSize} truncate mb-0.5`}>
          {product.category.replace('-', ' ')}
        </h3>

        {/* Colors Row (Centered) */}
        <div className="flex justify-center items-center gap-1.5 mb-1 min-h-[12px]">
            {uniqueColors.length > 0 ? (
                uniqueColors.map((color: any, index) => (
                    <div
                        key={index}
                        className="w-2.5 h-2.5  border border-gray-200 shadow-sm"
                        style={{ backgroundColor: color.code }}
                        title={color.name}
                    />
                ))
            ) : (
                <div className="h-2.5"></div> 
            )}
        </div>

        {/* Bottom Details: Name/Price Left, Bag Right */}
        <div className="mt-auto flex justify-between items-end border-t border-transparent pt-1">
            <div className="flex flex-col w-full">
                {/* Name (Swapped with Category) - Now at bottom with matches category name color */}
                <span className={`text-gray-500 font-bold uppercase tracking-wider mb-0.5 truncate block w-full ${titleSize}`}>
                    {product.name}
                </span>
                
                {/* Price - whitespace-nowrap to keep on one line */}
                <div className="flex items-baseline gap-2 whitespace-nowrap">
                    <span className={`font-bold text-gray-900 ${priceSize}`}>
                        {displayPrice.toFixed(1)} TND
                    </span>
                    {hasDiscount && (
                        <span className="text-[10px] text-gray-400 line-through decoration-gray-400/50">
                            {product.price.toFixed(1)} TND
                        </span>
                    )}
                </div>
            </div>

            <button
                className="group/btn p-2 rounded-full hover:bg-black hover:text-white transition-all duration-300 text-gray-900 ml-2"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Add to cart logic would go here
                }}
            >
                <ShoppingBag className={`${iconSize} stroke-[1.5]`} />
            </button>
        </div>
      </div>
    </Link>
  );
}
