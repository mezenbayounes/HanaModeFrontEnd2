import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import ResetPasswordModal from './ResetPasswordModal';
import VerifyEmailModal from './VerifyEmailModal';

interface FavoriteButtonProps {
  productId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function FavoriteButton({ productId, className = '', size = 'md' }: FavoriteButtonProps) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState('');
  const [resetEmail, setResetEmail] = useState('');

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      // Show login modal if not authenticated
      setShowLoginModal(true);
      return;
    }

    if (isProcessing) return;

    try {
      setIsProcessing(true);
      if (isFavorite(Number(productId))) {
        await removeFromFavorites(Number(productId));
      } else {
        await addToFavorites(Number(productId));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
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

  const isFav = isFavorite(Number(productId));

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isProcessing}
        className={`p-2 bg-white  hover:bg-red-50 transition-colors ${
          isProcessing ? 'opacity-50 cursor-not-allowed' : ''
        } ${className}`}
        aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart
          className={`${iconSizes[size]} ${
            isFav ? 'text-red-500 fill-red-500' : 'text-gray-600'
          } transition-colors`}
        />
      </button>

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
