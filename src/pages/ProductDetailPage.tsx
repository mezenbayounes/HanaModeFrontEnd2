import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Star, ChevronLeft, ChevronRight, Check, X, Maximize2 } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { Product } from '../types/Product';
import { getProductById } from '../api/productsApi';
import { API_URL } from '../config';

export default function ProductDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  
  // Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Refs for scrolling
  const mainImageContainerRef = useRef<HTMLDivElement>(null);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductById(Number(id));
        setProduct(productData);
        // Default size selection logic
        const preferredSize =
          productData.sizes.find(size => size.inStock) || productData.sizes[0];
        if (preferredSize) {
          setSelectedSize(preferredSize.size);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // When size changes → auto-select first available color
  useEffect(() => {
    if (product && selectedSize) {
      const sizeObject = product.sizes.find(s => s.size === selectedSize);
      const availableColors = sizeObject?.colors || [];
      
      if (availableColors.length > 0) {
        setSelectedColor(availableColors[0].name);
      } else {
        setSelectedColor(null);
      }
    }
  }, [selectedSize, product]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-hana bg-white">
        <p className="text-gray-500 text-lg">{t('product.loading')}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center font-hana bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('product.notFound')}</h2>
          <button
            onClick={() => navigate('/shop')}
            className="text-black underline hover:text-gray-700"
          >
            {t('product.returnToShop')}
          </button>
        </div>
      </div>
    );
  }

  const sizeObject = product.sizes.find(s => s.size === selectedSize);
  const availableColors = sizeObject?.colors || [];

  // ColorCode for cart
  const colorCode = availableColors.find(c => c.name === selectedColor)?.code || '';

  const hasDiscount =
    !!product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price;

  const displayPrice = (product.discountPrice && product.discountPrice > 0) ? product.discountPrice : product.price;

  const handleAddToCart = () => {
    if (!product.inStock) return;
    const currentSize = product.sizes.find(s => s.size === selectedSize);
    if (!currentSize || !currentSize.inStock) return;

    addItem(product, selectedSize, quantity, selectedColor ?? undefined, colorCode);
    navigate('/cart');
  };

  const scrollToImage = (index: number) => {
    if (mainImageContainerRef.current) {
        mainImageContainerRef.current.scrollTo({
            left: index * mainImageContainerRef.current.clientWidth,
            behavior: 'smooth'
        });
    }
    setCurrentImage(index);
  };

  const nextImage = (e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
    const newIndex = (currentImage + 1) % product.images.length;
    scrollToImage(newIndex);
  };

  const prevImage = (e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
    const newIndex = (currentImage - 1 + product.images.length) % product.images.length;
    scrollToImage(newIndex);
  };

  // Parsing description to list if contains bullets or newlines
  const descriptionLines = product.description.split('\n').filter(line => line.trim().length > 0);

  return (
    <div className="min-h-screen bg-white font-hana pb-20">
      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
            {/* Close Button */}
            <button 
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-50"
            >
                <X className="w-8 h-8" />
            </button>

            {/* Navigation Buttons (Lightbox) */}
            {product.images.length > 1 && (
                <>
                    <button 
                        onClick={(e) => prevImage(e)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-2 z-50"
                    >
                        <ChevronLeft className="w-10 h-10" />
                    </button>
                    <button 
                        onClick={(e) => nextImage(e)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-2 z-50"
                    >
                        <ChevronRight className="w-10 h-10" />
                    </button>
                </>
            )}

            {/* Lightbox Image */}
            <div className="w-full h-full p-4 md:p-10 flex items-center justify-center">
                <img 
                    src={`${API_URL}${product.images[currentImage]}`} 
                    alt={product.name} 
                    className="max-w-full max-h-full object-contain"
                />
            </div>
            
            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm">
                {currentImage + 1} / {product.images.length}
            </div>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        <div className="text-xs md:text-sm text-gray-500 flex items-center gap-2">
          <Link to="/" className="hover:text-black">Accueil</Link>
          <span>&gt;</span>
          <Link to="/shop" className="hover:text-black uppercase">{product.category}</Link>
          <span className="hidden md:inline">&gt;</span>
          <span className="hidden md:inline text-gray-900 font-medium uppercase">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        
        {/* LEFT COLUMN: IMAGE GALLERY */}
        <div className="space-y-4">
          {/* Main Image Container */}
          <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden group">
            {/* Full Screen Trigger Button */}
            <button 
                onClick={() => setIsLightboxOpen(true)}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-sm z-20 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Maximize2 className="w-5 h-5 text-gray-900" />
            </button>

            {/* Scrollable Container */}
            <div 
              ref={mainImageContainerRef}
              className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide cursor-zoom-in"
              style={{ scrollBehavior: 'smooth' }}
              onClick={() => setIsLightboxOpen(true)}
              onScroll={(e) => {
                const container = e.currentTarget;
                const index = Math.round(container.scrollLeft / container.clientWidth);
                if (index !== currentImage) setCurrentImage(index);
              }}
            >
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={`${API_URL}${img}`}
                  alt={`${product.name} - ${idx + 1}`}
                  className="w-full h-full object-cover flex-shrink-0 snap-center"
                />
              ))}
            </div>
            
            {/* Arrows */}
            {product.images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Discount Badge */}
            {hasDiscount && (
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-sm font-bold z-10 poiner-events-none">
                -{Math.round(((product.price - product.discountPrice!) / product.price) * 100)}%
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => scrollToImage(index)}
                  className={`relative w-24 aspect-[3/4] flex-shrink-0 bg-gray-50 overflow-hidden border transition-all ${
                    currentImage === index ? 'border-black opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={`${API_URL}${img}`}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: DETAILS */}
        <div className="flex flex-col pt-2 lg:pt-0">
          
          {/* Title & Rating */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-3xl font-serif uppercase tracking-wide text-gray-900 mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              ))}
              <span className="text-xs text-gray-400 ml-2">(Review placeholder)</span>
            </div>
            
            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-serif text-gray-900">
                {displayPrice.toFixed(2)} DT
              </span>
              {hasDiscount && (
                <span className="text-lg text-gray-400 line-through">
                  {product.price.toFixed(2)} DT
                </span>
              )}
            </div>
          </div>

          {/* COLORS */}
          {product.sizes && product.sizes.some(s => s.colors && s.colors.length > 0) && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold text-gray-900">{t('product.colors', 'Colors')} :</span> {selectedColor || 'Select'}
              </p>
              <div className="flex flex-wrap gap-2">
                {Array.from(
                   new Map(
                     product.sizes
                       .flatMap(s => s.colors || [])
                       .map(c => [c.name, c])
                   ).values()
                 ).map((color) => {
                   const isAvailableForSize = availableColors.some(c => c.name === color.name);
                   const isSelected = selectedColor === color.name;
                   
                   return (
                    <button
                      key={color.name}
                      onClick={() => isAvailableForSize && setSelectedColor(color.name)}
                      disabled={!isAvailableForSize}
                      title={color.name}
                      style={{ backgroundColor: color.code }}
                      className={`w-8 h-8 md:w-10 md:h-10 border transition-all ${
                        isSelected 
                          ? 'ring-2 ring-offset-2 ring-gray-900 border-gray-400' 
                          : 'border-gray-200 hover:border-gray-400'
                      } ${!isAvailableForSize ? 'opacity-20 cursor-not-allowed relative overflow-hidden' : ''}`}
                    >
                      {!isAvailableForSize && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-[120%] h-[1px] bg-gray-500 -rotate-45" />
                        </div>
                      )}
                    </button>
                   );
                 })}
              </div>
            </div>
          )}

          {/* SIZES */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{t('product.sizes', 'Size')} :</span> {selectedSize}
              </p>
              {/* Optional: Size Guide Link */}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => {
                const isSelected = selectedSize === s.size;
                const isDisabled = !s.inStock;
                
                return (
                  <button
                    key={s.size}
                    disabled={isDisabled}
                    onClick={() => setSelectedSize(s.size)}
                    className={`min-w-[3rem] h-10 px-3 flex items-center justify-center text-sm border font-medium transition-all
                      ${isDisabled 
                        ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed decoration-slice' 
                        : isSelected
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-900 border-gray-300 hover:border-gray-900'
                      }
                    `}
                  >
                    {s.size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* DESCRIPTION / FEATURES */}
          <div className="border-t border-gray-200 py-6 mb-6">
            <ul className="space-y-2 text-sm text-gray-700 uppercase tracking-wide">
              {descriptionLines.length > 0 ? (
                descriptionLines.map((line, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-1.5 shrink-0" />
                     <span>{line}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-1.5"></span>COUPE : NORMAL</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-1.5"></span>TISSUE : PREMIUM</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-1.5"></span>ÉLASTICITÉ : OUI</li>
                </>
              )}
            </ul>
          </div>

          {/* ADD TO CART */}
          <div className="mt-auto">
             <button
               onClick={handleAddToCart}
               disabled={!product.inStock}
               className={`w-full py-4 uppercase font-bold tracking-wider text-sm transition-all duration-300
                 ${product.inStock 
                   ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg' 
                   : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                 }
               `}
             >
               {product.inStock ? t('product.addToCart', 'AJOUTER AU PANIER') : t('product.outOfStock', 'RUPTURE DE STOCK')}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
