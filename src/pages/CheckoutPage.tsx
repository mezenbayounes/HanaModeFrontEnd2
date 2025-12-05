import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, CheckCircle } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { OrderDetails } from '../types/Product';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { createOrder } from "../api/ordersApi"; 
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import ResetPasswordModal from '../components/ResetPasswordModal';
import VerifyEmailModal from '../components/VerifyEmailModal';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const { isAuthenticated, token } = useAuth();

  const handlePlaceOrderClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      processOrder();
    }
  };

  const processOrder = async () => {
    // Prevent double submission
    if (isSubmitting) return;

    setIsSubmitting(true); // Disable button

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
          product: item.product.id,
          quantity: item.quantity,
          size: item.size,
          colorName: item.color, // Send color name
          colorCode: item.colorCode // Send color hex code
        })),
        customerDetails: formData,
        total,
      };

      // Get token from state OR directly from localStorage to ensure we have the latest one
      // immediately after login (React state updates might be slightly delayed)
      const currentToken = token || localStorage.getItem('token');
      
      const savedOrder = await createOrder(orderData, currentToken || undefined);

      // Construct a complete order object for display, merging backend info with frontend product details
      const completeOrderForDisplay = {
        ...savedOrder,
        items: items, // Use the items from the cart which have full product details (images, name, etc.)
      };

      // Save the complete order to localStorage so OrderConfirmationPage can read it
      localStorage.setItem("lastOrder", JSON.stringify(completeOrderForDisplay));

      // ✨ FIX: navigate AFTER render cycle
      setTimeout(() => {
        navigate("/order-confirmation");
      }, 0);

      // Clear cart a bit later
      setTimeout(() => clearCart(), 100);

    } catch (error) {
      console.error("Order creation failed:", error);
      alert(t('checkout.orderError'));
      setIsSubmitting(false); // Re-enable button on error
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 relative">
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
            <form onSubmit={handlePlaceOrderClick} className="bg-white rounded-2xl p-8 shadow-md">
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
                disabled={isSubmitting}
                className={`w-full py-4 font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 border-2 ${
                  isSubmitting
                    ? 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed'
                    : 'bg-white text-black border-gray-600 hover:bg-black hover:text-white hover:border-black hover:shadow-xl hover:scale-105'
                }`}
              >
                <CheckCircle className="w-6 h-6" />
                {isSubmitting ? t('checkout.processing', 'Processing...') : t('checkout.placeOrder')}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-md sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('checkout.orderSummary')}</h2>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
  {items.map((item) => (
    <div key={`${item.product.id}-${item.size}`} className="flex gap-3">
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

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[9997] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all scale-100 animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {t('checkout.trackOrderTitle', 'Track Your Order')}
              </h3>
              <p className="text-gray-600">
                {t('checkout.trackOrderMessage', 'Sign in to save this order to your history and track its status easily.')}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  setShowLoginModal(true);
                }}
                className="w-full py-3 px-4 bg-black text-white font-bold  hover:bg-gray-800 transition-colors shadow-lg"
              >
                {t('auth.signIn')}
              </button>
              
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  processOrder();
                }}
                className="w-full py-3 px-4 bg-white text-gray-900 font-bold border-2 border-gray-200  hover:bg-gray-50 transition-colors"
              >
                {t('cart.cancel', 'Continue as Guest')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        returnUrl="/checkout"
        onLoginSuccess={() => {
          setShowLoginModal(false);
          processOrder();
        }}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowForgotPasswordModal(false);
          setShowResetPasswordModal(false);
          setShowVerifyEmailModal(false);
          setShowRegisterModal(true);
        }}
        onSwitchToForgotPassword={() => {
          setShowLoginModal(false);
          setShowRegisterModal(false);
          setShowResetPasswordModal(false);
          setShowVerifyEmailModal(false);
          setShowForgotPasswordModal(true);
        }}
        onSwitchToVerifyEmail={(email) => {
          setVerifyEmail(email);
          setShowLoginModal(false);
          setShowRegisterModal(false);
          setShowForgotPasswordModal(false);
          setShowResetPasswordModal(false);
          setShowVerifyEmailModal(true);
        }}
      />

      {/* Register Modal */}
      <RegisterModal 
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowForgotPasswordModal(false);
          setShowResetPasswordModal(false);
          setShowVerifyEmailModal(false);
          setShowLoginModal(true);
        }}
        onSwitchToVerifyEmail={(email) => {
          setVerifyEmail(email);
          setShowLoginModal(false);
          setShowRegisterModal(false);
          setShowForgotPasswordModal(false);
          setShowResetPasswordModal(false);
          setShowVerifyEmailModal(true);
        }}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal 
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        onSwitchToReset={(email) => {
          setResetEmail(email);
          setShowForgotPasswordModal(false);
          setShowLoginModal(false);
          setShowRegisterModal(false);
          setShowVerifyEmailModal(false);
          setShowResetPasswordModal(true);
        }}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowForgotPasswordModal(false);
          setShowResetPasswordModal(false);
          setShowVerifyEmailModal(false);
          setShowLoginModal(true);
        }}
      />

      {/* Reset Password Modal */}
      <ResetPasswordModal 
        isOpen={showResetPasswordModal}
        onClose={() => setShowResetPasswordModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowForgotPasswordModal(false);
          setShowResetPasswordModal(false);
          setShowVerifyEmailModal(false);
          setShowLoginModal(true);
        }}
        initialEmail={resetEmail}
      />

      {/* Verify Email Modal */}
      <VerifyEmailModal 
        isOpen={showVerifyEmailModal}
        onClose={() => setShowVerifyEmailModal(false)}
        email={verifyEmail}
      />
    </div>
  );
}
