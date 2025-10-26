const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const {
  createOrder,
  getOrderById,
  getCustomerOrders,
  getOrderStats,
  updateOrderStatus,
  getAllOrders
} = require('../controllers/orderController');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create new order
router.post('/', createOrder);

// Get order by ID
router.get('/:orderId', getOrderById);

// Get customer orders
router.get('/customer/orders', getCustomerOrders);

// Get order statistics
router.get('/customer/stats', getOrderStats);

// Admin routes
router.use(requireAdmin);

// Get all orders (admin only)
router.get('/admin/all', getAllOrders);

// Update order status (admin only)
router.put('/:orderId/status', updateOrderStatus);

module.exports = router;