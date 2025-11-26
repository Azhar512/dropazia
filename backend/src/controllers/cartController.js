const Cart = require('../models/Cart');
const { connectDB } = require('../config/database-supabase');

// Get user's cart
const getCart = async (req, res) => {
  try {
    // Ensure database connection
    await connectDB();
    
    const userId = req.user.id;
    const cartItems = await Cart.getByUserId(userId);
    
    res.json({
      success: true,
      data: cartItems
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get cart items',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    // Ensure database connection
    await connectDB();
    
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    // Validate inputs
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Add item to cart
    const result = await Cart.addItem(userId, productId, quantity);
    
    res.json({
      success: true,
      message: 'Item added to cart successfully',
      data: result
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    
    // Handle specific errors
    if (error.code === '23503') { // Foreign key violation - product doesn't exist
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update item quantity
const updateQuantity = async (req, res) => {
  try {
    // Ensure database connection
    await connectDB();
    
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    // Validate quantity
    if (quantity === undefined || quantity === null) {
      return res.status(400).json({
        success: false,
        message: 'Quantity is required'
      });
    }

    await Cart.updateQuantity(userId, productId, quantity);
    
    res.json({
      success: true,
      message: 'Cart updated successfully'
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart item',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    // Ensure database connection
    await connectDB();
    
    const userId = req.user.id;
    const { productId } = req.params;

    await Cart.removeItem(userId, productId);
    
    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    // Ensure database connection
    await connectDB();
    
    const userId = req.user.id;
    await Cart.clearCart(userId);
    
    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get cart summary
const getCartSummary = async (req, res) => {
  try {
    // Ensure database connection
    await connectDB();
    
    const userId = req.user.id;
    const [itemCount, total] = await Promise.all([
      Cart.getItemCount(userId),
      Cart.getTotal(userId)
    ]);
    
    res.json({
      success: true,
      data: {
        itemCount,
        total
      }
    });
  } catch (error) {
    console.error('Get cart summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get cart summary',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  getCartSummary
};