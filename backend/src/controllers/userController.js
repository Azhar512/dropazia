const User = require('../models/User');
const mongoose = require('mongoose');
const connectDB = require('../config/database');

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    console.log('🔍 GET /api/users called');
    console.log('🔍 Query params:', req.query);
    console.log('🔍 User making request:', req.user?.email, req.user?.role);
    
    // Ensure database is connected
    await connectDB();

    const { status, role, module } = req.query;
    
    let filter = {};
    if (status) {
      filter.status = status;
      console.log(`📌 Filtering by status: ${status}`);
    }
    if (role) {
      filter.role = role;
      console.log(`📌 Filtering by role: ${role}`);
    }
    if (module) {
      filter.module = module;
      console.log(`📌 Filtering by module: ${module}`);
    }

    console.log('🔍 Final filter:', filter);
    const users = await User.find(filter)
      .select('-passwordHash -__v')
      .sort({ createdAt: -1 })
      .lean();

    console.log(`📊 Found ${users.length} users matching filter`);
    if (users.length > 0) {
      console.log('📋 Sample user:', {
        name: users[0].name,
        email: users[0].email,
        status: users[0].status,
        role: users[0].role
      });
    }

    // Map MongoDB _id to id for frontend compatibility
    const mappedUsers = users.map(user => ({
      id: user._id.toString(),
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      module: user.module || null,
      status: user.status || 'pending',
      isActive: user.isActive !== undefined ? user.isActive : true,
      date: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      createdAt: user.createdAt
    }));

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
    await connectDB();

    const { id } = req.params;

    const user = await User.findById(id)
      .select('-passwordHash -__v')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: user._id.toString(),
        ...user,
        date: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      }
    });
  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
};

// Update user status (Approve/Reject)
const updateUserStatus = async (req, res) => {
  try {
    await connectDB();

    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: approved, rejected, or pending'
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .select('-passwordHash -__v')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `User ${status} successfully`,
      data: {
        id: user._id.toString(),
        ...user,
        date: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      }
    });
  } catch (error) {
    console.error('❌ Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: error.message
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    await connectDB();

    const { id } = req.params;

    const user = await User.findByIdAndDelete(id)
      .select('-passwordHash -__v')
      .lean();

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
    console.error('❌ Delete user error:', error);
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

