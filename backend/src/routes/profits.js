const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { getProfits } = require('../controllers/profitsController');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get profits for a module
router.get('/:module', getProfits);

module.exports = router;

