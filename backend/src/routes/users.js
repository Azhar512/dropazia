const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUserStatus, deleteUser } = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// All user routes require admin authentication
router.use(authenticateToken);

// Middleware to check admin role
router.use((req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
});

// Get all users (with optional filters: ?status=pending&role=buyer)
router.get('/', getAllUsers);

// Get user by ID
router.get('/:id', getUserById);

// Update user status (approve/reject)
router.put('/:id/status', updateUserStatus);

// Delete user
router.delete('/:id', deleteUser);

module.exports = router;

