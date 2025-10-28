const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { getAnalytics } = require('../controllers/analyticsController');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get analytics for a module
router.get('/:module', getAnalytics);

module.exports = router;

