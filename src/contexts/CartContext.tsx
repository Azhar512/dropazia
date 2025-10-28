import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, CartItem, Order } from '@/types/product';
import { useAuth } from '@/contexts/AuthContext';
import ApiService from '@/services/api';

interface CartContextType {
  cartItems: any[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  isInCart: (productId: string) => boolean;
  getCartItemQuantity: (productId: string) => number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load cart from database
  const loadCart = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await ApiService.getCart();
      setCartItems(response.data || []);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load cart when user changes
  useEffect(() => {
    loadCart();
  }, [user]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      console.log('🛒 Adding to cart:', product.id, product.name);
      await ApiService.addToCart(product.id, quantity);
      console.log('✅ Added to cart, refreshing...');
      await loadCart(); // Refresh cart from server
      console.log('✅ Cart refreshed:', cartItems);
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      alert('Failed to add item to cart: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      await ApiService.removeFromCart(productId);
      await loadCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      await ApiService.updateCartItem(productId, quantity);
      await loadCart();
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      await ApiService.clearCart();
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (productId: string) => {
    return cartItems.some(item => item.product_id === productId);
  };

  const getCartItemQuantity = (productId: string) => {
    const item = cartItems.find(item => item.product_id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartItemsCount,
      isInCart,
      getCartItemQuantity,
      loading
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
