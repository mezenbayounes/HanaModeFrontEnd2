import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home, ShoppingBag, Package, MapPin, Phone, User, Mail } from 'lucide-react';
import { Order } from '../types/Product';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { API_URL } from '../config';

export default function OrderConfirmationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const orderData = localStorage.getItem('lastOrder');
    if (orderData) {
      setOrder(JSON.parse(orderData));
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-4 shadow-lg">
            <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            {t('orderConfirmation.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('orderConfirmation.thankYou')}
          </p>
        </div>

        {/* Order ID Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('orderConfirmation.orderId')}</p>
              <p className="text-2xl font-bold text-gray-900 font-mono">{order.id}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-gray-500 mb-1">{t('orderConfirmation.orderDate')}</p>
              <p className="font-semibold text-gray-900">
                {new Date(order.orderDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Customer & Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                {t('orderConfirmation.customerInfo')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">{t('orderConfirmation.name')}</p>
                    <p className="font-semibold text-gray-900">
                      {order.customerDetails.firstName} {order.customerDetails.lastName}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">{t('orderConfirmation.email')}</p>
                    <p className="font-semibold text-gray-900">{order.customerDetails.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">{t('orderConfirmation.phone')}</p>
                    <p className="font-semibold text-gray-900">{order.customerDetails.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">{t('orderConfirmation.deliveryAddress')}</p>
                    <p className="font-semibold text-gray-900">{order.customerDetails.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                {t('orderConfirmation.orderItems')}
              </h2>
              <div className="space-y-4">
                {order.items.map((item, idx) => {
                  const product = item.product || {};
                  const productName = product.name || t('product.unknown', 'Unknown Product');
                  const productImage = product.images?.[0];
                  const productCategory = product.category || '';
                  const productPrice = product.price || 0;
                  const productDiscountPrice = product.discountPrice;

                  return (
                  <div
                    key={idx}
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-20 h-24 flex-shrink-0 bg-white rounded-lg overflow-hidden shadow-sm">
                      {productImage ? (
                        <img
                          src={`${API_URL}${productImage}`}
                          alt={productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-1 truncate">
                        {productName}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {productCategory.replace('-', ' ')} • Size: {item.size}
                      </p>

                      {item.color && item.colorCode && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-gray-600">Color:</span>
                          <div className="flex items-center gap-1.5">
                            <div
                              className="w-4 h-4 rounded-full border-2 border-gray-300"
                              style={{ backgroundColor: item.colorCode }}
                            />
                            <span className="text-sm font-medium capitalize">{item.color}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </span>
                        <div className="text-right">
                          {productDiscountPrice && productDiscountPrice > 0 && productDiscountPrice < productPrice ? (
                            <>
                              <p className="font-bold text-gray-900">
                                {(productDiscountPrice * item.quantity).toFixed(2)} DNT
                              </p>
                              <p className="text-xs text-gray-400 line-through">
                                {(productPrice * item.quantity).toFixed(2)} DNT
                              </p>
                            </>
                          ) : (
                            <p className="font-bold text-gray-900">
                              {(productPrice * item.quantity).toFixed(2)} DNT
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t('orderConfirmation.orderSummary')}</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>{t('orderConfirmation.subtotal')}</span>
                  <span className="font-semibold">{order.total.toFixed(2)} DNT</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t('orderConfirmation.shipping')}</span>
                  <span className="font-semibold text-green-600">{t('orderConfirmation.free')}</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">{t('orderConfirmation.total')}</span>
                    <span className="text-3xl font-bold text-gray-900">{order.total.toFixed(2)} DNT</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/')}
                  className="w-full inline-flex items-center justify-center gap-2 bg-white text-black border-2 border-gray-600 px-6 py-3 font-semibold hover:bg-black hover:text-white hover:border-black hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <Home className="w-5 h-5" />
                  {t('orderConfirmation.backToHome')}
                </button>
                <button
                  onClick={() => navigate('/shop')}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 border-2 border-gray-300 px-6 py-3 font-semibold hover:bg-gray-200 transition-all duration-300"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {t('orderConfirmation.continueShopping')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
