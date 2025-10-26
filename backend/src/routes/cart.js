const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  getCartSummary
} = require('../controllers/cartController');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get user's cart
router.get('/', getCart);

// Get cart summary
router.get('/summary', getCartSummary);

// Add item to cart
router.post('/add', addToCart);

// Update item quantity
router.put('/update/:productId', updateQuantity);

// Remove item from cart
router.delete('/remove/:productId', removeFromCart);

// Clear cart
router.delete('/clear', clearCart);

module.exports = router;