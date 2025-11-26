import React, { useState, useEffect, useMemo } from 'react';
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
// Removed unused jazzCashService and validatePaymentData imports
import { Order } from '@/types/product';
import ApiService from '@/services/api';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import PayFastService from '@/services/payfast';

// Format currency helper - moved outside component to avoid re-render issues
const formatCurrency = (amount: number | undefined | null): string => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return 'Rs 0';
  }
  const numAmount = Number(amount);
  return `Rs ${numAmount.toLocaleString('en-PK')}`;
};

const Checkout = () => {
  // All hooks must be called unconditionally at the top level
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, clearCart, getCartItemsCount } = useCart();
  const { products, addOrder, refreshOrders } = useProducts();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'details' | 'payment' | 'receipt' | 'processing' | 'success'>('details');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  // Daraz required document (simplified to one PDF only)
  const [darazDocumentFile, setDarazDocumentFile] = useState<File | null>(null);
  const [darazDocumentPreview, setDarazDocumentPreview] = useState<string | null>(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    extraPhone: '', // Optional extra phone for Shopify
    street: '',
    city: '',
    nearestLocation: '', // Optional nearest location for Shopify
    state: '',
    zipCode: '',
    country: 'Pakistan',
    paymentMethod: 'easypaisa' // Changed default to easypaisa
  });

  // Update form data when user loads - real-time updates
  useEffect(() => {
    if (user && user.name && user.email) {
      setFormData(prev => ({
        ...prev,
        customerName: user.name || prev.customerName || '',
        customerEmail: user.email || prev.customerEmail || '',
        customerPhone: user.phone || prev.customerPhone || ''
      }));
    }
  }, [user]);

  // Note: Profit inputs are only for Resell orders, not for regular "Buy for Self" checkout

  // Get cart items with product details
  const cartItemsWithDetails = useMemo(() => {
    if (!cartItems || !Array.isArray(cartItems) || !products || !Array.isArray(products)) {
      return [];
    }
    return cartItems.map(cartItem => {
      // Handle both productId and product_id for compatibility
      const itemProductId = cartItem.productId || cartItem.product_id;
      const product = products.find(p => p.id === itemProductId);
      return {
        ...cartItem,
        productId: itemProductId,
        product: product || null
      };
    }).filter(item => item.product !== null);
  }, [cartItems, products]);

  // Detect module from products - use first available product
  const detectedModule = useMemo(() => {
    if (cartItemsWithDetails.length === 0) return 'daraz';
    const firstProduct = cartItemsWithDetails[0]?.product;
    return firstProduct?.module || 'daraz';
  }, [cartItemsWithDetails]);

  // Calculate subtotal - No profit for "Buy for Self" checkout (profit is only for Resell orders)
  const subtotal = useMemo(() => {
    if (cartItemsWithDetails.length === 0) return 0;
    
    return cartItemsWithDetails.reduce((total, item) => {
      if (!item.product) return total;
      const productPrice = item.product.price || 0;
      const quantity = item.quantity || 0;
      return total + (productPrice * quantity);
    }, 0);
  }, [cartItemsWithDetails]);

  // Delivery charges - only for Daraz (fixed Rs 50), Shopify charges set by admin at delivery
  const deliveryCharges = useMemo(() => {
    return detectedModule === 'daraz' ? 50 : 0;
  }, [detectedModule]);
  
  // Payment calculation based on module
  const paymentAmount = useMemo(() => {
    return detectedModule === 'daraz' 
      ? subtotal + deliveryCharges  // Daraz: Full payment (100%) + 50 delivery upfront
      : 250;                         // Shopify: Fixed Rs 250 upfront payment
  }, [detectedModule, subtotal, deliveryCharges]);
  
  const total = useMemo(() => {
    return subtotal + (detectedModule === 'daraz' ? deliveryCharges : 0);
  }, [subtotal, detectedModule, deliveryCharges]);

  // Redirect if cart is empty
  useEffect(() => {
    try {
      const cartCount = getCartItemsCount ? getCartItemsCount() : 0;
      if (cartCount === 0) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error checking cart count:', error);
    }
  }, [getCartItemsCount, navigate]);

  // Check if user is logged in - show login/register prompt instead of redirecting
  useEffect(() => {
    try {
      const cartCount = getCartItemsCount ? getCartItemsCount() : 0;
      if (!user && cartCount > 0) {
        setShowAuthPrompt(true);
      }
    } catch (error) {
      console.error('Error checking auth prompt:', error);
    }
  }, [user, getCartItemsCount]);

  // Show loading if products are not loaded yet
  if (!products || !Array.isArray(products) || products.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Loading Checkout...</h1>
          <p className="text-muted-foreground">Please wait while we load your cart items</p>
        </Card>
      </div>
    );
  }

  // Show authentication prompt if user is not logged in
  if (!user && showAuthPrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">Login Required</h1>
            <p className="text-muted-foreground">
              Please login or create an account to proceed with checkout
            </p>
          </div>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-6">
              <LoginForm 
                module={(detectedModule === 'daraz' || detectedModule === 'shopify') ? detectedModule : 'daraz'} 
                onSuccess={() => setShowAuthPrompt(false)}
              />
            </TabsContent>
            <TabsContent value="register" className="mt-6">
              <RegisterForm 
                module={(detectedModule === 'daraz' || detectedModule === 'shopify') ? detectedModule : 'daraz'}
                onSuccess={() => setShowAuthPrompt(false)}
              />
            </TabsContent>
          </Tabs>
          
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file for the receipt.');
        return;
      }
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Daraz document upload (simplified - only one PDF required)
  const handleDarazDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file for Daraz order.');
        return;
      }
      setDarazDocumentFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDarazDocumentPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStep('processing');

    try {
      // Validate payment receipt (only for EasyPaisa)
      if (formData.paymentMethod === 'easypaisa' && !receiptFile) {
        toast.error('Please upload payment receipt before proceeding.');
        setPaymentStep('details');
        setIsProcessing(false);
        return;
      }

      // Note: Profit input is only for Resell orders, not for regular "Buy for Self" checkout

      // Validate Daraz required document (simplified - one PDF only)
      if (detectedModule === 'daraz') {
        if (!darazDocumentFile) {
          toast.error('Please upload the required PDF document for your Daraz order.');
          setPaymentStep('details');
          setIsProcessing(false);
          return;
        }
      }

      // Convert receipt to base64 for payment receipt (only for EasyPaisa)
      let receiptBase64 = null;
      if (formData.paymentMethod === 'easypaisa' && receiptFile) {
        receiptBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(receiptFile);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
      }

      // Convert PDF file to base64 for Daraz orders (simplified - one document only)
      let darazOrderDocument = null;
      
      if (detectedModule === 'daraz' && darazDocumentFile) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(darazDocumentFile);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
        darazOrderDocument = {
          name: darazDocumentFile.name,
          url: base64,
          type: 'pdf'
        };
      }

      // Create order via API (saves to database)
      const orderData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone || '',
        extraPhone: detectedModule === 'shopify' ? (formData.extraPhone || '') : undefined,
        items: cartItemsWithDetails.map(item => {
          const itemPrice = item.product!.price || 0;
          const quantity = item.quantity || 0;
          const itemTotal = itemPrice * quantity;
          
          return {
            product: item.productId,
            productName: item.product!.name,
            productImageUrl: item.product!.images[0]?.url || '',
            quantity: quantity,
            unitPrice: itemPrice,
            totalPrice: itemTotal
          };
        }),
        totalAmount: total,
        paymentMethod: formData.paymentMethod,
        module: detectedModule,
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          nearestLocation: detectedModule === 'shopify' ? (formData.nearestLocation || '') : undefined
        },
        paymentAmount: paymentAmount,
        paymentType: detectedModule === 'daraz' ? 'full' : 'shopify_250',
        paymentReceipt: receiptBase64 ? {
          name: receiptFile!.name,
          url: receiptBase64,
          type: 'image'
        } : undefined,
        darazCustomerDocument: darazOrderDocument,
        notes: `Payment receipt uploaded.${detectedModule === 'daraz' ? ' Daraz order document uploaded.' : ' Order placed via Buy for Self checkout.'}`
      };

      // Validate user is logged in
      if (!user || !user.id) {
        toast.error('You must be logged in to place an order. Please login and try again.');
        setPaymentStep('details');
        setIsProcessing(false);
        return;
      }

      // Save order to backend database (CRITICAL: This must succeed before clearing cart)
      const orderResponse = await ApiService.createOrder(orderData);
      
      // Validate order was saved successfully
      if (!orderResponse.success || !orderResponse.data) {
        throw new Error(orderResponse.message || 'Failed to save order to database');
      }

      console.log('✅ Order saved to database:', orderResponse);
      const backendOrder = orderResponse.data;

      // Order is now safely in database - add to frontend context
      const frontendOrder: Order = {
        id: backendOrder._id || backendOrder.id || `ORDER-${Date.now()}`,
        customerId: user.id,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        items: cartItemsWithDetails.map(item => ({
          productId: item.productId,
          productName: item.product!.name,
          productImage: item.product!.images[0]?.url,
          quantity: item.quantity,
          price: item.product!.price,
          totalPrice: item.product!.price * item.quantity
        })),
        totalAmount: total,
        status: backendOrder.status || 'pending',
        paymentStatus: backendOrder.paymentStatus || 'pending',
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        createdAt: backendOrder.createdAt || new Date().toISOString(),
        updatedAt: backendOrder.updatedAt || new Date().toISOString(),
        module: detectedModule,
        paymentAmount: paymentAmount,
        paymentType: detectedModule === 'daraz' ? 'full' : 'delivery_only'
      };
      
      // Add to context for immediate UI update
      addOrder(frontendOrder);

      // Refresh orders from database to ensure consistency (non-critical - order already saved)
      try {
        await refreshOrders();
      } catch (refreshError) {
        console.warn('⚠️ Failed to refresh orders from database, but order is saved:', refreshError);
        // Order is already in DB, so this is not critical
      }

      // Clear cart ONLY after order is confirmed saved to database
      clearCart();

      // Handle PayFast payment redirect
      if (formData.paymentMethod === 'payfast') {
        try {
          toast.loading('Redirecting to PayFast payment gateway...');
          
          // Redirect to PayFast
          await PayFastService.initiatePayment({
            orderId: backendOrder.order_number || backendOrder.id,
            userId: user.id,
            amount: total,
            customerName: formData.customerName,
            customerEmail: formData.customerEmail,
            customerPhone: formData.customerPhone,
            module: detectedModule,
            itemDescription: `${cartItemsWithDetails.length} item(s) from ${detectedModule.toUpperCase()}`
          });
          
          // Note: User will be redirected, so no need to set orderPlaced or stop processing
          return;
        } catch (payfastError) {
          console.error('PayFast redirect error:', payfastError);
          toast.error('Failed to redirect to PayFast. Please try again or use a different payment method.');
          setPaymentStep('details');
          setIsProcessing(false);
          return;
        }
      }

      // Show success message for EasyPaisa - NO WhatsApp opening
      setOrderPlaced(true);
      setIsProcessing(false);

    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Order processing failed. Please try again.');
      setPaymentStep('details');
      setIsProcessing(false);
    }
  };

  // Show success screen after order is placed
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-green-600">Your Order Has Been Placed!</h1>
          <p className="text-muted-foreground mb-6">
            Your order has been successfully submitted. Our team will process your order and contact you soon.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-green-800 mb-2">Order Details:</p>
            <div className="text-left space-y-1 text-sm">
              <p><strong>Items:</strong> {cartItemsWithDetails.length} item(s)</p>
              <p><strong>Total Amount:</strong> Rs {total.toLocaleString()}</p>
              <p><strong>Payment:</strong> Rs {paymentAmount.toLocaleString()} ({detectedModule === 'daraz' ? 'Full Payment' : 'Upfront Payment'})</p>
              <p><strong>Module:</strong> {detectedModule.toUpperCase()}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Button 
              onClick={() => navigate('/customer-dashboard')} 
              className="w-full bg-green-600 hover:bg-green-700"
            >
              View My Orders
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')} 
              className="w-full"
            >
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
                {detectedModule === 'shopify' && (
                  <div>
                    <Label htmlFor="extraPhone">Extra Phone (Optional)</Label>
                    <Input
                      id="extraPhone"
                      value={formData.extraPhone}
                      onChange={(e) => handleInputChange('extraPhone', e.target.value)}
                      placeholder="+92 300 1234567"
                    />
                  </div>
                )}
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
                {detectedModule === 'shopify' && (
                  <div>
                    <Label htmlFor="nearestLocation">Nearest Location (Optional)</Label>
                    <Input
                      id="nearestLocation"
                      value={formData.nearestLocation}
                      onChange={(e) => handleInputChange('nearestLocation', e.target.value)}
                      placeholder="e.g., Near Mall, Main Road, etc."
                    />
                  </div>
                )}
              </div>
            </Card>

            {/* Note: Profit input is only for Resell orders, not for regular "Buy for Self" checkout */}

            {/* Daraz Required Documents */}
            {detectedModule === 'daraz' && (
              <Card className="p-6 border-2 border-orange-500">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    D
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-orange-700">Daraz Required Documents</h2>
                    <p className="text-xs text-orange-600">Please upload the following documents (PDF only)</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Daraz Order Document (Simplified - One PDF Only) */}
                  <div className="p-4 border border-orange-300 rounded-lg bg-orange-50">
                    <Label htmlFor="darazDocument" className="text-sm font-semibold block mb-2 text-orange-800">
                      Daraz Order Document PDF * <span className="text-xs font-normal">(Required for Daraz)</span>
                    </Label>
                    <p className="text-xs text-orange-700 mb-3">
                      Upload the PDF document for your Daraz order (customer details, address, or order form)
                    </p>
                    <Input
                      id="darazDocument"
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleDarazDocumentUpload}
                      className="cursor-pointer"
                      required={detectedModule === 'daraz'}
                    />
                    {darazDocumentFile && (
                      <div className="mt-3 p-2 bg-white rounded border border-orange-200">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white text-xs font-bold">
                            PDF
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{darazDocumentFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(darazDocumentFile.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setDarazDocumentFile(null);
                              setDarazDocumentPreview(null);
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Payment Method */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Payment Method</h2>
              </div>
              
              <div className="space-y-4">
                {/* Payment Method Selector */}
                <div>
                  <Label htmlFor="paymentMethod" className="text-sm font-semibold block mb-2">
                    Select Payment Method *
                  </Label>
                  <Select 
                    value={formData.paymentMethod} 
                    onValueChange={(value) => handleInputChange('paymentMethod', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easypaisa">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            EP
                          </div>
                          <span>EasyPaisa (Manual Transfer)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="payfast">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                          <span>PayFast (Card/Online)</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* EasyPaisa Payment Info - Show when selected */}
                {formData.paymentMethod === 'easypaisa' && (
                  <div className="p-4 border-2 border-green-500 rounded-lg bg-green-50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                        EP
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-700">EasyPaisa Payment</h3>
                        <p className="text-xs text-green-600">Upload payment receipt to complete your order</p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-2 text-sm">
                      <p><strong>Account:</strong> 03274996979</p>
                      <p><strong>Name:</strong> Muhammad Aneeq Ahmad</p>
                      <p><strong>Method:</strong> EasyPaisa</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 mb-3">
                      Please make payment to the account above and upload receipt to complete your order.
                    </p>

                    {/* Receipt Upload */}
                    <div className="mt-3">
                      <Label htmlFor="receipt" className="text-sm font-semibold block mb-2">
                        Upload Payment Receipt *
                      </Label>
                      <Input
                        id="receipt"
                        type="file"
                        accept="image/*"
                        onChange={handleReceiptUpload}
                        className="cursor-pointer"
                        required
                      />
                      {receiptPreview && (
                        <div className="mt-3">
                          <p className="text-xs text-green-600 mb-2">Receipt preview:</p>
                          <img
                            src={receiptPreview}
                            alt="Receipt preview"
                            className="w-full h-40 object-contain border border-green-300 rounded"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* PayFast Payment Info - Show when selected */}
                {formData.paymentMethod === 'payfast' && (
                  <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-10 h-10 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-blue-700">PayFast Online Payment</h3>
                        <p className="text-xs text-blue-600">Secure payment gateway - Card, Bank Transfer, and more</p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-2">
                      <p className="text-sm"><strong>Accepted Methods:</strong></p>
                      <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                        <li>Credit/Debit Cards (Visa, Mastercard)</li>
                        <li>Instant EFT / Bank Transfer</li>
                        <li>Capitec Pay, Zapper</li>
                        <li>Secure 3D Verification</li>
                      </ul>
                    </div>
                    <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                      <p className="text-xs text-blue-800">
                        <strong>✓ Safe & Secure:</strong> After clicking "Place Order", you'll be redirected to PayFast's secure payment page.
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      No receipt upload needed - payment is verified automatically!
                    </p>
                  </div>
                )}
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
                {cartItemsWithDetails.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No items in cart</p>
                  </div>
                ) : (
                  cartItemsWithDetails.map((item) => {
                    if (!item.product) return null;
                    const itemPrice = item.product.price || 0;
                    const itemQuantity = item.quantity || 0;
                    
                    const itemTotal = itemPrice * itemQuantity;
                    
                    return (
                      <div key={item.productId} className="flex gap-3 p-3 border rounded-lg">
                        <div className="w-16 h-16 rounded bg-muted overflow-hidden flex-shrink-0">
                          <img
                            src={item.product.images?.[0]?.url || item.product.images?.[0] || '/placeholder.svg'}
                            alt={item.product.name || 'Product'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm line-clamp-2 mb-1">
                            {item.product.name || 'Product'}
                          </h3>
                          <p className="text-xs text-muted-foreground mb-1">
                            Category: {item.product.category || 'N/A'}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              Qty: {itemQuantity} × {formatCurrency(itemPrice)}
                            </span>
                            <span className="text-sm font-semibold text-primary">
                              {formatCurrency(itemTotal)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                
                {detectedModule === 'daraz' && (
                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span>{formatCurrency(deliveryCharges)}</span>
                  </div>
                )}
                
                {/* Payment Rule Display */}
                <div className="mt-3 p-3 rounded-lg bg-muted">
                  {detectedModule === 'daraz' ? (
                    <div>
                      <p className="text-sm font-semibold text-orange-600 mb-1">Daraz Module:</p>
                      <p className="text-xs text-muted-foreground">Pay 100% in advance + Rs 50 delivery charges</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-green-600 mb-1">Shopify Module:</p>
                      <p className="text-xs text-muted-foreground">Pay Rs 250 upfront. Delivery charges decided by admin at delivery time</p>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <span className="font-semibold">Order Total</span>
                  <span className="font-semibold">{formatCurrency(total)}</span>
                </div>
                
                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                  <span className={detectedModule === 'daraz' ? 'text-orange-600' : 'text-green-600'}>
                    {detectedModule === 'daraz' ? 'Pay Now (Full Payment + Delivery)' : 'Pay Now (Rs 250)'}
                  </span>
                  <span className={detectedModule === 'daraz' ? 'text-orange-600' : 'text-green-600'}>
                    {formatCurrency(paymentAmount)}
                  </span>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={
                  isProcessing || 
                  !receiptFile || 
                  (detectedModule === 'daraz' && !darazDocumentFile)
                }
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
                    {!receiptFile 
                      ? 'Upload Receipt First' 
                      : detectedModule === 'daraz' && !darazDocumentFile
                      ? 'Upload Required PDF Document First'
                      : 'Complete Order'}
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
