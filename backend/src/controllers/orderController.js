const OrderService = require('../models/Order');
const Cart = require('../models/Cart');

// Create new order
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderData = req.body;

    // Get cart items to create order
    const cartItems = await Cart.getByUserId(userId);
    
    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Prepare order items
    const orderItems = cartItems.map(item => ({
      product: item.product_id,
      productName: item.product_name,
      productSku: item.sku || null,
      productImageUrl: item.product_image_url || null,
      quantity: item.quantity,
      unitPrice: item.price,
      totalPrice: item.price * item.quantity
    }));

    // Calculate total
    const totalAmount = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);

    // Create order data
    const order = {
      customer: userId,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      totalAmount,
      paymentMethod: orderData.paymentMethod,
      module: orderData.module || 'daraz',
      notes: orderData.notes,
      shippingAddress: orderData.shippingAddress,
      items: orderItems
    };

    // Create order
    const newOrder = await OrderService.create(order);

    // Clear cart after successful order creation
    await Cart.clearCart(userId);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
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
    if (order.customer._id.toString() !== userId && req.user.role !== 'admin') {
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
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { page = 1, limit = 50, status } = req.query;
    const offset = (page - 1) * limit;

    const orders = await OrderService.getAll(limit, offset, status);

    res.json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get orders'
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