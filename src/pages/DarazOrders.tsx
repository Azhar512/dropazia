import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Calendar, DollarSign, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import UserSidebar from '@/components/UserSidebar';
import WhatsAppButton from '@/components/WhatsAppButton';
import ApiService from '@/services/api';

const DarazOrders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Detect module from URL
  const module = window.location.pathname.includes('shopify') ? 'shopify' : 'daraz';
  const basePath = module === 'shopify' ? '/shopify' : '/daraz';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await ApiService.getOrders();
        if (response.success && response.data) {
          // Filter orders by module
          const moduleOrders = response.data.filter((order: any) => order.module === module);
          setOrders(moduleOrders);
        }
      } catch (err: any) {
        console.error('Failed to load orders:', err);
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, module]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      shipped: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${module === 'shopify' ? 'from-purple-50 to-purple-100' : 'from-orange-50 to-orange-100'}`}>
      <UserSidebar module={module} />
      <WhatsAppButton phoneNumber="03274996979" message="Hello! I have a question about my orders." />
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(`${basePath}-products`)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>

        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 bg-gradient-to-r ${module === 'shopify' ? 'from-purple-500 to-blue-600' : 'from-orange-500 to-red-600'} bg-clip-text text-transparent`}>
            My Orders
          </h1>
          <p className="text-muted-foreground">Track and manage your {module.charAt(0).toUpperCase() + module.slice(1)} orders</p>
        </div>

        {loading ? (
          <Card className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading orders...</p>
          </Card>
        ) : error ? (
          <Card className="p-12 text-center">
            <p className="text-red-500">{error}</p>
          </Card>
        ) : orders.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
            <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
            <Button onClick={() => navigate(`${basePath}-products`)}>
              Browse Products
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <Card key={order._id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Order {order.orderNumber}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        {order.items?.length || 0} items
                      </span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-2xl font-bold flex items-center gap-2">
                    <DollarSign className="w-6 h-6" />
                    Rs {order.totalAmount?.toLocaleString() || '0'}
                  </span>
                  <Button variant="outline">
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DarazOrders;

