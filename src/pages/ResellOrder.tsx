import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ShoppingBag, 
  TrendingUp, 
  MapPin, 
  User, 
  Phone, 
  Zap,
  CreditCard,
  Loader2
} from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';
import { useAuth } from '@/hooks/useAuth';
import { Product, Order } from '@/types/product';
import { toast } from 'sonner';
import ApiService from '@/services/api';
import UserSidebar from '@/components/UserSidebar';
import WhatsAppButton from '@/components/WhatsAppButton';

const ResellOrder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products, addOrder, refreshOrders } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [profit, setProfit] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Customer information
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    extraPhone: '',
    address: '',
    city: '',
    nearestLocation: '',
    state: ''
  });

  // Load product
  useEffect(() => {
    if (!id) {
      navigate('/shopify-products');
      return;
    }

    const foundProduct = products.find(p => p.id === id);
    if (!foundProduct) {
      toast.error('Product not found');
      navigate('/shopify-products');
      return;
    }

    if (foundProduct.module !== 'shopify') {
      toast.error('Resell Now is only available for Shopify products');
      navigate(`/product/${id}`);
      return;
    }

    setProduct(foundProduct);
    setLoading(false);
  }, [id, products, navigate]);

  // Real-time calculation
  const basePrice = product?.price || 0;
  const sellingPrice = basePrice + profit;
  const subtotal = sellingPrice * quantity;
  const cashHandling = 40; // Fixed Rs 40
  const total = subtotal + cashHandling;
  const paymentAmount = 250; // Fixed Rs 250 upfront

  const handleInputChange = (field: string, value: string | number) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address || !customerInfo.city) {
      toast.error('Please fill in all required customer information');
      return;
    }

    if (profit <= 0) {
      toast.error('Please enter a valid profit amount');
      return;
    }

    if (!receiptFile) {
      toast.error('Please upload payment screenshot before placing order');
      return;
    }

    setIsProcessing(true);

    try {
      // Convert receipt to base64
      let receiptBase64 = null;
      if (receiptFile) {
        receiptBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(receiptFile);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
      }

      // Create order data
      const orderData = {
        customerName: customerInfo.name,
        customerEmail: user?.email || '',
        customerPhone: customerInfo.phone,
        extraPhone: customerInfo.extraPhone || '',
        items: [{
          product: product!.id,
          productName: product!.name,
          productImageUrl: product!.images[0]?.url || '',
          quantity: quantity,
          unitPrice: basePrice,
          profit: profit,
          totalPrice: subtotal
        }],
        totalAmount: total,
        paymentMethod: 'easypaisa',
        module: 'shopify',
        shippingAddress: {
          street: customerInfo.address,
          city: customerInfo.city,
          state: customerInfo.state || 'Punjab',
          zipCode: '',
          country: 'Pakistan',
          nearestLocation: customerInfo.nearestLocation || ''
        },
        paymentAmount: paymentAmount,
        paymentType: 'shopify_250',
        paymentReceipt: receiptBase64 ? {
          name: receiptFile!.name,
          url: receiptBase64,
          type: 'image'
        } : undefined,
        notes: `Resell order - Profit: Rs ${profit} per item. Total profit: Rs ${profit * quantity}. Payment receipt uploaded.`
      };

      // Save order to backend database (CRITICAL: This must succeed)
      const orderResponse = await ApiService.createOrder(orderData);

      // Validate order was saved successfully
      if (!orderResponse.success || !orderResponse.data) {
        throw new Error(orderResponse.message || 'Failed to save order to database');
      }

      console.log('✅ Resell order saved to database:', orderResponse);
      const backendOrder = orderResponse.data;

      // Order is now safely in database - add to frontend context
      const frontendOrder: Order = {
        id: backendOrder._id || backendOrder.id || `ORDER-${Date.now()}`,
        customerId: user!.id,
        customerName: customerInfo.name,
        customerEmail: user!.email || '',
        items: [{
          productId: product!.id,
          productName: product!.name,
          productImage: product!.images[0]?.url || '',
          quantity: quantity,
          price: basePrice + profit, // Total price per item (base + profit)
          totalPrice: subtotal
        }],
        totalAmount: total,
        status: backendOrder.status || 'pending',
        paymentStatus: backendOrder.paymentStatus || 'pending',
        shippingAddress: {
          street: customerInfo.address,
          city: customerInfo.city,
          state: customerInfo.state || 'Punjab',
          zipCode: '',
          country: 'Pakistan'
        },
        createdAt: backendOrder.createdAt || new Date().toISOString(),
        updatedAt: backendOrder.updatedAt || new Date().toISOString(),
        module: 'shopify',
        paymentAmount: paymentAmount,
        paymentType: 'shopify_250'
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

      // Show success message - NO WhatsApp opening
      setOrderPlaced(true);
      toast.success('Your order has been placed!');
    } catch (error) {
      console.error('Order error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
        <span className="ml-2 text-lg">Loading product...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h1>
        <Button onClick={() => navigate('/shopify-products')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>
      </div>
    );
  }

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
            Your resell order has been successfully submitted. Our team will process your order and contact you soon.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-green-800 mb-2">Order Details:</p>
            <div className="text-left space-y-1 text-sm">
              <p><strong>Product:</strong> {product.name}</p>
              <p><strong>Quantity:</strong> {quantity}</p>
              <p><strong>Your Profit:</strong> Rs {profit.toLocaleString()} × {quantity} = Rs {(profit * quantity).toLocaleString()}</p>
              <p><strong>Total Amount:</strong> Rs {total.toLocaleString()}</p>
              <p><strong>Payment:</strong> Rs {paymentAmount.toLocaleString()} (Paid)</p>
            </div>
          </div>
          <div className="space-y-2">
            <Button 
              onClick={() => navigate('/shopify-products')} 
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Continue Shopping
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/customer-dashboard')} 
              className="w-full"
            >
              View My Orders
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserSidebar module="shopify" />
      <WhatsAppButton 
        phoneNumber="+923256045679" 
        message={`Hello! I'm interested in reselling ${product.name}`} 
      />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Product
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Resell Order</h1>
            <p className="text-gray-600">Enter customer information and your profit</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Product Details & Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mode Selection */}
            <Card className="p-6 border-2 border-green-500">
              <div className="flex items-center gap-4">
                <div className="flex-1 flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Buy for Self
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-green-500 bg-green-50 text-green-700"
                    disabled
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Resell Now
                  </Button>
                </div>
              </div>
            </Card>

            {/* Product Details */}
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Product Details</h2>
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={product.images?.[0]?.url || '/placeholder.svg'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-2xl font-bold text-green-600">
                      Rs {basePrice.toLocaleString()}
                    </span>
                    <Badge variant="outline" className="capitalize">
                      {product.category}
                    </Badge>
                  </div>

                  {/* Quantity */}
                  <div className="mb-4">
                    <Label className="text-sm font-medium mb-2 block">Quantity</Label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="w-12 text-center font-semibold">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(prev => prev + 1)}
                        disabled={quantity >= (product.stock || 999)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Profit Input */}
                  <div className="border-2 border-green-500 rounded-lg p-4 bg-green-50">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-5 h-5 text-green-600" />
                      <h4 className="font-bold text-green-700">Apna Profit Add Karain</h4>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="profit" className="text-sm font-medium">
                          Rs. Profit per item (e.g., 10) *
                        </Label>
                        <Input
                          id="profit"
                          type="number"
                          min="0"
                          step="0.01"
                          value={profit || ''}
                          onChange={(e) => setProfit(parseFloat(e.target.value) || 0)}
                          placeholder="Enter your profit"
                          className="mt-1"
                          required
                        />
                        <p className="text-xs text-gray-600 mt-1">
                          Selling Wholesale Price: Rs {basePrice.toLocaleString()} per item
                        </p>
                      </div>
                      {profit > 0 && (
                        <div className="bg-white rounded p-3 border border-green-300">
                          <p className="text-sm font-semibold text-green-700">
                            Total Profit: Rs {(profit * quantity).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Customer Information */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-bold">Customer Information</h2>
                <Badge variant="destructive" className="ml-auto">Required</Badge>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerName">Customer Name *</Label>
                    <Input
                      id="customerName"
                      value={customerInfo.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter customer name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">Phone Number *</Label>
                    <Input
                      id="customerPhone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+92 300 1234567"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="extraPhone">Extra Phone (Optional)</Label>
                    <Input
                      id="extraPhone"
                      type="tel"
                      value={customerInfo.extraPhone}
                      onChange={(e) => handleInputChange('extraPhone', e.target.value)}
                      placeholder="+92 300 1234567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={customerInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Enter city"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Textarea
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="House number, street, area"
                    required
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Select 
                      value={customerInfo.state} 
                      onValueChange={(value) => handleInputChange('state', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Punjab">Punjab</SelectItem>
                        <SelectItem value="Sindh">Sindh</SelectItem>
                        <SelectItem value="KPK">KPK</SelectItem>
                        <SelectItem value="Balochistan">Balochistan</SelectItem>
                        <SelectItem value="Islamabad">Islamabad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="nearestLocation">Nearest Location (Optional)</Label>
                    <Input
                      id="nearestLocation"
                      value={customerInfo.nearestLocation}
                      onChange={(e) => handleInputChange('nearestLocation', e.target.value)}
                      placeholder="e.g., Near Mall, Main Road"
                    />
                  </div>
                </div>

                <Separator />

                {/* Payment Receipt Upload */}
                <Card className="p-6 border-2 border-orange-500 bg-orange-50">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-orange-600" />
                    <h3 className="text-lg font-bold text-orange-700">Payment Receipt Upload</h3>
                    <Badge variant="destructive" className="ml-auto">Required</Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                      <p className="text-sm font-semibold text-orange-800 mb-2">EasyPaisa Account Details:</p>
                      <div className="space-y-1 text-sm">
                        <p><strong>Account:</strong> 03274996979</p>
                        <p><strong>Name:</strong> Muhammad Aneeq Ahmad</p>
                        <p><strong>Payment Amount:</strong> Rs {paymentAmount.toLocaleString()}</p>
                      </div>
                      <p className="text-xs text-gray-600 mt-3">
                        Please make payment to the account above and upload the screenshot receipt.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="receipt" className="text-sm font-semibold block mb-2">
                        Upload Payment Screenshot *
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
                            className="w-full h-40 object-contain border border-green-300 rounded bg-white"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setReceiptFile(null);
                              setReceiptPreview(null);
                            }}
                            className="mt-2 text-xs"
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Order Summary Card */}
                <Card className="p-4 bg-green-50 border-green-200">
                  <h3 className="font-bold mb-3">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Base Price:</span>
                      <span>Rs {basePrice.toLocaleString()} × {quantity}</span>
                    </div>
                    <div className="flex justify-between text-green-700">
                      <span>Your Profit:</span>
                      <span className="font-bold">Rs {profit.toLocaleString()} × {quantity} = Rs {(profit * quantity).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Subtotal:</span>
                      <span>Rs {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cash Handling:</span>
                      <span>Rs {cashHandling.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">Rs {total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t-2 border-green-300">
                      <span>Payment Amount:</span>
                      <span className="text-orange-600">Rs {paymentAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </Card>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                  disabled={isProcessing || profit <= 0 || !receiptFile}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Place Resell Order (Pay Rs {paymentAmount.toLocaleString()})
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              
              {/* Product Card */}
              <div className="flex gap-3 p-3 border rounded-lg mb-4 bg-white">
                <div className="w-16 h-16 rounded bg-gray-100 overflow-hidden flex-shrink-0 relative">
                  <img
                    src={product.images?.[0]?.url || '/placeholder.svg'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-1 right-1 bg-green-600">
                    {quantity}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-600 mb-1">
                    Size: Standard
                  </p>
                  <p className="text-sm font-bold text-green-600">
                    Rs {subtotal.toLocaleString()}
                  </p>
                </div>
              </div>

              <Separator className="mb-4" />

              {/* Cost Breakdown */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-semibold">Rs {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Cash Handling:</span>
                  <span>Rs {cashHandling.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">Rs {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Info */}
              <Card className="p-4 bg-orange-50 border-orange-200 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <p className="text-sm font-semibold text-orange-700">
                    Payment Required
                  </p>
                </div>
                <p className="text-xs text-orange-600 mb-3">
                  Pay Rs {paymentAmount.toLocaleString()} upfront to place this resell order.
                </p>
                <div className="bg-white rounded p-2 border border-orange-200">
                  <p className="text-xs text-gray-600 mb-1">EasyPaisa Account:</p>
                  <p className="text-sm font-semibold">03274996979</p>
                  <p className="text-xs text-gray-600">Muhammad Aneeq Ahmad</p>
                </div>
              </Card>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700">
                  <strong>Note:</strong> Shipping costs will be calculated by admin at delivery time. 
                  You'll receive order confirmation via WhatsApp.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResellOrder;

