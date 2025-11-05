import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'buyer' | 'seller' | 'super_admin';
  status: string;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'buyer' | 'reseller';
  module: 'daraz' | 'shopify';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              const userData = data.data.user || data.data;
              const finalUser = {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                role: userData.role,
                status: userData.status
              };
              setUser(finalUser);
              // Store role in localStorage for quick access
              if (userData.role) {
                localStorage.setItem('userRole', userData.role);
              }
            }
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('authToken');
            localStorage.removeItem('userRole');
          }
        } catch (error) {
          console.error('Token validation error:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userRole');
        }
      }
      setLoading(false);
    };

    validateToken();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`;
      console.log('🌐 Login API URL:', apiUrl);
      console.log('📧 Login attempt:', { email });
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('❌ Login failed - Status:', response.status);
        console.error('❌ Error data:', errorData);
        return false;
      }

      const data = await response.json();
      console.log('📥 Login response:', data);

      if (data.success) {
        const { user, token } = data.data;
        
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status
        };
        
        setUser(userData);
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', user.role);
        console.log('✅ Login successful!');
        console.log('✅ User role stored:', user.role);
        console.log('✅ User data:', userData);
        return true;
      } else {
        console.error('❌ Login failed:', data.message);
        return false;
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('❌ Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Registering user:', { email: data.email, name: data.name });
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log('📥 Registration response:', result);

      if (!response.ok) {
        const errorMsg = result.message || result.error || `Registration failed (${response.status})`;
        console.error('❌ Registration failed:', errorMsg);
        throw new Error(errorMsg);
      }

      if (!result.success) {
        const errorMsg = result.message || 'Registration failed';
        console.error('❌ Registration not successful:', errorMsg);
        throw new Error(errorMsg);
      }

      console.log('✅ Registration successful');
      // Registration successful - user needs admin approval
      // Don't log them in automatically
    } catch (err) {
      console.error('❌ Registration error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      loading,
      error,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};