import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, Order } from '@/types/product';
import ApiService from '@/services/api';

interface ProductContextType {
  products: Product[];
  orders: Order[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductsByModule: (module: 'daraz' | 'shopify') => Product[];
  getActiveProducts: () => Product[];
  addOrder: (order: Order) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  getOrdersByCustomer: (customerId: string) => Order[];
  getOrderById: (id: string) => Order | undefined;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "order-1",
      customerId: "user-1",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      items: [
        {
          productId: "1",
          productName: "Summer Dress Collection",
          productImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
          quantity: 2,
          price: 2500,
          totalPrice: 5000
        }
      ],
      totalAmount: 5000,
      status: "delivered",
      paymentStatus: "paid",
      shippingAddress: {
        street: "123 Main Street",
        city: "Karachi",
        state: "Sindh",
        zipCode: "75000",
        country: "Pakistan"
      },
      createdAt: "2025-01-15T10:00:00Z",
      updatedAt: "2025-01-18T14:30:00Z",
      module: "daraz"
    },
    {
      id: "order-2",
      customerId: "user-1",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      items: [
        {
          productId: "2",
          productName: "Men's Watch",
          productImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
          quantity: 1,
          price: 5000,
          totalPrice: 5000
        }
      ],
      totalAmount: 5000,
      status: "shipped",
      paymentStatus: "paid",
      shippingAddress: {
        street: "123 Main Street",
        city: "Karachi",
        state: "Sindh",
        zipCode: "75000",
        country: "Pakistan"
      },
      createdAt: "2025-01-20T09:00:00Z",
      updatedAt: "2025-01-21T11:00:00Z",
      module: "daraz"
    },
    {
      id: "order-3",
      customerId: "user-2",
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
      items: [
        {
          productId: "3",
          productName: "Premium Home Decor Set",
          productImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
          quantity: 1,
          price: 3500,
          totalPrice: 3500
        }
      ],
      totalAmount: 3500,
      status: "pending",
      paymentStatus: "pending",
      shippingAddress: {
        street: "456 Oak Avenue",
        city: "Lahore",
        state: "Punjab",
        zipCode: "54000",
        country: "Pakistan"
      },
      createdAt: "2025-01-22T15:30:00Z",
      updatedAt: "2025-01-22T15:30:00Z",
      module: "shopify"
    }
  ]);

  // Load products from API on component mount
  useEffect(() => {
    refreshProducts();
  }, []);

  const refreshProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading products from API...');
      const response = await ApiService.getProducts();
      console.log('✅ Products loaded:', response);
      
      // Map database products to frontend format (convert _id to id)
      const mappedProducts = (response.data || []).map((product: any) => ({
        ...product,
        id: product._id || product.id, // Use _id from database as id for frontend
        images: product.images || [],
        documents: product.documents || [],
        specifications: product.specifications || []
      }));
      
      console.log('📦 Mapped products:', mappedProducts.length, 'products');
      setProducts(mappedProducts);
    } catch (err) {
      console.error('❌ Failed to load products:', err);
      setError('Failed to load products');
      // Fallback to empty array if API fails
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      setError(null);
      console.log('🔄 Creating product:', productData);
      const response = await ApiService.createProduct(productData);
      console.log('✅ Product created:', response);
      
      // Map the created product to frontend format
      const mappedProduct = {
        ...response.data,
        id: response.data._id || response.data.id,
        images: response.data.images || [],
        documents: response.data.documents || [],
        specifications: response.data.specifications || []
      };
      
      setProducts(prev => [...prev, mappedProduct]);
      console.log('✅ Product added to context');
    } catch (err: any) {
      console.error('❌ Failed to create product:', err);
      const errorMessage = err?.message || err?.response?.data?.message || 'Failed to create product';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      setError(null);
      const response = await ApiService.updateProduct(id, updates);
      
      // Map the updated product to frontend format
      const mappedProduct = {
        ...response.data,
        id: response.data._id || response.data.id,
        images: response.data.images || [],
        documents: response.data.documents || [],
        specifications: response.data.specifications || []
      };
      
      setProducts(prev => prev.map(product => 
        product.id === id ? mappedProduct : product
      ));
    } catch (err) {
      console.error('Failed to update product:', err);
      setError('Failed to update product');
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setError(null);
      await ApiService.deleteProduct(id);
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (err) {
      console.error('Failed to delete product:', err);
      setError('Failed to delete product');
      throw err;
    }
  };

  const getProductsByModule = (module: 'daraz' | 'shopify') => {
    return products.filter(product => product.module === module && product.status === 'active');
  };

  const getActiveProducts = () => {
    return products.filter(product => product.status === 'active');
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [...prev, order]);
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, ...updates, updatedAt: new Date().toISOString() } : order
    ));
  };

  const getOrdersByCustomer = (customerId: string) => {
    return orders.filter(order => order.customerId === customerId);
  };

  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id);
  };

  return (
    <ProductContext.Provider value={{
      products,
      orders,
      loading,
      error,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductsByModule,
      getActiveProducts,
      addOrder,
      updateOrder,
      getOrdersByCustomer,
      getOrderById,
      refreshProducts
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
