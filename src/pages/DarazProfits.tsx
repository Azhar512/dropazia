import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import UserSidebar from '@/components/UserSidebar';
import WhatsAppButton from '@/components/WhatsAppButton';
import ApiService from '@/services/api';

const DarazProfits = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profitData, setProfitData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Detect module from URL
  const module = window.location.pathname.includes('shopify') ? 'shopify' : 'daraz';
  const basePath = module === 'shopify' ? '/shopify' : '/daraz';

  useEffect(() => {
    const fetchProfits = async () => {
      try {
        setLoading(true);
        const response = await ApiService.getProfits(module);
        if (response.success && response.data) {
          setProfitData(response.data);
        }
      } catch (err: any) {
        console.error('Failed to load profits:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfits();
    }
  }, [user, module]);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${module === 'shopify' ? 'from-purple-50 to-purple-100' : 'from-orange-50 to-orange-100'}`}>
      <UserSidebar module={module} />
      <WhatsAppButton phoneNumber="+923256045679" message="Hello! I need help with profits." />
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
            Profits & Earnings
          </h1>
          <p className="text-muted-foreground">Track your {module.charAt(0).toUpperCase() + module.slice(1)} earnings and profits</p>
        </div>

        {loading ? (
          <Card className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading profits...</p>
          </Card>
        ) : profitData ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-8 h-8" />
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="text-sm mb-2 opacity-90">Total Profit</div>
                <div className="text-4xl font-bold">Rs {profitData.summary.totalProfit.toLocaleString()}</div>
              </Card>

              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-2">Total Revenue</div>
                <div className="text-3xl font-bold mb-2">Rs {profitData.summary.totalRevenue.toLocaleString()}</div>
                <Badge className="bg-green-100 text-green-800">+15%</Badge>
              </Card>

              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-2">Total Expenses</div>
                <div className="text-3xl font-bold mb-2">Rs {profitData.summary.totalExpenses.toLocaleString()}</div>
                <Badge className="bg-red-100 text-red-800">-5%</Badge>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Recent Earnings</h3>
              {profitData.periods && Object.entries(profitData.periods).map(([key, data]: [string, any]) => (
                <Card key={key} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold mb-1">Rs {Math.round(data.profit).toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    </div>
                    <Badge className={data.isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {data.isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                      {data.change}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No profit data available</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DarazProfits;

