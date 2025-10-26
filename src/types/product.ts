export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  module: 'daraz' | 'shopify';
  status: 'active' | 'inactive' | 'draft';
  images: ProductImage[];
  documents: ProductDocument[];
  specifications?: ProductSpecification[];
  createdAt: string;
  updatedAt: string;
  createdBy: string; // Admin user ID
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  type: 'png' | 'jpg' | 'jpeg' | 'webp' | 'svg';
}

export interface ProductDocument {
  id: string;
  name: string;
  url: string;
  type: 'pdf' | 'doc' | 'docx';
  size: number; // in bytes
}

export interface ProductSpecification {
  name: string;
  value: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
  module: 'daraz' | 'shopify';
}