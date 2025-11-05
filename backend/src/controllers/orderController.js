const OrderService = require('../models/Order');
const Cart = require('../models/Cart');
const { connectDB } = require('../config/database-supabase');

// Create new order
const createOrder = async (req, res) => {
  try {
    // Ensure database connection
    await connectDB();

    const userId = req.user.id;
    const orderData = req.body;

    // If items are provided directly in request body, use them
    // Otherwise, get from cart (backward compatibility)
    let orderItems = [];
    
    if (orderData.items && Array.isArray(orderData.items) && orderData.items.length > 0) {
      // Items provided directly from checkout
      orderItems = orderData.items.map(item => ({
        product: item.product,
        productName: item.productName,
        productSku: item.productSku || null,
        productImageUrl: item.productImageUrl || null,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice
      }));
    } else {
      // Fallback: Get from cart
      const cartItems = await Cart.getByUserId(userId);
      
      if (cartItems.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Cart is empty'
        });
      }

      orderItems = cartItems.map(item => ({
        product: item.product_id,
        productName: item.product_name,
        productSku: item.sku || null,
        productImageUrl: item.product_image_url || null,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity
      }));
    }

    if (orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in order'
      });
    }

    // Calculate total (use provided totalAmount or calculate)
    const totalAmount = orderData.totalAmount || orderItems.reduce((sum, item) => sum + item.totalPrice, 0);

    // Create order data
    const order = {
      customerId: userId,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone || '',
      totalAmount,
      paymentMethod: orderData.paymentMethod || 'jazzcash',
      module: orderData.module || 'daraz',
      notes: orderData.notes || '',
      shippingAddress: orderData.shippingAddress || {},
      items: orderItems,
      // Daraz specific documents (stored as base64 strings in url field)
      customerAddressDocument: orderData.customerAddressDocument || null,
      darazCustomerDocument: orderData.darazCustomerDocument || null
    };

    console.log('📦 Creating order:', {
      customer: order.customerName,
      email: order.customerEmail,
      items: orderItems.length,
      total: totalAmount,
      module: order.module
    });

    // Create order
    const newOrder = await OrderService.create(order);

    // Clear cart after successful order creation (if cart was used)
    if (!orderData.items || orderData.items.length === 0) {
      try {
        await Cart.clearCart(userId);
      } catch (cartError) {
        console.warn('⚠️ Could not clear cart:', cartError.message);
      }
    }

    console.log('✅ Order created successfully:', newOrder.orderNumber);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder
    });

  } catch (error) {
    console.error('❌ Create order error:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      body: req.body
    });
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await OrderService.getById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order (unless admin)
    if (order.customerId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get order'
    });
  }
};

// Get customer orders
const getCustomerOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const orders = await OrderService.getByCustomerId(userId, limit, offset);

    res.json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error('Get customer orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get orders'
    });
  }
};

// Get order statistics
const getOrderStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await OrderService.getStats(userId);

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get order statistics'
    });
  }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { orderId } = req.params;
    const { status, paymentStatus } = req.body;

    const updatedOrder = await OrderService.updateStatus(orderId, status, paymentStatus);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
};

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    // Ensure database connection
    await connectDB();

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { page = 1, limit = 100, status } = req.query;
    const offset = (page - 1) * limit;

    const orders = await OrderService.getAll(parseInt(limit), parseInt(offset), status);

    // Map orders for frontend
    const mappedOrders = orders.map(order => ({
      id: order.id,
      _id: order.id,
      orderNumber: order.orderNumber,
      customer: {
        id: order.customerId || '',
        name: order.customerName || 'Unknown',
        email: order.customerEmail || '',
        phone: order.customerPhone || ''
      },
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      items: order.items || [],
      totalAmount: order.totalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      module: order.module,
      shippingAddress: order.shippingAddress || {},
      customerAddressDocument: order.customerAddressDocument || null,
      darazCustomerDocument: order.darazCustomerDocument || null,
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt
    }));

    console.log(`📊 Returning ${mappedOrders.length} orders to admin`);

    res.json({
      success: true,
      data: mappedOrders,
      count: mappedOrders.length
    });

  } catch (error) {
    console.error('❌ Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get orders',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getCustomerOrders,
  getOrderStats,
  updateOrderStatus,
  getAllOrders
};