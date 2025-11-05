const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Ensure JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not configured in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    const formattedUser = User.formatUser(user);

    req.user = {
      id: formattedUser.id,
      name: formattedUser.name,
      email: formattedUser.email,
      role: formattedUser.role,
      status: formattedUser.status
    };

    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    console.error('❌ Auth error details:', {
      name: error.name,
      message: error.message,
      hasToken: !!authHeader
    });
    return res.status(403).json({
      success: false,
      message: error.name === 'JsonWebTokenError' ? 'Invalid or expired token' : 'Authentication failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Require admin role (admin or super_admin)
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

// Require super admin role (only super_admin)
const requireSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Super admin access required'
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireSuperAdmin
};