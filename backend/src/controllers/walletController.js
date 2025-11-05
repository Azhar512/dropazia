// Wallet Controller
const Wallet = require('../models/Wallet');
const { authenticateToken } = require('../middleware/auth');

// Get wallet balance
const getBalance = async (req, res) => {
  try {
    const userId = req.user.userId;
    const balance = await Wallet.getBalance(userId);
    
    res.status(200).json({
      success: true,
      data: {
        balance: parseFloat(balance)
      }
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get wallet balance',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get transaction history
const getTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 50;
    
    const transactions = await Wallet.getTransactions(userId, limit);
    
    res.status(200).json({
      success: true,
      data: {
        transactions
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transactions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Add funds (admin only or payment gateway callback)
const addFunds = async (req, res) => {
  try {
    const userId = req.body.userId || req.user.userId;
    const amount = parseFloat(req.body.amount);
    const description = req.body.description || 'Funds added';

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    const newBalance = await Wallet.updateBalance(userId, amount, 'add');
    await Wallet.addTransaction(userId, amount, 'credit', description);

    res.status(200).json({
      success: true,
      message: 'Funds added successfully',
      data: {
        newBalance: parseFloat(newBalance)
      }
    });
  } catch (error) {
    console.error('Add funds error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add funds',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Use wallet for payment
const useWallet = async (req, res) => {
  try {
    const userId = req.user.userId;
    const amount = parseFloat(req.body.amount);
    const orderId = req.body.orderId;
    const description = req.body.description || 'Payment from wallet';

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    const currentBalance = await Wallet.getBalance(userId);
    if (currentBalance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient wallet balance'
      });
    }

    const newBalance = await Wallet.updateBalance(userId, amount, 'subtract');
    await Wallet.addTransaction(userId, amount, 'debit', description, orderId);

    res.status(200).json({
      success: true,
      message: 'Payment successful',
      data: {
        newBalance: parseFloat(newBalance),
        amountUsed: amount
      }
    });
  } catch (error) {
    console.error('Use wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process wallet payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getBalance,
  getTransactions,
  addFunds,
  useWallet
};

