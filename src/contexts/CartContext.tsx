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

  // Load cart from database or localStorage
  const loadCart = async () => {
    if (!user) {
      // Load from localStorage for anonymous users
      const anonymousCart = JSON.parse(localStorage.getItem('anonymousCart') || '[]');
      setCartItems(anonymousCart);
      return;
    }
    
    try {
      setLoading(true);
      const response = await ApiService.getCart();
      const serverCart = response.data || [];
      
      // If there's anonymous cart data, merge it before clearing
      const anonymousCart = JSON.parse(localStorage.getItem('anonymousCart') || '[]');
      if (anonymousCart.length > 0) {
        // Merge anonymous cart with server cart
        for (const item of anonymousCart) {
          const existingItem = serverCart.find((si: any) => si.product_id === item.product_id);
          if (existingItem) {
            // Update quantity if product exists
            await ApiService.updateCartItem(item.product_id, existingItem.quantity + item.quantity);
          } else {
            // Add new item
            await ApiService.addToCart(item.product_id, item.quantity);
          }
        }
        localStorage.removeItem('anonymousCart');
      }
      
      const updatedResponse = await ApiService.getCart();
      setCartItems(updatedResponse.data || []);
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
    // Allow anonymous users to add to cart (will be stored in localStorage)
    // Cart will sync to database when user logs in
    if (!user) {
      // Store in localStorage for anonymous users
      const anonymousCart = JSON.parse(localStorage.getItem('anonymousCart') || '[]');
      const existingItem = anonymousCart.find((item: any) => item.product_id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        anonymousCart.push({
          product_id: product.id,
          productId: product.id,
          quantity,
          price: product.price,
          name: product.name
        });
      }
      
      localStorage.setItem('anonymousCart', JSON.stringify(anonymousCart));
      setCartItems(anonymousCart);
      return;
    }

    try {
      await ApiService.addToCart(product.id, quantity);
      await loadCart(); // Refresh cart from server
    } catch (error) {
      console.error('Error adding to cart:', error instanceof Error ? error.message : 'Unknown error');
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) {
      // Remove from localStorage for anonymous users
      const anonymousCart = JSON.parse(localStorage.getItem('anonymousCart') || '[]');
      const updatedCart = anonymousCart.filter((item: any) => item.product_id !== productId);
      localStorage.setItem('anonymousCart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      return;
    }
    
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

    if (!user) {
      // Update in localStorage for anonymous users
      const anonymousCart = JSON.parse(localStorage.getItem('anonymousCart') || '[]');
      const item = anonymousCart.find((item: any) => item.product_id === productId);
      if (item) {
        item.quantity = quantity;
        localStorage.setItem('anonymousCart', JSON.stringify(anonymousCart));
        setCartItems(anonymousCart);
      }
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
    if (!user) {
      // Clear localStorage for anonymous users
      localStorage.removeItem('anonymousCart');
      setCartItems([]);
      return;
    }
    
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
