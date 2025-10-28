import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ApiService from '@/services/api';

interface WishlistContextType {
  wishlist: any[];
  isLoading: boolean;
  addToWishlist: (productId: string, module: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  refreshWishlist: (module?: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [wishlistStatus, setWishlistStatus] = useState<Set<string>>(new Set());

  const refreshWishlist = useCallback(async (module?: string) => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await ApiService.getWishlist(module);
      if (response.success && response.data) {
        setWishlist(response.data);
        // Update wishlist status for quick checking
        const newStatus = new Set(response.data.map((item: any) => item.product?._id || item.product));
        setWishlistStatus(newStatus);
      }
    } catch (error) {
      console.error('Failed to refresh wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load wishlist when user changes
  useEffect(() => {
    if (user) {
      refreshWishlist();
    } else {
      setWishlist([]);
      setWishlistStatus(new Set());
    }
  }, [user, refreshWishlist]);

  const addToWishlist = useCallback(async (productId: string, module: string) => {
    if (!user) return;

    try {
      const response = await ApiService.addToWishlist(productId, module);
      if (response.success) {
        // Update local state
        const newStatus = new Set(wishlistStatus);
        newStatus.add(productId);
        setWishlistStatus(newStatus);
        // Refresh full wishlist
        await refreshWishlist(module);
      }
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      throw error;
    }
  }, [user, wishlistStatus, refreshWishlist]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    if (!user) return;

    try {
      const response = await ApiService.removeFromWishlist(productId);
      if (response.success) {
        // Update local state
        const newStatus = new Set(wishlistStatus);
        newStatus.delete(productId);
        setWishlistStatus(newStatus);
        // Refresh full wishlist
        setWishlist(prev => prev.filter(item => (item.product?._id || item.product) !== productId));
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      throw error;
    }
  }, [user, wishlistStatus]);

  const isInWishlist = useCallback((productId: string) => {
    return wishlistStatus.has(productId);
  }, [wishlistStatus]);

  const value: WishlistContextType = {
    wishlist,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

