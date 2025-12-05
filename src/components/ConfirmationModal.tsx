import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, AlertCircle, X } from 'lucide-react';
import Portal from './Portal';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message 
}: ConfirmationModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-2xl max-w-sm w-full overflow-hidden transform transition-all animate-scale-in">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2  hover:bg-gray-100 transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Header with Icon */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
          </div>

          {/* Content */}
          <div className="p-8">
            <p className="text-gray-600 text-center mb-8 text-lg">
              {message}
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 font-semibold border-2 border-gray-200 text-gray-700 bg-white  transition-all duration-300 hover:border-gray-900 hover:text-gray-900"
              >
                {t('common.cancel', 'Cancel')}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 px-4 py-3 font-semibold bg-red-800 text-white  shadow-lg transition-all duration-300 hover:bg-red-700 hover:shadow-xl hover:-translate-y-0.5"
              >
                {t('common.confirm', 'Confirm')}
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
  );
}
