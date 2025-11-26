const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  generatePaymentSignature,
  handlePayFastNotify,
  verifyPayment,
  getPayFastStatus
} = require('../controllers/payfastController');

// Generate payment signature (requires authentication)
router.post('/generate-signature', authenticateToken, generatePaymentSignature);

// ITN (Instant Transaction Notification) endpoint - NO authentication required
// PayFast servers will call this endpoint
router.post('/notify', handlePayFastNotify);

// Verify payment status (requires authentication)
router.get('/verify/:paymentId', authenticateToken, verifyPayment);

// Get PayFast configuration status (requires authentication)
router.get('/status', authenticateToken, getPayFastStatus);

module.exports = router;

