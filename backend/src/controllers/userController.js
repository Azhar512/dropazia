const User = require('../models/User');
const { connectDB } = require('../config/database-supabase');

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    console.log('🔍 GET /api/users called');
    console.log('🔍 Query params:', req.query);
    console.log('🔍 User making request:', req.user?.email, req.user?.role);
    
    // Ensure database is connected
    await connectDB();

    const { status, role, module } = req.query;
    
    const filters = {};
    if (status) {
      filters.status = status;
      console.log(`📌 Filtering by status: ${status}`);
    }
    if (role) {
      filters.role = role;
      console.log(`📌 Filtering by role: ${role}`);
    }
    if (module) {
      filters.module = module;
      console.log(`📌 Filtering by module: ${module}`);
    }

    console.log('🔍 Final filter:', filters);
    const rows = await User.find(filters);

    console.log(`📊 Found ${rows.length} users matching filter`);
    if (rows.length > 0) {
      const firstUser = User.formatUser(rows[0]);
      console.log('📋 Sample user:', {
        name: firstUser.name,
        email: firstUser.email,
        status: firstUser.status,
        role: firstUser.role
      });
    }

    // Format users for frontend
    const mappedUsers = rows.map(row => {
      const user = User.formatUser(row);
      return {
        id: user.id,
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        module: user.module || null,
        status: user.status || 'approved',
        isActive: user.isActive !== undefined ? user.isActive : true,
        date: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        createdAt: user.createdAt
      };
    });

    console.log(`✅ Returning ${mappedUsers.length} mapped users`);

    res.json({
      success: true,
      data: mappedUsers,
      count: mappedUsers.length
    });
  } catch (error) {
    console.error('❌ Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const row = await User.findById(userId);
    if (!row) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = User.formatUser(row);

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        module: user.module || null,
        status: user.status,
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
};

// Update user status (Admin only)
const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const user = await User.update(userId, { status });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const formattedUser = User.formatUser(user);

    res.json({
      success: true,
      message: 'User status updated successfully',
      data: {
        id: formattedUser.id,
        name: formattedUser.name,
        email: formattedUser.email,
        status: formattedUser.status
      }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: error.message
    });
  }
};

// Delete user (Admin only - soft delete)
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.delete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser
};
