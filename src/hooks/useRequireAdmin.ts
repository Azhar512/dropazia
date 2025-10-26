import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useRequireAdmin = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  return { user, isAuthenticated, isLoading, logout };
};
