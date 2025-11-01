import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import UserSidebar from '@/components/UserSidebar';
import WhatsAppButton from '@/components/WhatsAppButton';
import ApiService from '@/services/api';
import { toast } from 'sonner';
import { Loader2, Package, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DarazReturns = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Detect module from URL
  const module = window.location.pathname.includes('shopify') ? 'shopify' : 'daraz';
  const basePath = module === 'shopify' ? '/shopify' : '/daraz';
  
  // Form state
  const [formData, setFormData] = useState({
    orderNumber: '',
    storeName: '',
    email: user?.email || '',
    reason: ''
  });

  useEffect(() => {
    if (user) {
      fetchReturns();
    }
  }, [user, module]);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getMyReturns(module);
      if (response.success && response.data) {
        setReturns(response.data);
      }
    } catch (error: any) {
      console.error('Failed to load returns:', error);
      toast.error('Failed to load return requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.orderNumber || !formData.storeName || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await ApiService.createReturn({
        ...formData,
        module
      });

      if (response.success) {
        toast.success('Return request submitted successfully');
        setFormData({
          orderNumber: '',
          storeName: '',
          email: user?.email || '',
          reason: ''
        });
        setShowForm(false);
        fetchReturns();
      } else {
        toast.error(response.message || 'Failed to submit return request');
      }
    } catch (error: any) {
      console.error('Submit return error:', error);
      toast.error(error.message || 'Failed to submit return request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', variant: 'secondary' as const, className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
      approved: { label: 'Approved', variant: 'default' as const, className: 'bg-green-500/10 text-green-600 border-green-500/20' },
      rejected: { label: 'Rejected', variant: 'destructive' as const, className: 'bg-red-500/10 text-red-600 border-red-500/20' },
      completed: { label: 'Completed', variant: 'default' as const, className: 'bg-blue-500/10 text-blue-600 border-blue-500/20' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Please log in to view your returns</p>
          <Button onClick={() => navigate(basePath)}>Go to Login</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${module === 'shopify' ? 'from-purple-50 to-purple-100' : 'from-orange-50 to-orange-100'}`}>
      <UserSidebar module={module} />
      <div className="ml-0 md:ml-16 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Return Requests</h1>
              <p className="text-muted-foreground">
                Manage product returns after shipping
              </p>
            </div>
            <Button onClick={() => setShowForm(!showForm)} variant={showForm ? 'outline' : 'default'}>
              {showForm ? 'Cancel' : <><Plus className="w-4 h-4 mr-2" /> New Return</>}
            </Button>
          </div>

          {/* New Return Form */}
          {showForm && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Submit New Return Request</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orderNumber">Order Number *</Label>
                    <Input
                      id="orderNumber"
                      value={formData.orderNumber}
                      onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                      placeholder="Enter order number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name *</Label>
                    <Input
                      id="storeName"
                      value={formData.storeName}
                      onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                      placeholder="Enter store name"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Your email address"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason (Optional)</Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Reason for return..."
                    rows={3}
                  />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Return Request'
                  )}
                </Button>
              </form>
            </Card>
          )}

          {/* Returns List */}
          {loading ? (
            <Card className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p>Loading returns...</p>
            </Card>
          ) : returns.length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Return Requests</h3>
              <p className="text-muted-foreground mb-4">
                You haven't submitted any return requests yet
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Submit Your First Return
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {returns.map((returnItem: any) => (
                <Card key={returnItem._id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">Order #{returnItem.orderNumber}</h3>
                      <p className="text-sm text-muted-foreground">{returnItem.storeName}</p>
                    </div>
                    {getStatusBadge(returnItem.status)}
                  </div>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{returnItem.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Submitted</p>
                      <p className="font-medium">
                        {new Date(returnItem.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {returnItem.reason && (
                    <>
                      <Separator className="my-4" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Reason</p>
                        <p>{returnItem.reason}</p>
                      </div>
                    </>
                  )}
                  {returnItem.adminNotes && (
                    <>
                      <Separator className="my-4" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Admin Notes</p>
                        <p>{returnItem.adminNotes}</p>
                      </div>
                    </>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <WhatsAppButton phoneNumber="+923256045679" />
    </div>
  );
};

export default DarazReturns;

