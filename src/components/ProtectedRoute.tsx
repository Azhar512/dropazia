import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  requireSuperAdmin = false,
  redirectTo = '/' 
}) => {
  const { user, loading } = useAuth();
  const isAuthenticated = !!user;
  const location = useLocation();

  console.log('ProtectedRoute check:', { 
    isAuthenticated, 
    userRole: user?.role, 
    requireAdmin,
    requireSuperAdmin,
    loading 
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to:', redirectTo);
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requireSuperAdmin && user?.role !== 'super_admin') {
    console.log('Super admin required but user is not super admin, redirecting to home');
    console.log('User role:', user?.role, 'Required: super_admin');
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && user?.role !== 'admin' && user?.role !== 'super_admin') {
    console.log('Admin required but user is not admin, redirecting to home');
    console.log('User role:', user?.role, 'Required: admin or super_admin');
    return <Navigate to="/" replace />;
  }

  console.log('Access granted, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
