import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import hanaLogo from '../assets/hanaModeLogo.png';
import Portal from './Portal';

interface VerifyEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string; // Email to verify
  onSuccess?: () => void; // Callback after successful verification
}

export default function VerifyEmailModal({ 
  isOpen, 
  onClose, 
  email,
  onSuccess 
}: VerifyEmailModalProps) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();
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
      setOtp('');
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/verify-email`, {
        email,
        otp,
      });

      const { token, user } = response.data;
      login(token, user);
      
      // Close modal
      onClose();
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Redirect based on role
      setTimeout(() => {
        if (user.role === 'admin') {
          navigate('/admin/products');
        } else {
          navigate('/');
        }
      }, 100);
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.verificationFailed'));
    } finally {
      setLoading(false);
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

            {/* Icon and Title */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-100 p-4 rounded-full">
                  <ShieldCheck className="w-8 h-8 text-gray-700" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('auth.verifyYourEmail')}
              </h2>
              <p className="text-gray-500 text-sm">
                {t('auth.verificationCodeSentTo')} <span className="font-medium text-gray-900">{email}</span>
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded mb-4">
                {error}
              </div>
            )}

            {/* Verify Email Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="modal-verify-otp" className="block text-sm font-medium text-gray-700 mb-2 text-center">
                  {t('auth.verificationCode')}
                </label>
                <input
                  id="modal-verify-otp"
                  name="otp"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-center tracking-widest text-lg font-semibold"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={loading}
                  maxLength={6}
                />
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
                {loading ? t('auth.verifying') : t('auth.verifyEmail')}
              </button>

              {/* Resend Code 
              <div className="text-center pt-2">
                <button 
                  type="button"
                  onClick={() => {
                    // You can implement resend OTP logic here if available
                    setError('');
                    // Call resend API if available
                  }}  
                  className="text-sm text-gray-600 hover:text-black"
                  disabled={loading}
                >
                  {t('auth.resendCode')}
                </button>
              </div>
              */}
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
