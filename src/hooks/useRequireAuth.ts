import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useRequireAuth = (redirectTo: string = '/') => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo]);

  return { isAuthenticated, isLoading };
};
