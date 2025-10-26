import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CreditCard, MapPin, User, Mail, Phone, ShoppingBag, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/contexts/ProductContext';
import { jazzCashService, formatCurrency, validatePaymentData } from '@/services/jazzcash';
import { Order } from '@/types/product';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, clearCart, getCartItemsCount } = useCart();
  const { products, addOrder } = useProducts();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'details' | 'payment' | 'processing' | 'success'>('details');
  
  // Form data
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Pakistan',
    paymentMethod: 'jazzcash'
  });

  // Get cart items with product details
  const cartItemsWithDetails = cartItems.map(cartItem => {
    const product = products.find(p => p.id === cartItem.productId);
    return {
      ...cartItem,
      product: product || null
    };
  }).filter(item => item.product !== null);

  // Calculate totals
  const subtotal = cartItemsWithDetails.reduce((total, item) => {
    return total + (item.product!.price * item.quantity);
  }, 0);

  const shipping = subtotal > 5000 ? 0 : 200;
  const total = subtotal + shipping;

  // Redirect if cart is empty
  useEffect(() => {
    if (getCartItemsCount() === 0) {
      navigate('/');
    }
  }, [getCartItemsCount, navigate]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/daraz');
    }
  }, [user, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStep('processing');

    try {
      // Validate form data
      const paymentData = {
        amount: total,
        currency: 'PKR',
        orderId: `ORDER-${Date.now()}`,
        description: `Order for ${cartItemsWithDetails.length} items`,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        customerAddress: `${formData.street}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.country}`
      };

      const validationErrors = validatePaymentData(paymentData);
      if (validationErrors.length > 0) {
        alert('Please fix the following errors:\n' + validationErrors.join('\n'));
        setPaymentStep('details');
        setIsProcessing(false);
        return;
      }

      // Initiate JazzCash payment
      const paymentResponse = await jazzCashService.initiatePayment(paymentData);

      if (paymentResponse.success && paymentResponse.paymentUrl) {
        // Create order
        const order: Order = {
          id: paymentData.orderId,
          customerId: user!.id,
          customerName: paymentData.customerName,
          customerEmail: paymentData.customerEmail,
          items: cartItemsWithDetails.map(item => ({
            productId: item.productId,
            productName: item.product!.name,
            productImage: item.product!.images[0]?.url,
            quantity: item.quantity,
            price: item.product!.price,
            totalPrice: item.product!.price * item.quantity
          })),
          totalAmount: total,
          status: 'pending',
          paymentStatus: 'pending',
          shippingAddress: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          module: 'daraz' // Default to daraz, could be determined by product modules
        };

        // Add order to context
        addOrder(order);

        // Clear cart
        clearCart();

        // Simulate payment processing
        setTimeout(() => {
          setPaymentStep('success');
          setIsProcessing(false);
        }, 3000);

        // In a real implementation, you would redirect to JazzCash payment page
        // window.location.href = paymentResponse.paymentUrl;
        
      } else {
        alert('Payment initiation failed: ' + (paymentResponse.error || 'Unknown error'));
        setPaymentStep('details');
        setIsProcessing(false);
      }

    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setPaymentStep('details');
      setIsProcessing(false);
    }
  };

  if (paymentStep === 'success') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-6">
            Your order has been placed successfully. You will receive a confirmation email shortly.
          </p>
          <div className="space-y-2">
            <Button onClick={() => navigate('/customer-dashboard')} className="w-full">
              View My Orders
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              Continue Shopping
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (paymentStep === 'processing') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Processing Payment</h1>
          <p className="text-muted-foreground">
            Please wait while we process your payment...
          </p>
        </Card>
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
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Checkout</h1>
              <p className="text-muted-foreground">Complete your order</p>
            </div>

            {/* Customer Information */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Customer Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Full Name *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Email *</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Phone *</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    placeholder="+92 300 1234567"
                    required
                  />
                </div>
              </div>
            </Card>

            {/* Shipping Address */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Shipping Address</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="street">Street Address *</Label>
                  <Textarea
                    id="street"
                    value={formData.street}
                    onChange={(e) => handleInputChange('street', e.target.value)}
                    placeholder="House number, street name"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sindh">Sindh</SelectItem>
                        <SelectItem value="Punjab">Punjab</SelectItem>
                        <SelectItem value="KPK">KPK</SelectItem>
                        <SelectItem value="Balochistan">Balochistan</SelectItem>
                        <SelectItem value="Islamabad">Islamabad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Payment Method</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="jazzcash"
                    name="paymentMethod"
                    value="jazzcash"
                    checked={formData.paymentMethod === 'jazzcash'}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  />
                  <Label htmlFor="jazzcash" className="flex items-center gap-2">
                    <img src="/jazzcash-logo.svg" alt="JazzCash" className="w-6 h-6" />
                    JazzCash
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  You will be redirected to JazzCash secure payment page
                </p>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Order Summary</h2>
              </div>

              {/* Cart Items */}
              <div className="space-y-3 mb-4">
                {cartItemsWithDetails.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="w-12 h-12 rounded bg-muted overflow-hidden">
                      <img
                        src={item.product!.images[0]?.url || '/placeholder.svg'}
                        alt={item.product!.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm line-clamp-2">{item.product!.name}</h3>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium">
                      {formatCurrency(item.product!.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </span>
                </div>
                {subtotal < 5000 && (
                  <p className="text-xs text-muted-foreground">
                    Add {formatCurrency(5000 - subtotal)} more for free shipping
                  </p>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full mt-6"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay with JazzCash
                  </>
                )}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
