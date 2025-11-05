// Wallet Routes
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getBalance,
  getTransactions,
  addFunds,
  useWallet
} = require('../controllers/walletController');

// Get wallet balance
router.get('/balance', authenticateToken, getBalance);

// Get transaction history
router.get('/transactions', authenticateToken, getTransactions);

// Add funds (can be called by user or admin)
router.post('/add-funds', authenticateToken, addFunds);

// Use wallet for payment
router.post('/use', authenticateToken, useWallet);

module.exports = router;

