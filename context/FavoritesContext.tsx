import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '@clerk/clerk-expo';

interface FavoritesContextProps {
  favorites: any[];
  addToFavorites: (item: any) => void;
  removeFromFavorites: (itemId: string) => void;
  loadFavorites: () => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextProps | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const { userId, isSignedIn } = useAuth();

  useEffect(() => {
    if (userId) {
      loadFavorites();
    } else {
      clearFavorites();
    }
  }, [userId, isSignedIn]);

  const saveFavorites = async (favorites: any[]) => {
    try {
      await SecureStore.setItemAsync(`favorites_${userId}`, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites', error);
    }
  };

  const loadFavorites = async () => {
    try {
      const favoritesString = await SecureStore.getItemAsync(`favorites_${userId}`);
      if (favoritesString) {
        setFavorites(JSON.parse(favoritesString));
      }
    } catch (error) {
      console.error('Error loading favorites', error);
    }
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const addToFavorites = (item: any) => {
    const newFavorites = [...favorites, item];
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
    console.log(`Lugar guardado por el usuario ${userId}:`, item);
  };

  const removeFromFavorites = (itemId: string) => {
    const newFavorites = favorites.filter(item => item.id !== itemId);
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, loadFavorites, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};