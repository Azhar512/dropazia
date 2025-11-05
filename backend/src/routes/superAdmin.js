const express = require('express');
const router = express.Router();
const { authenticateToken, requireSuperAdmin } = require('../middleware/auth');
const {
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getDashboardStats
} = require('../controllers/superAdminController');

// All routes require super admin authentication
router.use(authenticateToken);
router.use(requireSuperAdmin);

// Dashboard statistics
router.get('/dashboard/stats', getDashboardStats);

// Admin management
router.get('/admins', getAllAdmins);
router.post('/admins', createAdmin);
router.put('/admins/:id', updateAdmin);
router.delete('/admins/:id', deleteAdmin);

module.exports = router;

