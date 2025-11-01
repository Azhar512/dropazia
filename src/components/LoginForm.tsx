import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  module: 'daraz' | 'shopify';
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, module }) => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      const success = await login(data.email, data.password);
      if (success) {
        // After successful login, check user status
        // Get user from auth context (login function sets it)
        const token = localStorage.getItem('authToken');
        if (token) {
          try {
            const profileResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/profile`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              if (profileData.success && profileData.data) {
                const userStatus = profileData.data.status;
                // Block access if user is pending or rejected
                if (userStatus === 'pending') {
                  setError('root', {
                    message: 'Your account is pending admin approval. Please wait for approval.',
                  });
                  return;
                }
                if (userStatus === 'rejected') {
                  setError('root', {
                    message: 'Your account has been rejected. Please contact support.',
                  });
                  return;
                }
                // Only allow approved users and admins
                if (userStatus !== 'approved' && profileData.data.role !== 'admin') {
                  setError('root', {
                    message: 'Access denied. Your account needs admin approval.',
                  });
                  return;
                }
              }
            }
          } catch (err) {
            console.error('Profile fetch error:', err);
          }
        }
        // User is approved, redirect to products page for the module they logged in to
        navigate(`/${module}-products`);
        onSuccess?.();
      } else {
        setError('root', {
          message: 'Invalid email or password',
        });
      }
    } catch (error) {
      setError('root', {
        message: error instanceof Error ? error.message : 'Login failed',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errors.root && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          {...register('email')}
          className={errors.email ? 'border-destructive' : ''}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          className={errors.password ? 'border-destructive' : ''}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isSubmitting || loading}
      >
        {isSubmitting || loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Signing In...
          </>
        ) : (
          'Sign In'
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
