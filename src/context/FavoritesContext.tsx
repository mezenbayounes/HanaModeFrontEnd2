import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { API_URL } from '../config';

interface Product {
  id: number;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  inStock: boolean;
}

interface FavoritesContextType {
  favorites: Product[];
  loading: boolean;
  addToFavorites: (productId: number) => Promise<void>;
  removeFromFavorites: (productId: number) => Promise<void>;
  isFavorite: (productId: number) => boolean;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { token, isAuthenticated } = useAuth();

  const refreshFavorites = async () => {
    if (!isAuthenticated || !token) {
      setFavorites([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFavorites(response.data.favorites || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshFavorites();
  }, [isAuthenticated, token]);

  const addToFavorites = async (productId: number) => {
    if (!isAuthenticated || !token) {
      throw new Error('Must be logged in to add favorites');
    }

    try {
      await axios.post(
        `${API_URL}/api/favorites`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await refreshFavorites();
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  };

  const removeFromFavorites = async (productId: number) => {
    if (!isAuthenticated || !token) {
      throw new Error('Must be logged in to remove favorites');
    }

    try {
      await axios.delete(`${API_URL}/api/favorites/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await refreshFavorites();
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  };

  const isFavorite = (productId: number): boolean => {
    return favorites.some((product) => product.id === productId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
