import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Package, ShoppingBag, MapPin, Calendar, CreditCard, Eye, User, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/contexts/ProductContext';
import { Order } from '@/types/product';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getOrdersByCustomer, refreshOrders, products } = useProducts();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Refresh orders when component mounts or user changes
  useEffect(() => {
    if (user) {
      refreshOrders();
    }
  }, [user, refreshOrders]);

  // Get full product details for order items
  const getProductDetails = (productId: string) => {
    return products.find(p => p.id === productId);
  };

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
    return `Rs ${amount.toLocaleString()}`;
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
                    <Dialog 
                      open={isDialogOpen && selectedOrder?.id === order.id} 
                      onOpenChange={(open) => {
                        if (!open) {
                          setIsDialogOpen(false);
                          setSelectedOrder(null);
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedOrder(order);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Order Details - {order.id}</DialogTitle>
                          <DialogDescription>
                            Placed on {formatDate(order.createdAt)}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          {/* Order Status */}
                          <div className="flex items-center gap-4">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                            <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {order.module}
                            </Badge>
                          </div>

                          <Separator />

                          {/* Customer Information */}
                          <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                              <User className="w-4 h-4" />
                              Customer Information
                            </h3>
                            <div className="space-y-2 text-sm">
                              <p><strong>Name:</strong> {order.customerName}</p>
                              <p className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <strong>Email:</strong> {order.customerEmail}
                              </p>
                            </div>
                          </div>

                          <Separator />

                          {/* Order Items with Product Details */}
                          <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              Order Items ({order.items.length})
                            </h3>
                            <div className="space-y-4">
                              {order.items.map((item, index) => {
                                const productDetails = getProductDetails(item.productId);
                                return (
                                  <Card key={index} className="p-4">
                                    <div className="flex gap-4 mb-4">
                                      {item.productImage && (
                                        <img
                                          src={item.productImage}
                                          alt={item.productName}
                                          className="w-24 h-24 object-cover rounded-lg"
                                        />
                                      )}
                                      <div className="flex-1">
                                        <h4 className="font-bold text-lg mb-2">{item.productName}</h4>
                                        <div className="flex items-center gap-2 mb-2">
                                          <Badge variant="outline" className="capitalize text-xs">
                                            {productDetails?.category || 'N/A'}
                                          </Badge>
                                          <Badge variant="outline" className="text-xs">
                                            Qty: {item.quantity}
                                          </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">
                                          {productDetails?.description || 'No description available'}
                                        </p>
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm text-muted-foreground">
                                            Price: {formatCurrency(item.price)} × {item.quantity}
                                          </span>
                                          <span className="font-bold text-lg">{formatCurrency(item.totalPrice)}</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Product Specifications */}
                                    {productDetails?.specifications && productDetails.specifications.length > 0 && (
                                      <div className="mt-4 pt-4 border-t">
                                        <h5 className="font-semibold text-sm mb-2">Specifications:</h5>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                          {productDetails.specifications.map((spec, specIndex) => (
                                            <div key={specIndex} className="flex justify-between">
                                              <span className="text-muted-foreground">{spec.name}:</span>
                                              <span className="font-medium">{spec.value}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Product Images Gallery */}
                                    {productDetails?.images && productDetails.images.length > 0 && (
                                      <div className="mt-4 pt-4 border-t">
                                        <h5 className="font-semibold text-sm mb-2">Product Images:</h5>
                                        <div className="grid grid-cols-4 gap-2">
                                          {productDetails.images.slice(0, 4).map((image, imgIndex) => (
                                            <img
                                              key={imgIndex}
                                              src={image.url}
                                              alt={image.alt || item.productName}
                                              className="w-full h-20 object-cover rounded border"
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </Card>
                                );
                              })}
                            </div>
                          </div>

                          <Separator />

                          {/* Order Summary */}
                          <div>
                            <h3 className="font-semibold mb-3">Order Summary</h3>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span className="font-semibold">{formatCurrency(order.totalAmount - (order.module === 'daraz' ? 50 : 0))}</span>
                              </div>
                              {order.module === 'daraz' && (
                                <div className="flex justify-between">
                                  <span>Delivery Charges:</span>
                                  <span>Rs 50</span>
                                </div>
                              )}
                              {order.paymentAmount && (
                                <div className="flex justify-between">
                                  <span>Payment Amount:</span>
                                  <span className="font-semibold text-green-600">{formatCurrency(order.paymentAmount)}</span>
                                </div>
                              )}
                              <Separator />
                              <div className="flex justify-between text-lg font-bold">
                                <span>Total Amount:</span>
                                <span className="text-green-600">{formatCurrency(order.totalAmount)}</span>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          {/* Shipping Address */}
                          <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              Shipping Address
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}, {order.shippingAddress.country}
                            </p>
                          </div>

                          {/* Order Dates */}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Created: {formatDate(order.createdAt)}</span>
                            </div>
                            {order.updatedAt !== order.createdAt && (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Updated: {formatDate(order.updatedAt)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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
