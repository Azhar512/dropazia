// PostgreSQL Wallet Model using pg (Supabase)
const { getPool } = require('../config/database-supabase');

class Wallet {
  // Get wallet balance for user
  static async getBalance(userId) {
    const pool = getPool();
    const result = await pool.query(
      'SELECT wallet_balance FROM users WHERE id = $1',
      [userId]
    );
    return result.rows[0]?.wallet_balance || 0;
  }

  // Update wallet balance
  static async updateBalance(userId, amount, operation = 'add') {
    const pool = getPool();
    
    // Get current balance
    const currentBalance = await this.getBalance(userId);
    
    let newBalance;
    if (operation === 'add') {
      newBalance = currentBalance + amount;
    } else if (operation === 'subtract') {
      newBalance = Math.max(0, currentBalance - amount); // Prevent negative balance
    } else {
      throw new Error('Invalid operation. Use "add" or "subtract"');
    }

    // Update balance
    await pool.query(
      'UPDATE users SET wallet_balance = $1 WHERE id = $2',
      [newBalance, userId]
    );

    return newBalance;
  }

  // Add transaction record
  static async addTransaction(userId, amount, type, description, orderId = null) {
    const pool = getPool();
    
    // First ensure wallet_transactions table exists (will be created by migration)
    const result = await pool.query(
      `INSERT INTO wallet_transactions (user_id, amount, type, description, order_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, amount, type, description, orderId]
    );

    return result.rows[0];
  }

  // Get transaction history
  static async getTransactions(userId, limit = 50) {
    const pool = getPool();
    const result = await pool.query(
      `SELECT * FROM wallet_transactions 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  }
}

module.exports = Wallet;

