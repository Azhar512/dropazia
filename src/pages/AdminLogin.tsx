import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Shield, Info, Crown } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, loading, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  
  // Get login type from URL parameter
  const loginTypeParam = searchParams.get('type');
  const isSuperAdminLogin = loginTypeParam === 'super-admin';
  
  const [email, setEmail] = useState(isSuperAdminLogin ? 'superadmin@dropazia.com' : 'admin@dropazia.com');
  const [password, setPassword] = useState(isSuperAdminLogin ? 'superadmin123' : 'admin123');
  const [loginType, setLoginType] = useState<'admin' | 'super_admin'>(isSuperAdminLogin ? 'super_admin' : 'admin');
  
  // Update form when URL parameter changes
  useEffect(() => {
    if (isSuperAdminLogin) {
      setEmail('superadmin@dropazia.com');
      setPassword('superadmin123');
      setLoginType('super_admin');
    } else {
      setEmail('admin@dropazia.com');
      setPassword('admin123');
      setLoginType('admin');
    }
  }, [isSuperAdminLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    
    try {
      console.log('Attempting admin login with:', { email, password });
      const success = await login(email, password);
      console.log('Login result:', success);
      
      if (success) {
        console.log('Login successful, navigating to appropriate dashboard');
        // Wait a bit longer to ensure AuthContext state is updated
        setTimeout(() => {
          // Try multiple sources for role
          const roleFromStorage = localStorage.getItem('userRole');
          const roleFromUser = user?.role;
          const userRole = roleFromStorage || roleFromUser;
          
          console.log('User role from localStorage:', roleFromStorage);
          console.log('User role from state:', roleFromUser);
          console.log('Final user role:', userRole);
          
          if (userRole === 'super_admin') {
            console.log('✅ Navigating to super admin dashboard');
            navigate('/super-admin', { replace: true });
          } else if (userRole === 'admin') {
            console.log('✅ Navigating to admin dashboard');
            navigate('/admin', { replace: true });
          } else {
            console.log('⚠️ No matching role found, navigating to home');
            console.log('Available role sources:', { roleFromStorage, roleFromUser, user });
            navigate('/', { replace: true });
          }
        }, 300);
      } else {
        console.log('Login failed');
        setError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500/5 via-background to-green-500/5 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8 shadow-elevated">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${isSuperAdminLogin ? 'from-yellow-500 to-yellow-600' : 'from-orange-500 to-green-500'} rounded-lg flex items-center justify-center`}>
              {isSuperAdminLogin ? (
                <Crown className="w-6 h-6 text-white" />
              ) : (
                <span className="text-white font-bold text-xl">D</span>
              )}
            </div>
            <h1 className="text-3xl font-bold">Dropazia</h1>
          </div>
          <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
            {isSuperAdminLogin ? (
              <>
                <Crown className="w-6 h-6 text-yellow-600" />
                Super Admin Login
              </>
            ) : (
              <>
                <Shield className="w-6 h-6" />
                Admin Login
              </>
            )}
          </h2>
          <p className="text-muted-foreground">
            {isSuperAdminLogin 
              ? 'Access super admin dashboard to manage admins' 
              : 'Access admin dashboard to manage platform'}
          </p>
        </div>

        <Alert className={`mb-6 ${isSuperAdminLogin ? 'border-yellow-200 bg-yellow-50' : 'border-orange-200 bg-orange-50'}`}>
          <Info className={`h-4 w-4 ${isSuperAdminLogin ? 'text-yellow-600' : 'text-orange-600'}`} />
          <AlertDescription className="text-sm">
            {isSuperAdminLogin
              ? 'Use your super admin credentials to access the super admin dashboard.'
              : 'Use your admin credentials to access the admin dashboard.'}
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-sm text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className={`w-full ${isSuperAdminLogin ? 'bg-yellow-600 hover:bg-yellow-700' : ''}`} 
            size="lg" 
            disabled={loading}
          >
            {loading ? (
              <>
                {isSuperAdminLogin ? (
                  <Crown className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Shield className="w-4 h-4 mr-2 animate-spin" />
                )}
                Signing In...
              </>
            ) : (
              <>
                {isSuperAdminLogin ? (
                  <>
                    <Crown className="w-4 h-4 mr-2" />
                    Access Super Admin Dashboard
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Access Admin Dashboard
                  </>
                )}
              </>
            )}
          </Button>
          
          {/* Only show switch buttons if no type parameter is specified (direct access) */}
          {!loginTypeParam && (
            <div className="mt-4 space-y-2">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={loginType === 'admin' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setLoginType('admin');
                    setEmail('admin@dropazia.com');
                    setPassword('admin123');
                  }}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin
                </Button>
                <Button
                  type="button"
                  variant={loginType === 'super_admin' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setLoginType('super_admin');
                    setEmail('superadmin@dropazia.com');
                    setPassword('superadmin123');
                  }}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Super Admin
                </Button>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Click above to auto-fill credentials
              </p>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
