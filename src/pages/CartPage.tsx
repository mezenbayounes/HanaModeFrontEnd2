import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { API_URL } from '../config';

export default function CartPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 font-hana">
        <div className="text-center">
          <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('cart.empty')}</h2>
          <p className="text-gray-600 mb-8">{t('cart.startShopping')}</p>
          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center gap-2 bg-white text-black border-2 border-gray-600 px-8 py-4 font-semibold hover:bg-black hover:text-white hover:border-black hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            {t('cart.startShopping')}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
  <div className="max-w-6xl mx-auto">
    {/* Header */}
    <div className="mb-8 text-center lg:text-left">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('cart.shoppingCart')}</h1>
      <p className="text-gray-600">{items.length} {t('cart.itemsInCart')}</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {items.map((item, index) => (
          <div
            key={`${item.product._id}-${item.size}`}
            className="bg-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row gap-4 md:gap-6"
          >
            {/* Product Image */}
            <div className="w-full md:w-32 h-40 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={`${API_URL}${item.product.images[0]}`}
                alt={item.product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-500 uppercase">
                    {item.product.category.replace('-', ' ')}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.product._id, item.size)}
                  className="text-red-500 hover:text-red-600 p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-2 flex flex-wrap items-center gap-4">
                <span className="text-sm text-gray-600">{t('cart.size')}: </span>
                <span className="font-medium">{item.size}</span>

                {item.color && item.colorCode && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{t('cart.color')}:</span>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: item.colorCode }}
                      />
                      <span className="font-medium capitalize">{item.color}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity + Price */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      updateQuantity(item.product._id, item.size, item.quantity - 1)
                    }
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold w-12 text-center">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product._id, item.size, item.quantity + 1)
                    }
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)} DNT
                  </div>
                  {item.product.discountPrice && (
                    <div className="text-sm text-gray-400 line-through">
                      {(item.product.price * item.quantity).toFixed(2)} DNT
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Clear Cart */}
        <div className="pt-4 flex justify-end">
          {showClearConfirm ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="text-red-800 font-medium">
                {t('cart.clearAllItems')}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    clearCart();
                    setShowClearConfirm(false);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  {t('cart.yesClearCart')}
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  {t('cart.cancel')}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-red-500 hover:text-red-600 font-medium"
            >
              {t('cart.clearCart')}
            </button>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl p-6 shadow-md lg:sticky lg:top-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('cart.orderSummary')}</h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>{t('cart.subtotal')} ({items.length} {t('cart.items')})</span>
              <span className="font-medium">{total.toFixed(2)} DNT</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>{t('cart.shipping')}</span>
              <span className="font-medium text-green-600">{t('cart.free')}</span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="text-lg font-bold text-gray-900">{t('cart.total')}</span>
              <span className="text-2xl font-bold text-gray-900">{total.toFixed(2)} DNT</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-white text-black border-2 border-gray-600 py-4 font-bold text-lg hover:bg-black hover:text-white hover:border-black hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            {t('cart.proceedToCheckout')}
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigate('/shop')}
            className="w-full mt-3 bg-gray-100 text-gray-700 py-4 font-medium hover:bg-gray-200 transition-colors border-2 border-gray-300"
          >
            {t('cart.continueShopping')}
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}
