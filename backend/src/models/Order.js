// PostgreSQL Order Model using pg (Supabase)
const { getPool } = require('../config/database-supabase');

class OrderService {
  // Create new order
  static async create(orderData) {
    const pool = getPool();
    const {
      orderNumber,
      customerId,
      customerName,
      customerEmail,
      customerPhone = null,
      totalAmount,
      status = 'pending',
      paymentStatus = 'pending',
      paymentMethod = null,
      paymentReference = null,
      module,
      notes = null,
      items = [],
      shippingAddress,
      customerAddressDocument = null,
      darazCustomerDocument = null,
      receiptDocument = null
    } = orderData;

    // Generate order number if not provided
    const finalOrderNumber = orderNumber || `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const result = await pool.query(
      `INSERT INTO orders (
        order_number, customer_id, customer_name, customer_email, customer_phone,
        total_amount, status, payment_status, payment_method, payment_reference,
        module, notes, items, shipping_address,
        customer_address_document, daraz_customer_document, receipt_document
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *`,
      [
        finalOrderNumber,
        customerId,
        customerName,
        customerEmail,
        customerPhone,
        totalAmount,
        status,
        paymentStatus,
        paymentMethod,
        paymentReference,
        module,
        notes,
        JSON.stringify(items),
        JSON.stringify(shippingAddress),
        customerAddressDocument ? JSON.stringify(customerAddressDocument) : null,
        darazCustomerDocument ? JSON.stringify(darazCustomerDocument) : null,
        receiptDocument ? JSON.stringify(receiptDocument) : null
      ]
    );

    return result.rows[0];
  }

  // Get order by ID
  static async getById(orderId) {
    const pool = getPool();
    const result = await pool.query(
      `SELECT o.*, u.name as customer_name_full, u.email as customer_email_full, u.phone as customer_phone_full
       FROM orders o
       LEFT JOIN users u ON o.customer_id = u.id
       WHERE o.id = $1`,
      [orderId]
    );

    return this.formatOrder(result.rows[0]);
  }

  // Get order by order number
  static async getByOrderNumber(orderNumber) {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM orders WHERE order_number = $1', [orderNumber]);
    return this.formatOrder(result.rows[0]);
  }

  // Get orders by customer
  static async getByCustomerId(customerId, limit = 50, offset = 0) {
    const pool = getPool();
    const result = await pool.query(
      `SELECT * FROM orders 
       WHERE customer_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [customerId, limit, offset]
    );

    return result.rows.map(row => this.formatOrder(row));
  }

  // Update order status
  static async updateStatus(orderId, status, paymentStatus = null) {
    const pool = getPool();
    const updateFields = ['status = $1'];
    const values = [status];
    
    if (paymentStatus) {
      updateFields.push('payment_status = $2');
      values.push(paymentStatus);
    }

    values.push(orderId);
    
    const result = await pool.query(
      `UPDATE orders SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${values.length}
       RETURNING *`,
      values
    );

    return this.formatOrder(result.rows[0]);
  }

  // Update order
  static async update(orderId, updateData) {
    const pool = getPool();
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined) {
        const columnName = key === 'shippedAt' ? 'shipped_at' :
                          key === 'deliveredAt' ? 'delivered_at' : key;
        
        if (['items', 'shipping_address', 'customer_address_document', 'daraz_customer_document', 'receipt_document'].includes(columnName)) {
          fields.push(`${columnName} = $${paramCount}::jsonb`);
          values.push(JSON.stringify(value));
        } else {
          fields.push(`${columnName} = $${paramCount}`);
          values.push(value);
        }
        paramCount++;
      }
    }

    if (fields.length === 0) {
      return await this.getById(orderId);
    }

    values.push(orderId);
    const result = await pool.query(
      `UPDATE orders SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    return this.formatOrder(result.rows[0]);
  }

  // Get order statistics
  static async getStats(customerId, module = null) {
    const pool = getPool();
    let query = `
      SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
        SUM(CASE WHEN status = 'shipped' THEN 1 ELSE 0 END) as shipped_orders,
        SUM(CASE WHEN status IN ('pending', 'confirmed') THEN 1 ELSE 0 END) as processing_orders,
        COALESCE(SUM(total_amount), 0) as total_spent
      FROM orders
      WHERE customer_id = $1
    `;
    const values = [customerId];

    if (module) {
      query += ' AND module = $2';
      values.push(module);
    }

    const result = await pool.query(query, values);
    return {
      totalOrders: parseInt(result.rows[0].total_orders || 0),
      deliveredOrders: parseInt(result.rows[0].delivered_orders || 0),
      shippedOrders: parseInt(result.rows[0].shipped_orders || 0),
      processingOrders: parseInt(result.rows[0].processing_orders || 0),
      totalSpent: parseFloat(result.rows[0].total_spent || 0)
    };
  }

  // Get all orders (admin)
  static async getAll(limit = 50, offset = 0, status = null) {
    const pool = getPool();
    let query = 'SELECT * FROM orders WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (status) {
      query += ` AND status = $${paramCount}`;
      values.push(status);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';
    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows.map(row => this.formatOrder(row));
  }

  // Format order for frontend
  static formatOrder(row) {
    if (!row) return null;

    // Parse JSON fields
    let items = [];
    let shippingAddress = {};
    let customerAddressDocument = null;
    let darazCustomerDocument = null;
    let receiptDocument = null;

    try {
      items = typeof row.items === 'string' ? JSON.parse(row.items) : (row.items || []);
      shippingAddress = typeof row.shipping_address === 'string' ? JSON.parse(row.shipping_address) : (row.shipping_address || {});
      customerAddressDocument = row.customer_address_document ? 
        (typeof row.customer_address_document === 'string' ? JSON.parse(row.customer_address_document) : row.customer_address_document) : null;
      darazCustomerDocument = row.daraz_customer_document ?
        (typeof row.daraz_customer_document === 'string' ? JSON.parse(row.daraz_customer_document) : row.daraz_customer_document) : null;
      receiptDocument = row.receipt_document ?
        (typeof row.receipt_document === 'string' ? JSON.parse(row.receipt_document) : row.receipt_document) : null;
    } catch (e) {
      console.error('Error parsing order JSON fields:', e);
    }

    return {
      id: row.id,
      _id: row.id, // For compatibility
      orderNumber: row.order_number,
      customerId: row.customer_id,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      customerPhone: row.customer_phone,
      totalAmount: parseFloat(row.total_amount),
      status: row.status,
      paymentStatus: row.payment_status,
      paymentMethod: row.payment_method,
      paymentReference: row.payment_reference,
      module: row.module,
      notes: row.notes,
      items,
      shippingAddress,
      customerAddressDocument,
      darazCustomerDocument,
      receiptDocument,
      shippedAt: row.shipped_at,
      deliveredAt: row.delivered_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

module.exports = OrderService;
