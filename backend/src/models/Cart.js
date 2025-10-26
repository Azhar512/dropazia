const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
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
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  timestamps: true
});

// Ensure one cart item per user-product combination
cartItemSchema.index({ user: 1, product: 1 }, { unique: true });

// Index for better performance
cartItemSchema.index({ user: 1 });

const CartItem = mongoose.model('CartItem', cartItemSchema);

class Cart {
  // Get user's cart with populated product data
  static async getByUserId(userId) {
    try {
      const cartItems = await CartItem.find({ user: userId })
        .populate({
          path: 'product',
          select: 'name price stock module images',
          populate: {
            path: 'images',
            match: { isPrimary: true },
            select: 'url altText'
          }
        })
        .sort({ createdAt: -1 });

      // Transform the data to match frontend expectations
      return cartItems.map(item => ({
        id: item._id,
        product_id: item.product._id,
        product_name: item.product.name,
        price: item.product.price,
        stock: item.product.stock,
        module: item.product.module,
        product_image_url: item.product.images[0]?.url || null,
        quantity: item.quantity,
        added_at: item.createdAt
      }));
    } catch (error) {
      console.error('Error getting cart:', error);
      throw error;
    }
  }

  // Add item to cart
  static async addItem(userId, productId, quantity = 1) {
    try {
      const existingItem = await CartItem.findOne({
        user: userId,
        product: productId
      });

      if (existingItem) {
        // Update existing item quantity
        existingItem.quantity += quantity;
        await existingItem.save();
      } else {
        // Create new cart item
        await CartItem.create({
          user: userId,
          product: productId,
          quantity
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  // Update item quantity
  static async updateQuantity(userId, productId, quantity) {
    try {
      if (quantity <= 0) {
        return await this.removeItem(userId, productId);
      }

      const item = await CartItem.findOneAndUpdate(
        { user: userId, product: productId },
        { quantity },
        { new: true }
      );

      return item;
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      throw error;
    }
  }

  // Remove item from cart
  static async removeItem(userId, productId) {
    try {
      const item = await CartItem.findOneAndDelete({
        user: userId,
        product: productId
      });

      return item;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  // Clear user's cart
  static async clearCart(userId) {
    try {
      await CartItem.deleteMany({ user: userId });
      return { success: true };
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  // Get cart item count
  static async getItemCount(userId) {
    try {
      const result = await CartItem.aggregate([
        { $match: { user: mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, total: { $sum: '$quantity' } } }
      ]);

      return result.length > 0 ? result[0].total : 0;
    } catch (error) {
      console.error('Error getting cart count:', error);
      return 0;
    }
  }

  // Get cart total
  static async getTotal(userId) {
    try {
      const result = await CartItem.aggregate([
        { $match: { user: mongoose.Types.ObjectId(userId) } },
        {
          $lookup: {
            from: 'products',
            localField: 'product',
            foreignField: '_id',
            as: 'productData'
          }
        },
        { $unwind: '$productData' },
        {
          $group: {
            _id: null,
            total: {
              $sum: { $multiply: ['$quantity', '$productData.price'] }
            }
          }
        }
      ]);

      return result.length > 0 ? result[0].total : 0;
    } catch (error) {
      console.error('Error getting cart total:', error);
      return 0;
    }
  }
}

module.exports = Cart;