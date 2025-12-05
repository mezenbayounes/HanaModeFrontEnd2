import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import React, { useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../config';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const total = getTotal();

  // Close drawer when route changes
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    onClose();
    navigate('/shop');
  };

  return (
    <>
      {/* Dark Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[60]"
        onClick={onClose}
      />

      {/* Drawer - Full Height, White Background */}
      <div className="fixed top-0 right-0 h-screen w-full sm:w-[450px] bg-white shadow-xl z-[70] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            <h2 className="text-2xl font-bold">{t('cart.shoppingCart')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <ShoppingCart className="w-20 h-20 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {t('cart.empty')}
            </h3>
            <p className="text-gray-600 mb-6">{t('cart.startShopping')}</p>
            <button
              onClick={handleContinueShopping}
              className="px-6 py-3 bg-gray-900 text-white  font-medium hover:bg-gray-800 transition-colors"
            >
              {t('cart.continueShopping')}
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.map((item) => {
                const itemPrice = item.product.discountPrice && item.product.discountPrice > 0 && item.product.discountPrice < item.product.price
                  ? item.product.discountPrice
                  : item.product.price;

                return (
                  <div
                    key={`${item.product.id}-${item.size}-${item.color || 'default'}`}
                    className="bg-gray-50 rounded-xl p-4 flex gap-4"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={`${API_URL}${item.product.images[0]}`}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-gray-900 text-sm line-clamp-1">
                          {item.product.name}
                        </h3>
                        <button
                          onClick={() => removeItem(item.product.id, item.size)}
                          className="text-red-500 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-gray-500 mb-2">
                        {t('cart.size')}: {item.size}
                        {item.color && ` • ${t('cart.color')}: ${item.color}`}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 bg-white rounded-full border border-gray-200">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-medium w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="font-bold text-gray-900">
                            {(itemPrice * item.quantity).toFixed(2)} DNT
                          </div>
                          {item.product.discountPrice && item.product.discountPrice > 0 && item.product.discountPrice < item.product.price && (
                            <div className="text-xs text-gray-400 line-through">
                              {(item.product.price * item.quantity).toFixed(2)} DNT
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer - Order Summary & Checkout */}
            <div className="border-t border-gray-200 p-6 space-y-4 bg-gray-50">
              {/* Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{t('cart.subtotal')} ({items.length} {t('cart.items')})</span>
                  <span className="font-medium">{total.toFixed(2)} DNT</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{t('cart.shipping')}</span>
                  <span className="font-medium text-green-600">{t('cart.free')}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-bold text-gray-900">{t('cart.total')}</span>
                  <span className="text-xl font-bold text-gray-900">{total.toFixed(2)} DNT</span>
                </div>
              </div>

              {/* Buttons */}
              <button
                onClick={handleCheckout}
                className="w-full bg-gray-900 text-white py-3  font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                {t('cart.proceedToCheckout')}
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={handleContinueShopping}
                className="w-full bg-white text-gray-700 py-3  font-medium hover:bg-gray-100 transition-colors border border-gray-300"
              >
                {t('cart.continueShopping')}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
