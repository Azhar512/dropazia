const express = require('express');
const router = express.Router();
const {
  createReturn,
  getMyReturns,
  getAllReturns,
  getReturnsByUser,
  updateReturnStatus
} = require('../controllers/returnController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// User routes
router.post('/', authenticateToken, createReturn);
router.get('/my', authenticateToken, getMyReturns);

// Admin routes
router.get('/all', authenticateToken, requireAdmin, getAllReturns);
router.get('/user/:userId', authenticateToken, requireAdmin, getReturnsByUser);
router.put('/:returnId/status', authenticateToken, requireAdmin, updateReturnStatus);

module.exports = router;

