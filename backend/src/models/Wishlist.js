// PostgreSQL Wishlist Model using pg (Supabase)
const { getPool } = require('../config/database-supabase');
const Product = require('./Product');

class WishlistService {
  // Add product to wishlist
  static async addToWishlist(userId, productId, module) {
    const pool = getPool();
    
    // Check if already exists
    const existing = await pool.query(
      'SELECT * FROM wishlists WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    if (existing.rows.length > 0) {
      throw new Error('Product already in wishlist');
    }

    const result = await pool.query(
      'INSERT INTO wishlists (user_id, product_id, module) VALUES ($1, $2, $3) RETURNING *',
      [userId, productId, module]
    );

    return result.rows[0];
  }

  // Remove product from wishlist
  static async removeFromWishlist(userId, productId) {
    const pool = getPool();
    const result = await pool.query(
      'DELETE FROM wishlists WHERE user_id = $1 AND product_id = $2 RETURNING *',
      [userId, productId]
    );

    return result.rows[0] || null;
  }

  // Get user wishlist
  static async getUserWishlist(userId, module = null) {
    const pool = getPool();
    let query = `
      SELECT 
        w.id,
        w.user_id,
        w.product_id,
        w.module,
        w.added_at,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.images,
        p.category,
        p.module as product_module,
        p.status
      FROM wishlists w
      INNER JOIN products p ON w.product_id = p.id
      WHERE w.user_id = $1
    `;
    const values = [userId];

    if (module) {
      query += ' AND w.module = $2';
      values.push(module);
    }

    query += ' ORDER BY w.added_at DESC';

    const result = await pool.query(query, values);

    return result.rows.map(row => {
      let images = [];
      try {
        images = typeof row.images === 'string' ? JSON.parse(row.images) : (row.images || []);
      } catch (e) {
        images = [];
      }

      const productData = Product.formatProduct({
        id: row.product_id,
        name: row.name,
        description: row.description,
        price: row.price,
        stock: row.stock,
        images: row.images,
        category: row.category,
        module: row.product_module,
        status: row.status,
        created_at: null,
        updated_at: null
      });

      return {
        id: row.id,
        user: row.user_id,
        product: row.product_id,
        module: row.module,
        addedAt: row.added_at,
        product: productData
      };
    });
  }

  // Check if product is in wishlist
  static async isInWishlist(userId, productId) {
    const pool = getPool();
    const result = await pool.query(
      'SELECT * FROM wishlists WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    return result.rows.length > 0;
  }

  // Get wishlist count for a user
  static async getWishlistCount(userId, module = null) {
    const pool = getPool();
    let query = 'SELECT COUNT(*) FROM wishlists WHERE user_id = $1';
    const values = [userId];

    if (module) {
      query += ' AND module = $2';
      values.push(module);
    }

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count || 0);
  }
}

module.exports = WishlistService;
