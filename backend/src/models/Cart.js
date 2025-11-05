// PostgreSQL Cart Model using pg (Supabase)
const { getPool } = require('../config/database-supabase');
const Product = require('./Product');

class Cart {
  // Get user's cart with populated product data
  static async getByUserId(userId) {
    const pool = getPool();
    const result = await pool.query(
      `SELECT 
        ci.id,
        ci.user_id,
        ci.product_id,
        ci.quantity,
        ci.created_at,
        ci.updated_at,
        p.name as product_name,
        p.price,
        p.stock,
        p.module,
        p.images
      FROM cart_items ci
      INNER JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = $1
      ORDER BY ci.created_at DESC`,
      [userId]
    );

    // Transform the data to match frontend expectations
    return result.rows.map(item => {
      let images = [];
      try {
        images = typeof item.images === 'string' ? JSON.parse(item.images) : (item.images || []);
      } catch (e) {
        images = [];
      }
      
      const primaryImage = images.find(img => img.isPrimary) || images[0];
      
      return {
        id: item.id,
        product_id: item.product_id,
        product_name: item.product_name,
        price: parseFloat(item.price),
        stock: parseInt(item.stock || 0),
        module: item.module,
        product_image_url: primaryImage?.url || null,
        quantity: parseInt(item.quantity),
        added_at: item.created_at
      };
    });
  }

  // Add item to cart
  static async addItem(userId, productId, quantity = 1) {
    const pool = getPool();
    
    // Check if item already exists
    const existing = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    if (existing.rows.length > 0) {
      // Update existing item quantity
      const result = await pool.query(
        'UPDATE cart_items SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND product_id = $3 RETURNING *',
        [quantity, userId, productId]
      );
      return { success: true, item: result.rows[0] };
    } else {
      // Create new cart item
      const result = await pool.query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
        [userId, productId, quantity]
      );
      return { success: true, item: result.rows[0] };
    }
  }

  // Update item quantity
  static async updateQuantity(userId, productId, quantity) {
    const pool = getPool();
    
    if (quantity <= 0) {
      return await this.removeItem(userId, productId);
    }

    const result = await pool.query(
      'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND product_id = $3 RETURNING *',
      [quantity, userId, productId]
    );

    return result.rows[0] || null;
  }

  // Remove item from cart
  static async removeItem(userId, productId) {
    const pool = getPool();
    const result = await pool.query(
      'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 RETURNING *',
      [userId, productId]
    );

    return result.rows[0] || null;
  }

  // Clear user's cart
  static async clearCart(userId) {
    const pool = getPool();
    await pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
    return { success: true };
  }

  // Get cart item count
  static async getItemCount(userId) {
    const pool = getPool();
    const result = await pool.query(
      'SELECT COALESCE(SUM(quantity), 0) as total FROM cart_items WHERE user_id = $1',
      [userId]
    );

    return parseInt(result.rows[0].total || 0);
  }

  // Get cart total
  static async getTotal(userId) {
    const pool = getPool();
    const result = await pool.query(
      `SELECT COALESCE(SUM(ci.quantity * p.price), 0) as total
       FROM cart_items ci
       INNER JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1`,
      [userId]
    );

    return parseFloat(result.rows[0].total || 0);
  }
}

module.exports = Cart;
