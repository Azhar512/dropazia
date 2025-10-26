const Cart = require('../models/Cart');

// Get user's cart
const getCart = async (req, res) => {
  try {
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
      message: 'Failed to get cart items'
    });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    await Cart.addItem(userId, productId, quantity);
    
    res.json({
      success: true,
      message: 'Item added to cart successfully'
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart'
    });
  }
};

// Update item quantity
const updateQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    await Cart.updateQuantity(userId, productId, quantity);
    
    res.json({
      success: true,
      message: 'Cart updated successfully'
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart item'
    });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
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
      message: 'Failed to remove item from cart'
    });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
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
      message: 'Failed to clear cart'
    });
  }
};

// Get cart summary
const getCartSummary = async (req, res) => {
  try {
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
      message: 'Failed to get cart summary'
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