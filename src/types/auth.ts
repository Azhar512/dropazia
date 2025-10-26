export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'buyer' | 'reseller' | 'admin';
  module: 'daraz' | 'shopify';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'buyer' | 'reseller';
  module: 'daraz' | 'shopify';
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  refreshToken: () => Promise<void>;
}
