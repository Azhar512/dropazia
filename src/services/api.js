const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiService {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('🌐 API Request:', url, options);
    const token = localStorage.getItem('authToken');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Cart API
  static async getCart() {
    return this.request('/api/cart');
  }

  static async addToCart(productId, quantity = 1) {
    return this.request('/api/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  static async updateCartItem(productId, quantity) {
    return this.request(`/api/cart/update/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  static async removeFromCart(productId) {
    return this.request(`/api/cart/remove/${productId}`, {
      method: 'DELETE',
    });
  }

  static async clearCart() {
    return this.request('/api/cart/clear', {
      method: 'DELETE',
    });
  }

  // Health check
  static async healthCheck() {
    return this.request('/health');
  }

  // Product API
  static async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/products${queryString ? `?${queryString}` : ''}`);
  }

  static async getProductById(id) {
    return this.request(`/api/products/${id}`);
  }

  static async createProduct(productData) {
    return this.request('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  static async updateProduct(id, productData) {
    return this.request(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  static async deleteProduct(id) {
    return this.request(`/api/products/${id}`, {
      method: 'DELETE',
    });
  }

  static async getProductsByModule(module) {
    return this.request(`/api/products/module/${module}`);
  }
}

export default ApiService;
