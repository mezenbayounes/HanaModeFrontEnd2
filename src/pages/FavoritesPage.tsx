import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useTranslation } from 'react-i18next';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { API_URL } from '../config';

export default function FavoritesPage() {
  const { favorites, loading, removeFromFavorites } = useFavorites();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const addToCart = useCartStore(state => state.addItem);

  const handleRemoveFavorite = async (productId: number) => {
    try {
      await removeFromFavorites(productId);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const handleAddToCart = (product: any) => {
    // Always navigate to product page to select size/color
    navigate(`/product/${product.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('favorites.title')}</h1>
          <p className="mt-2 text-gray-600">
            {favorites.length} {favorites.length === 1 ? t('favorites.item') : t('favorites.items')}
          </p>
        </div>

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="mx-auto h-24 w-24 text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {t('favorites.empty')}
            </h2>
            <p className="text-gray-600 mb-6">
            {t('favorites.startAddingFavorites')}</p>
            <button
              onClick={() => navigate('/shop')}
              className="px-6 py-3 bg-black text-white font-semibold hover:bg-gray-800 transition-colors"
            >
              {t('favorites.continueShopping')}
            </button>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => {
              const displayPrice = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;
              const hasDiscount = product.discountPrice !== undefined && product.discountPrice > 0 && product.discountPrice < product.price;

              return (
                <div
                  key={product.id}
                  className="bg-white  overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Product Image */}
                  <div
                    className="relative h-80 bg-gray-200 cursor-pointer group"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={`${API_URL}${product.images[0]}`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                        <ShoppingCart className="w-12 h-12" />
                      </div>
                    )}
                    
                    {/* Discount Badge */}
                    {hasDiscount && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-red-500 text-white px-3 py-1  text-sm font-bold">
                          -
                          {Math.round(
                            ((product.price - product.discountPrice!) / product.price) * 100
                          )}
                          %
                        </span>
                      </div>
                    )}

                    {/* Remove Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFavorite(product.id);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white  hover:bg-red-50 transition-colors"
                    >
                      <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3
                      className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-gray-600"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl font-bold text-gray-900">
                        {displayPrice.toFixed(2)} DNT
                      </span>
                      {hasDiscount && (
                        <span className="text-sm text-gray-500 line-through">
                          {product.price.toFixed(2)} DNT
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className={`w-full flex items-center justify-center gap-2 py-2 px-4 font-semibold transition-colors ${
                        product.inStock
                          ? 'bg-black text-white hover:bg-gray-800'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {product.inStock ? t('common.addToCart') : t('product.outOfStock')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
