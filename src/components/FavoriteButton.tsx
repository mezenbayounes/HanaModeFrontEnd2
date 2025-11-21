import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface FavoriteButtonProps {
  productId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function FavoriteButton({ productId, className = '', size = 'md' }: FavoriteButtonProps) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    if (isProcessing) return;

    try {
      setIsProcessing(true);
      if (isFavorite(productId)) {
        await removeFromFavorites(productId);
      } else {
        await addToFavorites(productId);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const isFav = isFavorite(productId);

  return (
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
  );
}
