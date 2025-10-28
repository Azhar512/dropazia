const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  module: {
    type: String,
    enum: ['daraz', 'shopify'],
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
wishlistSchema.index({ user: 1 });
wishlistSchema.index({ product: 1 });
wishlistSchema.index({ module: 1 });
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

class WishlistService {
  // Add product to wishlist
  static async addToWishlist(userId, productId, module) {
    try {
      // Check if already exists
      const existing = await Wishlist.findOne({ user: userId, product: productId });
      if (existing) {
        throw new Error('Product already in wishlist');
      }

      const wishlistItem = new Wishlist({
        user: userId,
        product: productId,
        module
      });

      await wishlistItem.save();
      return wishlistItem;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  }

  // Remove product from wishlist
  static async removeFromWishlist(userId, productId) {
    try {
      const result = await Wishlist.findOneAndDelete({ user: userId, product: productId });
      return result;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  }

  // Get user wishlist
  static async getUserWishlist(userId, module = null) {
    try {
      const filter = { user: userId };
      if (module) {
        filter.module = module;
      }

      const wishlistItems = await Wishlist.find(filter)
        .populate({
          path: 'product',
          select: 'name description price stock images category module status'
        })
        .sort({ addedAt: -1 });

      return wishlistItems;
    } catch (error) {
      console.error('Error getting wishlist:', error);
      throw error;
    }
  }

  // Check if product is in wishlist
  static async isInWishlist(userId, productId) {
    try {
      const item = await Wishlist.findOne({ user: userId, product: productId });
      return !!item;
    } catch (error) {
      console.error('Error checking wishlist:', error);
      throw error;
    }
  }

  // Get wishlist count for a user
  static async getWishlistCount(userId, module = null) {
    try {
      const filter = { user: userId };
      if (module) {
        filter.module = module;
      }
      const count = await Wishlist.countDocuments(filter);
      return count;
    } catch (error) {
      console.error('Error getting wishlist count:', error);
      throw error;
    }
  }
}

module.exports = WishlistService;

