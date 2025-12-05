import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, X } from 'lucide-react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import ResetPasswordModal from './ResetPasswordModal';
import VerifyEmailModal from './VerifyEmailModal';
import Portal from './Portal';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginRequiredModal({ isOpen, onClose }: LoginRequiredModalProps) {
  const { t } = useTranslation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState('');
  const [resetEmail, setResetEmail] = useState('');

  if (!isOpen) return null;

  const handleGoToLogin = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    onClose();
  };

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowForgotPasswordModal(false);
    setShowResetPasswordModal(false);
    setShowVerifyEmailModal(false);
    setShowRegisterModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowForgotPasswordModal(false);
    setShowResetPasswordModal(false);
    setShowVerifyEmailModal(false);
    setShowLoginModal(true);
  };

  const handleSwitchToForgotPassword = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setShowResetPasswordModal(false);
    setShowVerifyEmailModal(false);
    setShowForgotPasswordModal(true);
  };

  const handleSwitchToReset = (email: string) => {
    setResetEmail(email);
    setShowForgotPasswordModal(false);
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setShowVerifyEmailModal(false);
    setShowResetPasswordModal(true);
  };

  const handleOpenVerifyEmail = (email: string) => {
    setVerifyEmail(email);
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setShowForgotPasswordModal(false);
    setShowResetPasswordModal(false);
    setShowVerifyEmailModal(true);
  };

  return (
    <>
      <Portal>
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-scale-in">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* Header with Icon */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
                <Heart className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('favorites.loginRequiredTitle')}
              </h2>
            </div>

            {/* Content */}
            <div className="p-8">
              <p className="text-gray-600 text-center mb-8 text-lg">
                {t('favorites.loginRequiredMessage')}
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 font-semibold border-2 border-gray-600 text-black bg-white transition-all duration-300 hover:bg-black hover:text-white hover:border-black hover:shadow-xl hover:scale-105"
                >
                  {t('checkout.continueGuest')}
                </button>
                <button
                  onClick={handleGoToLogin}
                className="w-full py-3 px-4 bg-black text-white font-bold  hover:bg-gray-800 transition-colors shadow-lg"
                >
                  {t('auth.signIn')}
                </button>
              </div>
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

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={handleSwitchToRegister}
        onSwitchToForgotPassword={handleSwitchToForgotPassword}
        onSwitchToVerifyEmail={handleOpenVerifyEmail}
      />

      {/* Register Modal */}
      <RegisterModal 
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={handleSwitchToLogin}
        onSwitchToVerifyEmail={handleOpenVerifyEmail}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal 
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        onSwitchToReset={handleSwitchToReset}
        onSwitchToLogin={handleSwitchToLogin}
      />

      {/* Reset Password Modal */}
      <ResetPasswordModal 
        isOpen={showResetPasswordModal}
        onClose={() => setShowResetPasswordModal(false)}
        onSwitchToLogin={handleSwitchToLogin}
        initialEmail={resetEmail}
      />

      {/* Verify Email Modal */}
      <VerifyEmailModal 
        isOpen={showVerifyEmailModal}
        onClose={() => setShowVerifyEmailModal(false)}
        email={verifyEmail}
      />
    </>
  );
}
