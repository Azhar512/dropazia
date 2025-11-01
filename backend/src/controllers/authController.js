const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Helper function for email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function for password validation
const isStrongPassword = (password) => {
  // Minimum 8 characters, at least one letter and one number
  if (password.length < 8) return false;
  if (!/[a-zA-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
};

// Register new user
const register = async (req, res) => {
  try {
    let { name, email, password, phone, role = 'buyer', module } = req.body;
    
    // Map 'reseller' to 'seller' for backend compatibility
    if (role === 'reseller') {
      role = 'seller';
    }

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate password strength
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters with at least one letter and one number'
      });
    }

    // Ensure database connection
    const connectDB = require('../config/database');
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    console.log('📝 Creating new user:', {
      name,
      email: email.toLowerCase(),
      role,
      module,
      phone: phone || 'not provided'
    });

    // Create user - ensure all required fields are valid
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      status: 'pending',
      isActive: true
    };
    
    // Add optional fields only if provided
    if (phone && phone.trim()) {
      userData.phone = phone.trim();
    }
    if (role && ['buyer', 'seller', 'admin'].includes(role)) {
      userData.role = role;
    }
    if (module && ['daraz', 'shopify'].includes(module)) {
      userData.module = module;
    }

    console.log('📝 User data to save:', { ...userData, passwordHash: '***' });

    const user = new User(userData);
    await user.save();
    console.log('✅ User created successfully:', user._id, user.email);

    // Ensure JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status
        },
        token
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    console.error('❌ Registration error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      body: req.body
    });
    
    // Provide more specific error messages
    let errorMessage = 'Failed to register user';
    if (error.code === 11000) {
      errorMessage = 'Email already exists';
    } else if (error.name === 'ValidationError') {
      errorMessage = error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Ensure JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

          // Check if user is approved before allowing login
          if (user.status !== 'approved' && user.role !== 'admin') {
            return res.status(403).json({
              success: false,
              message: user.status === 'pending' 
                ? 'Your account is pending admin approval. Please wait for approval before logging in.'
                : user.status === 'rejected'
                ? 'Your account has been rejected. Please contact support.'
                : 'Access denied. Your account needs admin approval.'
            });
          }

          // Generate JWT token
          const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
          );

          res.json({
            success: true,
            message: 'Login successful',
            data: {
              user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
              },
              token
            }
          });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to login',
      error: error.message
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    
    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        module: user.module,
        phone: user.phone,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, module } = req.body;
    const userId = req.user.id;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (module) updateData.module = module;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: '-passwordHash' }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        module: user.module,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};
