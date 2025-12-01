import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { Product } from '../api/ProductApi';
import { getProduct } from '../api/ProductApi';
import { API_URL } from '../config';

export default function ProductDetailsAdminPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData: Product = await getProduct(id!);
        setProduct(productData);
        const preferredSize =
          productData.sizes.find((size) => size.inStock) || productData.sizes[0];
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

  // When size changes → reset selected color
  useEffect(() => {
    setSelectedColor(null);
  }, [selectedSize]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-hana">
        <p className="text-gray-500 text-lg">{t('product.loading')}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center font-hana">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('product.notFound')}</h2>
          <button
            onClick={() => navigate('/admin/products')}
            className="text-rose-500 hover:text-rose-600"
          >
            {t('product.returnToShop')}
          </button>
        </div>
      </div>
    );
  }

  const sizeObject = product.sizes.find(s => s.size === selectedSize);
  const availableColors = sizeObject?.colors || [];

  const hasDiscount =
    !!product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price;

  const displayPrice = (product.discountPrice && product.discountPrice > 0) ? product.discountPrice : product.price;

  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 font-hana">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/admin/products')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('product.back')}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-3xl overflow-hidden shadow-xl">

          {/* IMAGE SECTION */}
          <div className="relative aspect-[3/4] lg:aspect-auto bg-gray-100 flex flex-col items-center">
            <img
              src={product.images[currentImage] ? `${API_URL}${product.images[currentImage]}` : 'https://via.placeholder.com/300'}
              className="w-full h-full object-cover"
              alt={product.name}
            />

            <div className="absolute top-4 right-4">
              {product.inStock ? (
                <div className="bg-white border-2 border-green-500 text-green-500 w-24 h-6 flex items-center justify-center  font-bold text-sm">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">{t('product.inStock')}</span>
                </div>
              ) : (
                <div className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">{t('product.outOfStock')}</span>
                </div>
              )}
            </div>

            {/* Discount / Badges */}
            <div className="absolute top-5 left-1 flex flex-col gap-2">
              {discountPercent > 0 && (
                <span className="bg-white border-2 border-red-500 text-red-500 w-40 h-6 flex items-center justify-center  font-bold text-sm">
                  {t('product.save')} {discountPercent}%
                </span>
              )}
              {product.bestSeller && (
                <span className="bg-white border-2 border-purple-500 text-purple-500 w-40 h-6 flex items-center justify-center  font-bold text-sm">
                  {t('product.bestSeller')}
                </span>
              )}
            </div>
            {/* Thumbnails */}
            <div className="flex gap-2 mt-4 px-4 overflow-x-auto pb-4">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={`${API_URL}${img}`}
                  className={`w-20 h-15 object-cover rounded-lg cursor-pointer border-2 transition ${
                    currentImage === index ? 'border-rose-500' : 'border-transparent opacity-70'
                  }`}
                  onClick={() => setCurrentImage(index)}
                  alt={`Thumbnail ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* PRODUCT DETAILS */}
          <div className="p-8 lg:p-12 flex flex-col">
            <div className="flex-1">
              <div className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                {product.category.replace('-', ' ')}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <p className="text-lg text-gray-600 mb-6">{product.description}</p>

              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-3xl font-bold text-gray-900">
                  {displayPrice.toFixed(2)} DNT
                </span>
                {hasDiscount && (
                  <span className="text-2xl text-gray-400 line-through">
                    {product.price.toFixed(2)} DNT
                  </span>
                )}
              </div>

              {/* SIZE SELECTION */}
              <div className="mb-6">
                <label className="block text-l font-bold text-gray-700 mb-3">
                  {t('product.selectSizeLabel')}
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(s => {
                    const isSelected = selectedSize === s.size;
                    const isDisabled = !s.inStock;
                    return (
                      <button
                        key={s.size}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => !isDisabled && setSelectedSize(s.size)}
                        className={`px-6 py-3 font-semibold border-2 transition-all duration-300 ${
                          isDisabled
                            ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed opacity-50'
                            : isSelected
                              ? 'bg-black text-white border-black shadow-xl'
                              : 'bg-white text-black border-gray-600 hover:bg-black hover:text-white hover:border-black hover:shadow-xl hover:scale-105'
                        }`}
                      >
                        {s.size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* COLOR SELECTION */}
              <div className="mb-8">
                {product.sizes && product.sizes.some(s => s.colors && s.colors.length > 0) ? (
                  <>
                    <label className="block text-l font-bold text-gray-700 mb-3">
                      {t('product.colorLabel')}
                    </label>
                    <div className="flex items-center gap-6 flex-wrap">
                      {Array.from(
                        new Map(
                          product.sizes
                            .flatMap(s => s.colors || [])
                            .map(c => [c.name, c])
                        ).values()
                      ).map((color, index) => {
                        const isAvailableForSize = availableColors.some(c => c.name === color.name);
                        return (
                          <div
                            key={index}
                            className={`flex flex-col items-center cursor-pointer ${
                              isAvailableForSize ? '' : 'opacity-40 cursor-not-allowed'
                            }`}
                            onClick={() => isAvailableForSize && setSelectedColor(color.name)}
                          >
                            <div
                              className={`relative w-10 h-10 rounded-full border transition ${
                                selectedColor === color.name ? 'ring-2 ring-black' : 'border-gray-300'
                              }`}
                              style={{ backgroundColor: color.code }}
                            >
                              {!isAvailableForSize && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-full h-[2px] bg-black rotate-45 origin-center"></div>
                                </div>
                              )}
                            </div>
                            <span
                              className={`text-xs mt-2 ${
                                selectedColor === color.name ? 'font-semibold text-black' : 'text-gray-500'
                              }`}
                            >
                              {color.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="h-[76px]"></div> 
                )}
              </div>

              {/* Note: Quantity and Add to Cart buttons are removed for Admin View */}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
