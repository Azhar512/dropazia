// PostgreSQL Return Model using pg (Supabase)
const { getPool } = require('../config/database-supabase');

class ReturnService {
  // Create return request
  static async create(returnData) {
    const pool = getPool();
    const {
      userId,
      orderId = null,
      orderNumber,
      storeName,
      email,
      module,
      reason,
      status = 'pending'
    } = returnData;

    const result = await pool.query(
      `INSERT INTO returns (user_id, order_id, order_number, store_name, email, module, reason, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [userId, orderId, orderNumber, storeName, email, module, reason, status]
    );

    return result.rows[0];
  }

  // Get return by ID
  static async getById(returnId) {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM returns WHERE id = $1', [returnId]);
    return this.formatReturn(result.rows[0]);
  }

  // Get returns by user
  static async getByUserId(userId, module = null) {
    const pool = getPool();
    let query = 'SELECT * FROM returns WHERE user_id = $1';
    const values = [userId];

    if (module) {
      query += ' AND module = $2';
      values.push(module);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);
    return result.rows.map(row => this.formatReturn(row));
  }

  // Get all returns (admin)
  static async getAll(filters = {}) {
    const pool = getPool();
    let query = 'SELECT * FROM returns WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.status) {
      query += ` AND status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    if (filters.module) {
      query += ` AND module = $${paramCount}`;
      values.push(filters.module);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    if (filters.limit) {
      query += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
      paramCount++;
    }

    if (filters.offset) {
      query += ` OFFSET $${paramCount}`;
      values.push(filters.offset);
      paramCount++;
    }

    const result = await pool.query(query, values);
    return result.rows.map(row => this.formatReturn(row));
  }

  // Update return status
  static async updateStatus(returnId, status, adminNotes = null) {
    const pool = getPool();
    const result = await pool.query(
      `UPDATE returns 
       SET status = $1, admin_notes = COALESCE($2, admin_notes), updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, adminNotes, returnId]
    );

    return this.formatReturn(result.rows[0]);
  }

  // Format return for frontend
  static formatReturn(row) {
    if (!row) return null;

    return {
      id: row.id,
      _id: row.id, // For compatibility
      userId: row.user_id,
      orderId: row.order_id,
      orderNumber: row.order_number,
      storeName: row.store_name,
      email: row.email,
      module: row.module,
      status: row.status,
      reason: row.reason,
      adminNotes: row.admin_notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

module.exports = ReturnService;
