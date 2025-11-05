// PostgreSQL User Model using pg (Supabase)
const { getPool } = require('../config/database-supabase');

class User {
  // Find user by email
  static async findByEmail(email) {
    const pool = getPool();
    const result = await pool.query(
      'SELECT * FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );
    return result.rows[0] || null;
  }

  // Find user by ID
  static async findById(id) {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  // Create new user
  static async create(userData) {
    const pool = getPool();
    const {
      name,
      email,
      passwordHash,
      phone = null,
      role = 'buyer',
      module = null,
      status = 'approved',
      isActive = true
    } = userData;

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, phone, role, module, status, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, email.toLowerCase(), passwordHash, phone, role, module, status, isActive]
    );

    return result.rows[0];
  }

  // Update user
  static async update(id, updateData) {
    const pool = getPool();
    const fields = [];
    const values = [];
    let paramCount = 1;

    // Build dynamic update query
    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined) {
        // Map mongoose field names to PostgreSQL column names
        const columnName = key === 'passwordHash' ? 'password_hash' :
                          key === 'lastLogin' ? 'last_login' :
                          key === 'isActive' ? 'is_active' :
                          key === 'updatedAt' ? 'updated_at' : key;

        fields.push(`${columnName} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      return await this.findById(id);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  // Find users with filters (for admin)
  static async find(filters = {}) {
    const pool = getPool();
    let query = 'SELECT * FROM users WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.status) {
      query += ` AND status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    if (filters.role) {
      query += ` AND role = $${paramCount}`;
      values.push(filters.role);
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
    return result.rows;
  }

  // Count users
  static async count(filters = {}) {
    const pool = getPool();
    let query = 'SELECT COUNT(*) FROM users WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.status) {
      query += ` AND status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    if (filters.role) {
      query += ` AND role = $${paramCount}`;
      values.push(filters.role);
      paramCount++;
    }

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count);
  }

  // Update last login
  static async updateLastLogin(id) {
    const pool = getPool();
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );
  }

  // Delete user (soft delete by setting is_active = false)
  static async delete(id) {
    return await this.update(id, { isActive: false });
  }

  // Convert PostgreSQL row to frontend format
  static formatUser(row) {
    if (!row) return null;
    
    return {
      id: row.id,
      _id: row.id, // For compatibility
      name: row.name,
      email: row.email,
      phone: row.phone,
      role: row.role,
      module: row.module,
      status: row.status,
      isActive: row.is_active,
      lastLogin: row.last_login,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

module.exports = User;
