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
import ApiService from '@/services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, clearCart, getCartItemsCount } = useCart();
  const { products, addOrder } = useProducts();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'details' | 'payment' | 'receipt' | 'processing' | 'success'>('details');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  
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
  const cartItemsWithDetails = React.useMemo(() => {
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
  const detectedModule = React.useMemo(() => {
    if (cartItemsWithDetails.length === 0) return 'daraz';
    const firstProduct = cartItemsWithDetails[0]?.product;
    return firstProduct?.module || 'daraz';
  }, [cartItemsWithDetails]);

  // Calculate subtotal with profit for each module
  const subtotal = React.useMemo(() => {
    if (cartItemsWithDetails.length === 0) return 0;
    
    return cartItemsWithDetails.reduce((total, item) => {
      if (!item.product) return total;
      const productPrice = item.product.price || 0;
      const profit = item.product.profit || 0;
      const quantity = item.quantity || 0;
      // For Shopify, user adds profit; for Daraz, profit is built into price
      const itemTotal = detectedModule === 'shopify' 
        ? (productPrice + profit) * quantity
        : productPrice * quantity;
      return total + itemTotal;
    }, 0);
  }, [cartItemsWithDetails, detectedModule]);

  // Delivery charges - only for Daraz (fixed Rs 50), Shopify charges set by admin at delivery
  const deliveryCharges = React.useMemo(() => {
    return detectedModule === 'daraz' ? 50 : 0;
  }, [detectedModule]);
  
  // Payment calculation based on module
  const paymentAmount = React.useMemo(() => {
    return detectedModule === 'daraz' 
      ? subtotal + deliveryCharges  // Daraz: Full payment (100%) + 50 delivery upfront
      : 0;                           // Shopify: Pay nothing upfront, admin decides delivery charges at delivery
  }, [detectedModule, subtotal, deliveryCharges]);
  
  const total = React.useMemo(() => {
    return subtotal + (detectedModule === 'daraz' ? deliveryCharges : 0);
  }, [subtotal, detectedModule, deliveryCharges]);

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

  // Show loading if products are not loaded yet
  if (!products || products.length === 0) {
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStep('processing');

    try {
      // Validate payment receipt
      if (!receiptFile) {
        alert('Please upload payment receipt before proceeding.');
        setPaymentStep('details');
        setIsProcessing(false);
        return;
      }

      // Create WhatsApp message with order details
      const orderDetails = cartItemsWithDetails.map(item => 
        `- ${item.product!.name} x${item.quantity} = Rs ${item.product!.price * item.quantity}`
      ).join('\n');

      const whatsappMessage = `Order Confirmation\n\nCustomer: ${formData.customerName}\nEmail: ${formData.customerEmail}\nPhone: ${formData.customerPhone}\n\nItems:\n${orderDetails}\n\nSubtotal: Rs ${subtotal}\nDelivery Charges: Rs ${deliveryCharges}\nTotal: Rs ${total}\n\nPayment Amount: Rs ${paymentAmount}\n\nAddress: ${formData.street}, ${formData.city}, ${formData.state} ${formData.zipCode}\n\nI have made the payment. Please find attached receipt.`;

      // Open WhatsApp with pre-filled message
      const phoneNumber = '+923256045679';
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;
      
      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');

      // Create order via API (saves to database)
      const orderData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone || '',
        items: cartItemsWithDetails.map(item => ({
          product: item.productId,
          productName: item.product!.name,
          productImageUrl: item.product!.images[0]?.url || '',
          quantity: item.quantity,
          unitPrice: item.product!.price,
          totalPrice: item.product!.price * item.quantity
        })),
        totalAmount: total,
        paymentMethod: formData.paymentMethod,
        module: detectedModule,
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentAmount: paymentAmount,
        paymentType: detectedModule === 'daraz' ? 'full' : 'delivery_only',
        notes: `Payment receipt uploaded. WhatsApp sent to +923256045679`
      };

      // Save order to backend database
      const orderResponse = await ApiService.createOrder(orderData);
      
      console.log('✅ Order saved to database:', orderResponse);

      // Add order to context for frontend
      if (orderResponse.success && orderResponse.data) {
        const backendOrder = orderResponse.data;
        const frontendOrder: Order = {
          id: backendOrder._id || backendOrder.id || `ORDER-${Date.now()}`,
          customerId: user!.id,
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
        addOrder(frontendOrder);
      }

      // Clear cart
      clearCart();

      // Wait a moment then show success
      setTimeout(() => {
        setPaymentStep('success');
        setIsProcessing(false);
      }, 2000);

    } catch (error) {
      console.error('Payment error:', error);
      alert('Order processing failed. Please try again.');
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
          <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-muted-foreground mb-6">
            Your receipt has been sent to WhatsApp. Your order is being processed and you will receive a confirmation soon.
          </p>
          <p className="text-sm font-semibold text-green-600 mb-6">
            WhatsApp Number: +923256045679
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
                {/* EasyPaisa Payment Info */}
                <div className="p-4 border-2 border-green-500 rounded-lg bg-green-50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                      EP
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-700">EasyPaisa Payment</h3>
                      <p className="text-xs text-green-600">Send payment receipt via WhatsApp</p>
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
                      <p className="text-sm font-semibold text-purple-600 mb-1">Shopify Module:</p>
                      <p className="text-xs text-muted-foreground">Pay nothing upfront. Delivery charges decided by admin at delivery time</p>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <span className="font-semibold">Order Total</span>
                  <span className="font-semibold">{formatCurrency(total)}</span>
                </div>
                
                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                  <span className={detectedModule === 'daraz' ? 'text-orange-600' : 'text-purple-600'}>
                    {detectedModule === 'daraz' ? 'Pay Now (Full Payment + Delivery)' : 'Pay Now (Rs 0 - Free)'}
                  </span>
                  <span className={detectedModule === 'daraz' ? 'text-orange-600' : 'text-purple-600'}>
                    {formatCurrency(paymentAmount)}
                  </span>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={isProcessing || !receiptFile}
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
                    {!receiptFile ? 'Upload Receipt First' : 'Complete Order & Send Receipt via WhatsApp'}
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
