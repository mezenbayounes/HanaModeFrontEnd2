import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, CheckCircle } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { OrderDetails } from '../types/Product';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { createOrder } from "../api/ordersApi"; 
import { API_URL } from '../config';

export default function CheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const [formData, setFormData] = useState<OrderDetails>({
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
    email: '',
  });
  const [errors, setErrors] = useState<Partial<OrderDetails>>({});

  const total = getTotal();

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const validate = (): boolean => {
    const newErrors: Partial<OrderDetails> = {};


    if (!formData.firstName.trim()) {
      newErrors.firstName = t('checkout.firstNameRequired');
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = t('checkout.lastNameRequired');
    }
    if (!formData.address.trim()) {
      newErrors.address = t('checkout.addressRequired');
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t('checkout.phoneRequired');
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = t('checkout.phoneInvalid');
    }
    if (!formData.email.trim()) {
      newErrors.email = t('checkout.emailRequired') || 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('checkout.emailInvalid') || 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validate()) return;

  try {
    const order = {
      id: `ORD-${Date.now()}`,
      items: [...items],
      customerDetails: { ...formData },
      total,
      orderDate: new Date(),
    };

    localStorage.setItem("lastOrder", JSON.stringify(order));

    const orderData = {
      items: items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        size: item.size,
        colorName: item.color, // Send color name
        colorCode: item.colorCode // Send color hex code
      })),
      customerDetails: formData,
      total,
    };

    const savedOrder = await createOrder(orderData);

    // ✨ FIX: navigate AFTER render cycle
    setTimeout(() => {
      navigate("/order-confirmation", {
        state: { order: savedOrder },
      });
    }, 0);

    // Clear cart a bit later
    setTimeout(() => clearCart(), 100);

  } catch (error) {
    console.error("Order creation failed:", error);
    alert(t('checkout.orderError'));
  }
};

  const handleChange = (field: keyof OrderDetails) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/cart')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('checkout.back')}
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('checkout.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('checkout.customerDetails')}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('checkout.firstName')} *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange('firstName')}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.firstName ? 'border-red-300' : 'border-gray-300'
                    } focus:ring-2 focus:ring-rose-500 focus:border-transparent`}
                    placeholder={t('checkout.enterFirstName')}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('checkout.lastName')} *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange('lastName')}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.lastName ? 'border-red-300' : 'border-gray-300'
                    } focus:ring-2 focus:ring-rose-500 focus:border-transparent`}
                    placeholder={t('checkout.enterLastName')}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>


              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('checkout.email')} *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } focus:ring-2 focus:ring-rose-500 focus:border-transparent`}
                  placeholder={t('checkout.enterEmail') || 'Enter your email'}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('checkout.phone')} *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  } focus:ring-2 focus:ring-rose-500 focus:border-transparent`}
                  placeholder={t('checkout.enterPhone')}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('checkout.address')} *
                </label>
                <textarea
                  value={formData.address}
                  onChange={handleChange('address')}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.address ? 'border-red-300' : 'border-gray-300'
                  } focus:ring-2 focus:ring-rose-500 focus:border-transparent`}
                  placeholder={t('checkout.enterAddress')}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black border-2 border-gray-600 py-4 font-bold text-lg hover:bg-black hover:text-white hover:border-black hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-6 h-6" />
                {t('checkout.placeOrder')}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-md sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('checkout.orderSummary')}</h2>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
  {items.map((item) => (
    <div key={`${item.product._id}-${item.size}`} className="flex gap-3">
      {/* Product Image */}
      <div className="w-16 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={`${API_URL}${item.product.images[0]}`}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm text-gray-900 truncate">
          {item.product.name}
        </h3>
        <p className="text-xs text-gray-500">{t('checkout.size')}: {item.size}</p>

        {/* Quantity and Color */}
        <div className="mt-1 flex flex-col gap-1">
          {/* Quantity */}
          <span className="text-xs text-gray-600">{t('checkout.qty')}: {item.quantity}</span>

          {item.color && item.colorCode ? (
  <div className="flex items-center gap-2 mt-1">
    <span className="text-xs text-gray-600">{t('checkout.color')}:</span>
    <div className="flex items-center gap-1">
      <span
        className="w-4 h-4 rounded-full border border-gray-300"
        style={{ backgroundColor: item.colorCode }}
      ></span>
      <span className="text-xs capitalize">{item.color}</span>
    </div>
  </div>
) : null}

        </div>

        {/* Price */}
        <span className="font-bold text-sm mt-1 block">
          {((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)} DNT
        </span>
      </div>
    </div>
  ))}
</div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>{t('checkout.subtotal')}</span>
                  <span className="font-medium">{total.toFixed(2)} DNT</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t('checkout.shipping')}</span>
                  <span className="font-medium text-green-600">{t('checkout.free')}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-lg font-bold text-gray-900">{t('checkout.total')}</span>
                  <span className="text-2xl font-bold text-gray-900">{total.toFixed(2)} DNT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
