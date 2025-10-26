import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, ShoppingBag, Package, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Welcome, {user.name}!
          </h1>
          <p className="text-muted-foreground">Manage your account and activities</p>
        </div>

        {/* User Info Card */}
        <Card className="p-6 shadow-elevated mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant={user.role === 'buyer' ? 'default' : 'secondary'}>
                  {user.role}
                </Badge>
                <Badge variant={user.module === 'daraz' ? 'default' : 'secondary'}>
                  {user.module}
                </Badge>
                <Badge 
                  variant={user.status === 'approved' ? 'default' : 'outline'}
                  className={user.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' : ''}
                >
                  {user.status}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p className="font-medium">{user.phone}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Member Since</p>
              <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Updated</p>
              <p className="font-medium">{new Date(user.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card 
            className="p-6 shadow-elevated hover:shadow-glow transition-all cursor-pointer"
            onClick={() => navigate('/customer-dashboard')}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">My Orders</h3>
                <p className="text-sm text-muted-foreground">View order history</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-elevated hover:shadow-glow transition-all cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-secondary/10">
                <Package className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold">My Products</h3>
                <p className="text-sm text-muted-foreground">Manage your products</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-elevated hover:shadow-glow transition-all cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <Settings className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Settings</h3>
                <p className="text-sm text-muted-foreground">Account preferences</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Status Message */}
        {user.status === 'pending' && (
          <Card className="p-6 border-orange-200 bg-orange-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Settings className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-orange-800">Account Pending Approval</h3>
                <p className="text-sm text-orange-600">
                  Your account is currently under review. You will be notified via WhatsApp once approved.
                </p>
              </div>
            </div>
          </Card>
        )}

        {user.status === 'rejected' && (
          <Card className="p-6 border-red-200 bg-red-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <Settings className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-800">Account Rejected</h3>
                <p className="text-sm text-red-600">
                  Your account application has been rejected. Please contact support for more information.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
