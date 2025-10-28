const Wishlist = require('../models/Wishlist');

// Add to wishlist
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, module } = req.body;

    if (!productId || !module) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and module are required'
      });
    }

    const wishlistItem = await Wishlist.addToWishlist(userId, productId, module);

    res.status(201).json({
      success: true,
      message: 'Product added to wishlist',
      data: wishlistItem
    });

  } catch (error) {
    console.error('Add to wishlist error:', error);
    
    if (error.message === 'Product already in wishlist') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to add to wishlist'
    });
  }
};

// Remove from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const result = await Wishlist.removeFromWishlist(userId, productId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in wishlist'
      });
    }

    res.json({
      success: true,
      message: 'Product removed from wishlist'
    });

  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove from wishlist'
    });
  }
};

// Get user wishlist
const getUserWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { module } = req.query;

    const wishlistItems = await Wishlist.getUserWishlist(userId, module);

    res.json({
      success: true,
      data: wishlistItems
    });

  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get wishlist'
    });
  }
};

// Check if product is in wishlist
const isInWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const inWishlist = await Wishlist.isInWishlist(userId, productId);

    res.json({
      success: true,
      inWishlist
    });

  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check wishlist status'
    });
  }
};

// Get wishlist count
const getWishlistCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { module } = req.query;

    const count = await Wishlist.getWishlistCount(userId, module);

    res.json({
      success: true,
      count
    });

  } catch (error) {
    console.error('Get wishlist count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get wishlist count'
    });
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
  isInWishlist,
  getWishlistCount
};

