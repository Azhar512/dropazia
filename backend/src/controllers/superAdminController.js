const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { connectDB } = require('../config/database-supabase');

// Get all admins (super admin only)
const getAllAdmins = async (req, res) => {
  try {
    await connectDB();
    
    const admins = await User.find({ role: 'admin' });
    const superAdmin = await User.find({ role: 'super_admin' });
    
    const formattedAdmins = admins.map(admin => User.formatUser(admin));
    const formattedSuperAdmin = superAdmin.length > 0 ? User.formatUser(superAdmin[0]) : null;
    
    res.status(200).json({
      success: true,
      data: {
        admins: formattedAdmins,
        superAdmin: formattedSuperAdmin
      }
    });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admins',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create new admin (super admin only)
const createAdmin = async (req, res) => {
  try {
    await connectDB();
    
    const { name, email, password, phone } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create admin user
    const newAdmin = await User.create({
      name,
      email,
      passwordHash,
      phone: phone || null,
      role: 'admin',
      status: 'approved',
      isActive: true
    });
    
    const formattedAdmin = User.formatUser(newAdmin);
    
    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: formattedAdmin
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create admin',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update admin (super admin only)
const updateAdmin = async (req, res) => {
  try {
    await connectDB();
    
    const { id } = req.params;
    const { name, email, phone, status, isActive, password } = req.body;
    
    // Check if admin exists
    const admin = await User.findById(id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }
    
    // Don't allow changing super admin
    if (admin.role === 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot modify super admin'
      });
    }
    
    // Don't allow changing role to super_admin
    if (req.body.role === 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot change role to super_admin'
      });
    }
    
    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (status) updateData.status = status;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    // Update password if provided
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters'
        });
      }
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }
    
    // Update admin
    const updatedAdmin = await User.update(id, updateData);
    const formattedAdmin = User.formatUser(updatedAdmin);
    
    res.status(200).json({
      success: true,
      message: 'Admin updated successfully',
      data: formattedAdmin
    });
  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update admin',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete admin (super admin only)
const deleteAdmin = async (req, res) => {
  try {
    await connectDB();
    
    const { id } = req.params;
    
    // Check if admin exists
    const admin = await User.findById(id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }
    
    // Don't allow deleting super admin
    if (admin.role === 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete super admin'
      });
    }
    
    // Don't allow deleting if not an admin
    if (admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Can only delete admin users'
      });
    }
    
    // Delete admin (set is_active to false or actually delete)
    await User.update(id, { isActive: false });
    
    res.status(200).json({
      success: true,
      message: 'Admin deactivated successfully'
    });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete admin',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get dashboard statistics (super admin only)
const getDashboardStats = async (req, res) => {
  try {
    await connectDB();
    const { getPool } = require('../config/database-supabase');
    const pool = getPool();
    
    // Get total users
    const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = parseInt(usersResult.rows[0].count);
    
    // Get total admins
    const adminsResult = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");
    const totalAdmins = parseInt(adminsResult.rows[0].count);
    
    // Get total orders
    const ordersResult = await pool.query('SELECT COUNT(*) as count FROM orders');
    const totalOrders = parseInt(ordersResult.rows[0].count);
    
    // Get total products
    const productsResult = await pool.query('SELECT COUNT(*) as count FROM products');
    const totalProducts = parseInt(productsResult.rows[0].count);
    
    // Get recent orders
    const recentOrdersResult = await pool.query(`
      SELECT * FROM orders 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    
    // Get pending users
    const pendingUsersResult = await pool.query(`
      SELECT COUNT(*) as count FROM users WHERE status = 'pending'
    `);
    const pendingUsers = parseInt(pendingUsersResult.rows[0].count);
    
    // Get orders by status
    const ordersByStatusResult = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM orders 
      GROUP BY status
    `);
    
    // Get orders by module
    const ordersByModuleResult = await pool.query(`
      SELECT module, COUNT(*) as count 
      FROM orders 
      GROUP BY module
    `);
    
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalAdmins,
        totalOrders,
        totalProducts,
        pendingUsers,
        recentOrders: recentOrdersResult.rows,
        ordersByStatus: ordersByStatusResult.rows.reduce((acc, row) => {
          acc[row.status] = parseInt(row.count);
          return acc;
        }, {}),
        ordersByModule: ordersByModuleResult.rows.reduce((acc, row) => {
          acc[row.module] = parseInt(row.count);
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user's purchase history (super admin only)
const getUserPurchaseHistory = async (req, res) => {
  try {
    await connectDB();
    const { getPool } = require('../config/database-supabase');
    const pool = getPool();
    
    const { userId } = req.params;
    
    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get user's orders with full details
    const ordersResult = await pool.query(`
      SELECT * FROM orders 
      WHERE customer_id = $1 
      ORDER BY created_at DESC
    `, [userId]);
    
    // Get user's total spent
    const totalSpentResult = await pool.query(`
      SELECT COALESCE(SUM(total_amount), 0) as total 
      FROM orders 
      WHERE customer_id = $1 AND payment_status = 'paid'
    `, [userId]);
    
    // Get user's order count by status
    const ordersByStatusResult = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM orders 
      WHERE customer_id = $1 
      GROUP BY status
    `, [userId]);
    
    // Get user's wishlist items
    const wishlistResult = await pool.query(`
      SELECT w.*, p.name as product_name, p.price, p.images 
      FROM wishlists w 
      LEFT JOIN products p ON w.product_id = p.id 
      WHERE w.user_id = $1 
      ORDER BY w.added_at DESC
    `, [userId]);
    
    // Get user's return requests
    const returnsResult = await pool.query(`
      SELECT * FROM returns 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `, [userId]);
    
    const formattedUser = User.formatUser(user);
    
    res.status(200).json({
      success: true,
      data: {
        user: formattedUser,
        orders: ordersResult.rows,
        totalOrders: ordersResult.rows.length,
        totalSpent: parseFloat(totalSpentResult.rows[0].total || 0),
        ordersByStatus: ordersByStatusResult.rows.reduce((acc, row) => {
          acc[row.status] = parseInt(row.count);
          return acc;
        }, {}),
        wishlist: wishlistResult.rows,
        returns: returnsResult.rows
      }
    });
  } catch (error) {
    console.error('Get user purchase history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user purchase history',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all users with their order counts (super admin only)
const getAllUsersWithStats = async (req, res) => {
  try {
    await connectDB();
    const { getPool } = require('../config/database-supabase');
    const pool = getPool();
    
    // Get all users with their order counts
    const usersResult = await pool.query(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.phone, 
        u.role, 
        u.module,
        u.status, 
        u.is_active,
        u.created_at,
        u.last_login,
        COUNT(DISTINCT o.id) as total_orders,
        COALESCE(SUM(CASE WHEN o.payment_status = 'paid' THEN o.total_amount ELSE 0 END), 0) as total_spent
      FROM users u
      LEFT JOIN orders o ON u.id = o.customer_id
      WHERE u.role IN ('buyer', 'seller')
      GROUP BY u.id
      ORDER BY total_spent DESC, u.created_at DESC
    `);
    
    res.status(200).json({
      success: true,
      data: usersResult.rows.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        module: user.module,
        status: user.status,
        isActive: user.is_active,
        createdAt: user.created_at,
        lastLogin: user.last_login,
        totalOrders: parseInt(user.total_orders || 0),
        totalSpent: parseFloat(user.total_spent || 0)
      }))
    });
  } catch (error) {
    console.error('Get all users with stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users with statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getDashboardStats,
  getUserPurchaseHistory,
  getAllUsersWithStats
};

