// PostgreSQL Product Model using pg (Supabase)
const { getPool } = require('../config/database-supabase');

class Product {
  // Find product by ID
  static async findById(id) {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  // Find all products with filters
  static async find(filters = {}) {
    const pool = getPool();
    let query = 'SELECT * FROM products WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.module) {
      query += ` AND module = $${paramCount}`;
      values.push(filters.module);
      paramCount++;
    }

    if (filters.status) {
      query += ` AND status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    if (filters.category) {
      query += ` AND category = $${paramCount}`;
      values.push(filters.category);
      paramCount++;
    }

    if (filters.createdBy) {
      query += ` AND created_by = $${paramCount}`;
      values.push(filters.createdBy);
      paramCount++;
    }

    // Default sort by created_at DESC
    query += ' ORDER BY created_at DESC';

    if (filters.limit) {
      query += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
      paramCount++;
    }

    if (filters.skip || filters.offset) {
      const offset = filters.skip || filters.offset;
      query += ` OFFSET $${paramCount}`;
      values.push(offset);
      paramCount++;
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  // Create new product
  static async create(productData) {
    const pool = getPool();
    const {
      name,
      description = '',
      category,
      price,
      profit = 0,
      stock = 0,
      module,
      status = 'active',
      sku = null,
      weight = null,
      dimensions = null,
      images = [],
      documents = [],
      specifications = [],
      createdBy
    } = productData;

    const result = await pool.query(
      `INSERT INTO products (name, description, category, price, profit, stock, module, status, sku, weight, dimensions, images, documents, specifications, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING *`,
      [
        name,
        description,
        category,
        price,
        profit,
        stock,
        module,
        status,
        sku,
        weight,
        dimensions ? JSON.stringify(dimensions) : null,
        JSON.stringify(images),
        JSON.stringify(documents),
        JSON.stringify(specifications),
        createdBy
      ]
    );

    return result.rows[0];
  }

  // Update product
  static async update(id, updateData) {
    const pool = getPool();
    const fields = [];
    const values = [];
    let paramCount = 1;

    // Map mongoose field names to PostgreSQL
    const fieldMap = {
      'createdBy': 'created_by',
      'updatedAt': 'updated_at'
    };

    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined) {
        const columnName = fieldMap[key] || key;
        
        // Handle JSON fields
        if (['images', 'documents', 'specifications', 'dimensions'].includes(columnName)) {
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
      return await this.findById(id);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE products SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  // Delete product
  static async delete(id) {
    const pool = getPool();
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    return { success: true };
  }

  // Count products
  static async count(filters = {}) {
    const pool = getPool();
    let query = 'SELECT COUNT(*) FROM products WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.module) {
      query += ` AND module = $${paramCount}`;
      values.push(filters.module);
      paramCount++;
    }

    if (filters.status) {
      query += ` AND status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count);
  }

  // Search products by name or description
  static async search(searchTerm, filters = {}) {
    const pool = getPool();
    let query = `SELECT * FROM products 
                 WHERE (LOWER(name) LIKE $1 OR LOWER(description) LIKE $1)`;
    const values = [`%${searchTerm.toLowerCase()}%`];
    let paramCount = 2;

    if (filters.module) {
      query += ` AND module = $${paramCount}`;
      values.push(filters.module);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  // Format product for frontend
  static formatProduct(row) {
    if (!row) return null;

    // Parse JSON fields
    let images = [];
    let documents = [];
    let specifications = [];
    let dimensions = null;

    try {
      images = typeof row.images === 'string' ? JSON.parse(row.images) : (row.images || []);
      documents = typeof row.documents === 'string' ? JSON.parse(row.documents) : (row.documents || []);
      specifications = typeof row.specifications === 'string' ? JSON.parse(row.specifications) : (row.specifications || []);
      dimensions = typeof row.dimensions === 'string' ? JSON.parse(row.dimensions) : (row.dimensions || null);
    } catch (e) {
      console.error('Error parsing JSON fields:', e);
    }

    return {
      id: row.id,
      _id: row.id, // For compatibility
      name: row.name,
      description: row.description || '',
      category: row.category,
      price: parseFloat(row.price),
      profit: parseFloat(row.profit || 0),
      stock: parseInt(row.stock || 0),
      module: row.module,
      status: row.status,
      sku: row.sku,
      weight: row.weight ? parseFloat(row.weight) : null,
      dimensions,
      images: images.map((img, idx) => ({
        id: img.id || idx,
        url: img.url || img,
        alt: img.alt || img.altText || '',
        isPrimary: img.isPrimary || false,
        type: img.type || 'jpg'
      })),
      documents: documents.map((doc, idx) => ({
        id: doc.id || idx,
        name: doc.name || '',
        url: doc.url || doc,
        type: doc.type || 'pdf'
      })),
      specifications: specifications.map((spec, idx) => ({
        id: spec.id || idx,
        name: spec.name || '',
        value: spec.value || ''
      })),
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

module.exports = Product;
