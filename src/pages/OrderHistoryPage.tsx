import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, CreditCard, MapPin, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { API_URL } from '../config';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    images: string[];
    price: number;
    discountPrice?: number;
  };
  quantity: number;
  size: string;
  color?: string;
  colorCode?: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  customerDetails: {
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
  };
}

export default function OrderHistoryPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, token]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/api/orders/user/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded w-1/3" />
            <div className="h-40 bg-gray-200 rounded" />
            <div className="h-40 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 font-hana">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-8 h-8 text-gray-700" />
            <h1 className="text-4xl font-bold text-gray-900">
              {t('orderHistory.title', 'My Orders')}
            </h1>
          </div>
          <p className="text-gray-600">
            {t('orderHistory.subtitle', 'View and track your order history')}
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && orders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('orderHistory.noOrders', 'No orders yet')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('orderHistory.startShopping', 'Start shopping to see your orders here')}
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold hover:bg-gray-800 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {t('common.shop', 'Shop Now')}
            </button>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
            >
              {/* Order Header */}
              <div className="bg-gray-50 border-b border-gray-200 p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {new Date(order.orderDate).toLocaleDateString(i18n.language, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{t('orders.orderId')}:</span>
                      <span className="text-xs font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                        {order._id}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">{t('orders.total')}</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {order.total.toFixed(2)} DNT
                      </div>
                    </div>
                    <div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {t(`orders.status_${order.status}`, order.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4 md:p-6">
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-20 h-24 flex-shrink-0 bg-white rounded-lg overflow-hidden shadow-sm">
                        <img
                          src={`${API_URL}${item.product.images[0]}`}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 mb-1 truncate">
                          {item.product.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 text-sm mb-2">
                          <span className="text-gray-600">
                            {t('product.size')}: <span className="font-medium">{item.size}</span>
                          </span>
                          {item.color && (
                            <span className="text-gray-600">
                              • {t('product.color')}:{' '}
                              <span className="font-medium capitalize">{item.color}</span>
                            </span>
                          )}
                          <span className="text-gray-600">
                            • {t('product.quantity')}: <span className="font-medium">{item.quantity}</span>
                          </span>
                        </div>
                        <div className="text-right">
                          {item.product.discountPrice && item.product.discountPrice > 0 && item.product.discountPrice < item.product.price ? (
                            // Has valid discount - show discount price and strikethrough original
                            <>
                              <p className="font-bold text-gray-900">
                                {(item.product.discountPrice * item.quantity).toFixed(2)} DNT
                              </p>
                              <p className="text-xs text-gray-400 line-through">
                                {(item.product.price * item.quantity).toFixed(2)} DNT
                              </p>
                            </>
                          ) : (
                            // No discount - just show regular price
                            <p className="font-bold text-gray-900">
                              {(item.product.price * item.quantity).toFixed(2)} DNT
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Address */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{t('orderConfirmation.deliveryAddress')}</p>
                      <p className="text-sm font-medium text-gray-900">
                        {order.customerDetails.firstName} {order.customerDetails.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{order.customerDetails.phone}</p>
                      <p className="text-sm text-gray-600">{order.customerDetails.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
