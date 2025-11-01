import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, ShoppingBag, Eye, DollarSign, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import UserSidebar from '@/components/UserSidebar';
import WhatsAppButton from '@/components/WhatsAppButton';
import ApiService from '@/services/api';

const DarazAnalytics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState([
    { label: 'Total Views', value: '0', icon: Eye, color: 'bg-blue-500' },
    { label: 'Products', value: '0', icon: ShoppingBag, color: 'bg-green-500' },
    { label: 'Total Revenue', value: 'Rs 0', icon: DollarSign, color: 'bg-orange-500' },
    { label: 'Orders', value: '0', icon: TrendingUp, color: 'bg-purple-500' }
  ]);
  const [loading, setLoading] = useState(true);
  
  // Detect module from URL
  const module = window.location.pathname.includes('shopify') ? 'shopify' : 'daraz';
  const basePath = module === 'shopify' ? '/shopify' : '/daraz';

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await ApiService.getAnalytics(module);
        if (response.success && response.data) {
          const data = response.data;
          setStats([
            { label: 'Total Views', value: '0', icon: Eye, color: 'bg-blue-500' },
            { label: 'Products', value: data.totalProducts?.toString() || '0', icon: ShoppingBag, color: 'bg-green-500' },
            { label: 'Total Revenue', value: `Rs ${data.totalRevenue?.toLocaleString() || '0'}`, icon: DollarSign, color: 'bg-orange-500' },
            { label: 'Orders', value: data.totalOrders?.toString() || '0', icon: TrendingUp, color: 'bg-purple-500' }
          ]);
        }
      } catch (err: any) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAnalytics();
    }
  }, [user, module]);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${module === 'shopify' ? 'from-purple-50 to-purple-100' : 'from-orange-50 to-orange-100'}`}>
      <UserSidebar module={module} />
      <WhatsAppButton phoneNumber="+923256045679" message="Hello! I need help with analytics." />
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
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">Monitor your {module.charAt(0).toUpperCase() + module.slice(1)} performance</p>
        </div>

        {loading ? (
          <Card className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading analytics...</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-white`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              );
            })}
          </div>
        )}

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Sales Overview</h3>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Chart visualization will be implemented with real data</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DarazAnalytics;

