const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiService {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('🌐 API Request:', url, options);
    const token = localStorage.getItem('authToken');
    
    // NUCLEAR OPTION: Force no cache on all requests
    const cacheBuster = endpoint.includes('?') ? `&_nc=${Date.now()}` : `?_nc=${Date.now()}`;
    const urlWithCacheBuster = `${url}${cacheBuster}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      cache: 'no-store', // Force browser to not cache
      ...options,
    };

    try {
      const response = await fetch(urlWithCacheBuster, config);
      const data = await response.json();
      
      if (!response.ok) {
        console.error(`❌ API Error ${response.status}:`, data);
        const error = new Error(data.message || data.error || 'API request failed');
        error.status = response.status;
        error.response = data;
        throw error;
      }
      
      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('❌ Network Error: Could not reach API server');
        throw new Error('Network error: Could not connect to server. Please check your connection.');
      }
      console.error('❌ API Error:', error);
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

        // User API (Admin only)
        static async getUsers(params = {}) {
          // Remove cache-busting param if present (internal use only)
          const cleanParams = { ...params };
          delete cleanParams._t;
          const queryString = new URLSearchParams(cleanParams).toString();
          const url = `/api/users${queryString ? `?${queryString}` : ''}`;
          console.log('🌐 API Request: GET', url);
          return this.request(url);
        }

  static async getUserById(id) {
    return this.request(`/api/users/${id}`);
  }

  static async updateUserStatus(id, status) {
    return this.request(`/api/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  static async deleteUser(id) {
    return this.request(`/api/users/${id}`, {
      method: 'DELETE',
    });
  }

  static async getProductsByModule(module) {
    return this.request(`/api/products/module/${module}`);
  }

  // Orders API
  static async getOrders() {
    return this.request('/api/orders/customer/orders');
  }

  static async getOrderById(orderId) {
    return this.request(`/api/orders/${orderId}`);
  }

  static async getOrderStats() {
    return this.request('/api/orders/customer/stats');
  }

  static async createOrder(orderData) {
    return this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  // Admin Orders API
  static async getAllOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/orders/admin/all${queryString ? `?${queryString}` : ''}`);
  }

  static async updateOrderStatus(orderId, status, paymentStatus = null) {
    return this.request(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, paymentStatus }),
    });
  }

  // Analytics API
  static async getAnalytics(module) {
    return this.request(`/api/analytics/${module}`);
  }

  // Profits API
  static async getProfits(module) {
    return this.request(`/api/profits/${module}`);
  }

  // Wishlist API
  static async addToWishlist(productId, module) {
    return this.request('/api/wishlist/add', {
      method: 'POST',
      body: JSON.stringify({ productId, module }),
    });
  }

  static async removeFromWishlist(productId) {
    return this.request(`/api/wishlist/remove/${productId}`, {
      method: 'DELETE',
    });
  }

  static async getWishlist(module = null) {
    const queryString = module ? `?module=${module}` : '';
    return this.request(`/api/wishlist${queryString}`);
  }

  static async isInWishlist(productId) {
    return this.request(`/api/wishlist/check/${productId}`);
  }

  static async getWishlistCount(module = null) {
    const queryString = module ? `?module=${module}` : '';
    return this.request(`/api/wishlist/count${queryString}`);
  }

  // Returns API
  static async createReturn(returnData) {
    return this.request('/api/returns', {
      method: 'POST',
      body: JSON.stringify(returnData),
    });
  }

  static async getMyReturns(module = null) {
    const queryString = module ? `?module=${module}` : '';
    return this.request(`/api/returns/my${queryString}`);
  }

  static async getAllReturns() {
    return this.request('/api/returns/all');
  }

  static async getReturnsByUser(userId) {
    return this.request(`/api/returns/user/${userId}`);
  }

  static async updateReturnStatus(returnId, status, adminNotes = '') {
    return this.request(`/api/returns/${returnId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, adminNotes }),
    });
  }

  // Super Admin API
  static async getSuperAdminDashboardStats() {
    return this.request('/api/super-admin/dashboard/stats');
  }

  static async getAllAdmins() {
    return this.request('/api/super-admin/admins');
  }

  static async createAdmin(adminData) {
    return this.request('/api/super-admin/admins', {
      method: 'POST',
      body: JSON.stringify(adminData),
    });
  }

  static async updateAdmin(adminId, adminData) {
    return this.request(`/api/super-admin/admins/${adminId}`, {
      method: 'PUT',
      body: JSON.stringify(adminData),
    });
  }

  static async deleteAdmin(adminId) {
    return this.request(`/api/super-admin/admins/${adminId}`, {
      method: 'DELETE',
    });
  }
}

export default ApiService;
