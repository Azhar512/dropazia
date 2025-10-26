import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Shield, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('admin@shopdaraz.com');
  const [password, setPassword] = useState('admin123');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    
    try {
      console.log('Attempting admin login with:', { email, password });
      const success = await login(email, password);
      console.log('Login result:', success);
      
      if (success) {
        console.log('Login successful, navigating to admin dashboard');
        // Add a small delay to ensure state is updated
        setTimeout(() => {
          navigate('/admin');
        }, 100);
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
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <h1 className="text-3xl font-bold">Dropazia</h1>
          </div>
          <h2 className="text-2xl font-bold mb-2">Admin Login</h2>
          <p className="text-muted-foreground">Access the admin dashboard</p>
        </div>

        <Alert className="mb-6 border-orange-200 bg-orange-50">
          <Info className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-sm">
            Use the admin credentials to access the dashboard
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

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            <Shield className="w-4 h-4 mr-2" />
            {loading ? 'Signing In...' : 'Access Admin Dashboard'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
