import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, ShoppingBag, MapPin, Calendar, CreditCard, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/contexts/ProductContext';
import { Order } from '@/types/product';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getOrdersByCustomer } = useProducts();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Get orders for the current user
  const userOrders = getOrdersByCustomer(user.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">
            My Orders
          </h1>
          <p className="text-muted-foreground">
            Track your order history and current orders
          </p>
        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userOrders.length}</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-100">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {userOrders.filter(order => order.status === 'delivered').length}
                </p>
                <p className="text-sm text-muted-foreground">Delivered</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {userOrders.filter(order => order.status === 'shipped').length}
                </p>
                <p className="text-sm text-muted-foreground">Shipped</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-orange-100">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {userOrders.filter(order => order.status === 'pending' || order.status === 'confirmed').length}
                </p>
                <p className="text-sm text-muted-foreground">Processing</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Orders List */}
        {userOrders.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Button onClick={() => navigate('/')}>
              Start Shopping
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {userOrders.map((order) => (
              <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="text-xl font-bold">{formatCurrency(order.totalAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Module</p>
                        <p className="font-medium capitalize">{order.module}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Items ({order.items.length})</h4>
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                          {item.productImage && (
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity} × {formatCurrency(item.price)}
                            </p>
                          </div>
                          <p className="font-semibold">{formatCurrency(item.totalPrice)}</p>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Shipping Address</p>
                          <p className="text-sm text-muted-foreground">
                            {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}, {order.shippingAddress.country}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 lg:items-end">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    {order.status === 'delivered' && (
                      <Button variant="outline" size="sm">
                        Reorder
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
