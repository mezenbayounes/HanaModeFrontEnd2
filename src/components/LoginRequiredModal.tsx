import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Heart, X } from 'lucide-react';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginRequiredModal({ isOpen, onClose }: LoginRequiredModalProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoToLogin = () => {
    navigate('/user-login');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12">
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
              {t('favorites.cancel')}
            </button>
            <button
              onClick={handleGoToLogin}
              className="flex-1 px-6 py-3 font-semibold border-2 border-gray-600 text-black bg-white transition-all duration-300 hover:bg-black hover:text-white hover:border-black hover:shadow-xl hover:scale-105"
            >
              {t('favorites.goToLogin')}
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
  );
}
