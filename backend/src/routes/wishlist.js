const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
  isInWishlist,
  getWishlistCount
} = require('../controllers/wishlistController');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get user wishlist
router.get('/', getUserWishlist);

// Check if product is in wishlist
router.get('/check/:productId', isInWishlist);

// Get wishlist count
router.get('/count', getWishlistCount);

// Add to wishlist
router.post('/add', addToWishlist);

// Remove from wishlist
router.delete('/remove/:productId', removeFromWishlist);

module.exports = router;

