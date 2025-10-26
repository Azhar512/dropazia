import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'buyer' | 'seller';
  status: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
              setUser({
                id: data.data.id,
                name: data.data.name,
                email: data.data.email,
                role: data.data.role,
                status: data.data.status
              });
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
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        const { user, token } = data.data;
        
        setUser({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status
        });
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', user.role);
        return true;
      } else {
        console.error('Login failed:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
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
      logout,
      loading
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