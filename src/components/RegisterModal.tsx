import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { X, Eye, EyeOff } from 'lucide-react';
import hanaLogo from '../assets/hanaModeLogo.png';
import { API_URL } from '../config';
import Portal from './Portal';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess?: () => void;
  onSwitchToLogin?: () => void; // To switch to login modal
  onSwitchToVerifyEmail?: (email: string) => void; // To switch to verify email modal
  returnUrl?: string; // Optional URL to return to after registration
}

export default function RegisterModal({ 
  isOpen, 
  onClose, 
  onRegisterSuccess, 
  onSwitchToLogin,
  onSwitchToVerifyEmail,
  returnUrl 
}: RegisterModalProps) {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: '',
    email: '',
    confirmEmail: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Scroll to top when error occurs
  useEffect(() => {
    if (error && modalContentRef.current) {
      modalContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [error]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setForm({
        name: '',
        email: '',
        confirmEmail: '',
        address: '',
        password: '',
        confirmPassword: '',
      });
      setError('');
      setLoading(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.email !== form.confirmEmail) {
      setError(t('auth.emailsDoNotMatch'));
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError(t('auth.passwordsDoNotMatch'));
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/register`, {
        name: form.name,
        email: form.email,
        address: form.address,
        password: form.password,
      });
      
      if (data.requiresVerification) {
        if (onSwitchToVerifyEmail) {
          onSwitchToVerifyEmail(form.email);
        } else {
          onClose();
          navigate('/verify-email', { state: { email: form.email } });
        }
      } else {
        register(data.token, data.user);
        
        // Reset form
        setForm({
          name: '',
          email: '',
          confirmEmail: '',
          address: '',
          password: '',
          confirmPassword: '',
        });
        setError('');
        
        // Close modal first
        onClose();
        
        // Then call success callback after a small delay
        setTimeout(() => {
          if (onRegisterSuccess) {
            onRegisterSuccess();
          }
        }, 100);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    // Save returnUrl to localStorage so we can redirect back after callback
    if (returnUrl) {
      localStorage.setItem('authReturnUrl', returnUrl);
    }
    
    const redirectParam = returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : '';
    window.location.href = `${API_URL}/api/auth/google${redirectParam}`;
  };

  const handleSwitchToLogin = () => {
    if (onSwitchToLogin) {
      onSwitchToLogin();
    } else {
      onClose();
      navigate('/user-login');
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        {/* Backdrop */}
        <div 
          className="absolute inset-0"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div 
          ref={modalContentRef}
          className="relative bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-scale-in max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 transition-colors z-10 rounded-full"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>

          {/* Content */}
          <div className="p-8">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <img src={hanaLogo} alt="Hana Mode Logo" className="h-20 w-auto object-contain" />
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <p className="text-2xl font-bold text-gray-900">
                {t('auth.signUpTitle')}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded mb-4">
                {error}
              </div>
            )}

            {/* Register Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="modal-name" className="sr-only">
                    {t('auth.name')}
                  </label>
                  <input
                    id="modal-name"
                    name="name"
                    type="text"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder={t('auth.name')}
                    value={form.name}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="modal-email" className="sr-only">
                    {t('auth.email')}
                  </label>
                  <input
                    id="modal-email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder={t('auth.email')}
                    value={form.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Confirm Email */}
                <div>
                  <label htmlFor="modal-confirm-email" className="sr-only">
                    {t('auth.confirmEmail')}
                  </label>
                  <input
                    id="modal-confirm-email"
                    name="confirmEmail"
                    type="email"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder={t('auth.confirmEmail')}
                    value={form.confirmEmail}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="modal-address" className="sr-only">
                    {t('auth.enterAddress')}
                  </label>
                  <textarea
                    id="modal-address"
                    name="address"
                    rows={2}
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                    placeholder={t('auth.enterAddress')}
                    value={form.address}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <label htmlFor="modal-password" className="sr-only">
                    {t('auth.password')}
                  </label>
                  <input
                    id="modal-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder={t('auth.password')}
                    value={form.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <label htmlFor="modal-confirm-password" className="sr-only">
                    {t('auth.confirmPassword')}
                  </label>
                  <input
                    id="modal-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder={t('auth.confirmPassword')}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold text-white transition-colors ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black'
                }`}
              >
                {loading ? t('common.loading') : t('auth.createAccount')}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">{t('auth.orContinueWith')}</span>
                </div>
              </div>

              {/* Google Sign Up */}
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={loading}
                className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-300 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {t('auth.signInWithGoogle')}
              </button>

              {/* Link to Login */}
              <div className="text-center pt-4">
                <span className="text-sm text-gray-600">
                  {t('auth.alreadyHaveAccount')}{' '}
                  <button 
                    type="button"
                    onClick={handleSwitchToLogin}
                    className="font-medium text-black hover:text-gray-800"
                  >
                    {t('auth.signIn')}
                  </button>
                </span>
              </div>
            </form>
          </div>
        </div>

        <style>{`
          @keyframes scale-in {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-scale-in {
            animation: scale-in 0.3s ease-out;
          }
        `}</style>
      </div>
    </Portal>
  );
}
