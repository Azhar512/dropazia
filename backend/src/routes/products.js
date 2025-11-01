const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByModule
} = require('../controllers/productController');

// Get all products (public - no auth required)
router.get('/', getAllProducts);

// Get products by module (public - no auth required)
router.get('/module/:module', getProductsByModule);

// Get product by ID (public - no auth required)
router.get('/:id', getProductById);

// Create new product (requires authentication)
router.post('/', authenticateToken, createProduct);

// Update product (requires authentication)
router.put('/:id', authenticateToken, updateProduct);

// Delete product (requires authentication)
router.delete('/:id', authenticateToken, deleteProduct);

module.exports = router;
