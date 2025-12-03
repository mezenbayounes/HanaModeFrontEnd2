import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, Lock, Eye, EyeOff } from 'lucide-react';
import hanaLogo from '../assets/hanaModeLogo.png';
import { resetPassword } from '../api/authApi';
import Portal from './Portal';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Callback after successful reset
  onSwitchToLogin?: () => void; // To switch to login modal
  initialEmail?: string; // Pre-filled email from forgot password flow
}

export default function ResetPasswordModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  onSwitchToLogin,
  initialEmail = ''
}: ResetPasswordModalProps) {
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Update email when initialEmail changes
  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

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
      setNewPassword('');
      setConfirmPassword('');
      setMessage('');
      setError('');
      setLoading(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
      // Reset email to initialEmail (or empty if none)
      setEmail(initialEmail || '');
    }
  }, [isOpen, initialEmail]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      await resetPassword({ email, otp, newPassword, confirmPassword });
      setMessage(t('auth.resetPasswordSuccess'));
      
      // After 1.5 seconds, switch to login or navigate
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
        if (onSwitchToLogin) {
          onSwitchToLogin();
        } else {
          onClose();
          navigate('/user-login');
        }
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
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

            {/* Icon and Title */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-100 p-4 rounded-full">
                  <Lock className="w-8 h-8 text-gray-700" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('auth.resetPassword')}
              </h2>
              <p className="text-gray-500 text-sm">
                {t('auth.enterOTPAndNewPassword')}
              </p>
            </div>

            {/* Success Message */}
            {message && (
              <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded mb-4">
                {message}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded mb-4">
                {error}
              </div>
            )}

            {/* Reset Password Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="modal-reset-email" className="sr-only">
                  {t('auth.email')}
                </label>
                <input
                  id="modal-reset-email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder={t('auth.email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || !!message}
                />
              </div>

              <div>
                <label htmlFor="modal-otp" className="sr-only">
                  {t('auth.otp')}
                </label>
                <input
                  id="modal-otp"
                  name="otp"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-center tracking-widest"
                  placeholder={t('auth.otp')}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={loading || !!message}
                  maxLength={6}
                />
              </div>

              <div className="relative">
                <label htmlFor="modal-new-password" className="sr-only">
                  {t('auth.newPassword')}
                </label>
                <input
                  id="modal-new-password"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder={t('auth.newPassword')}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading || !!message}
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

              <div className="relative">
                <label htmlFor="modal-confirm-new-password" className="sr-only">
                  {t('auth.confirmNewPassword')}
                </label>
                <input
                  id="modal-confirm-new-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder={t('auth.confirmNewPassword')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading || !!message}
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

              <button
                type="submit"
                disabled={loading || !!message}
                className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold text-white transition-colors ${
                  loading || message
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black'
                }`}
              >
                {loading ? t('common.loading') : message ? '✓ ' + t('auth.resetPasswordSuccess') : t('auth.resetPassword')}
              </button>

              {/* Back to Login */}
              <div className="text-center pt-4">
                <button 
                  type="button"
                  onClick={handleSwitchToLogin}
                  className="text-sm text-gray-600 hover:text-black"
                >
                  ← {t('auth.backToLogin')}
                </button>
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
