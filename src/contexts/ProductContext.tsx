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
  refreshOrders: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);

  // Load products and orders from API on component mount
  useEffect(() => {
    refreshProducts();
    refreshOrders();
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

  const refreshOrders = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        // User not logged in, clear orders
        setOrders([]);
        return;
      }

      console.log('🔄 Loading orders from API...');
      const response = await ApiService.getOrders();
      console.log('✅ Orders loaded:', response);
      
      if (response.success && response.data) {
        // Map database orders to frontend format
        const mappedOrders = (response.data.orders || response.data || []).map((order: any) => ({
          id: order._id || order.id || order.orderNumber,
          customerId: order.customer_id || order.customerId,
          customerName: order.customer_name || order.customerName,
          customerEmail: order.customer_email || order.customerEmail,
          items: (order.items || []).map((item: any) => ({
            productId: item.product || item.product_id || item.productId,
            productName: item.product_name || item.productName,
            productImage: item.product_image_url || item.productImage || item.productImageUrl,
            quantity: item.quantity,
            price: item.unit_price || item.unitPrice || item.price,
            totalPrice: item.total_price || item.totalPrice
          })),
          totalAmount: order.total_amount || order.totalAmount,
          paymentAmount: order.payment_amount || order.paymentAmount,
          paymentType: order.payment_type || order.paymentType,
          status: order.status || 'pending',
          paymentStatus: order.payment_status || order.paymentStatus || 'pending',
          shippingAddress: order.shipping_address || order.shippingAddress || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'Pakistan'
          },
          createdAt: order.created_at || order.createdAt,
          updatedAt: order.updated_at || order.updatedAt,
          module: order.module || 'daraz'
        }));
        
        console.log('📦 Mapped orders:', mappedOrders.length, 'orders');
        setOrders(mappedOrders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('❌ Failed to load orders:', err);
      // Don't set error for orders, just keep empty array
      setOrders([]);
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
      refreshProducts,
      refreshOrders
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
