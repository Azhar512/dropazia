const ReturnService = require('../models/Return');

// Create a new return request
const createReturn = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderNumber, storeName, email, module, reason } = req.body;

    // Validate required fields
    if (!orderNumber || !storeName || !email) {
      return res.status(400).json({
        success: false,
        message: 'Order number, store name, and email are required'
      });
    }

    // Create return request
    const returnRequest = await ReturnService.create({
      userId,
      orderId: null, // Can be populated if order ID is provided
      orderNumber,
      storeName,
      email,
      module: module || 'daraz',
      reason: reason || '',
      status: 'pending'
    });

    const formatted = ReturnService.formatReturn(returnRequest);

    res.status(201).json({
      success: true,
      message: 'Return request submitted successfully',
      data: formatted
    });
  } catch (error) {
    console.error('Create return error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit return request',
      error: error.message
    });
  }
};

// Get all returns for the logged-in user
const getMyReturns = async (req, res) => {
  try {
    const userId = req.user.id;
    const module = req.query.module;

    const returns = await ReturnService.getByUserId(userId, module);

    res.json({
      success: true,
      data: returns
    });
  } catch (error) {
    console.error('Get my returns error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch returns',
      error: error.message
    });
  }
};

// Get all returns (Admin only)
const getAllReturns = async (req, res) => {
  try {
    const { status, module, limit = 100, offset = 0 } = req.query;

    const returns = await ReturnService.getAll({
      status,
      module,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: returns
    });
  } catch (error) {
    console.error('Get all returns error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch returns',
      error: error.message
    });
  }
};

// Get returns by user ID (Admin only)
const getReturnsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const returns = await ReturnService.getByUserId(userId);

    res.json({
      success: true,
      data: returns
    });
  } catch (error) {
    console.error('Get returns by user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch returns',
      error: error.message
    });
  }
};

// Update return status (Admin only)
const updateReturnStatus = async (req, res) => {
  try {
    const { returnId } = req.params;
    const { status, adminNotes } = req.body;

    if (!['pending', 'approved', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const returnRequest = await ReturnService.updateStatus(returnId, status, adminNotes);

    if (!returnRequest) {
      return res.status(404).json({
        success: false,
        message: 'Return request not found'
      });
    }

    res.json({
      success: true,
      message: 'Return status updated successfully',
      data: returnRequest
    });
  } catch (error) {
    console.error('Update return status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update return status',
      error: error.message
    });
  }
};

module.exports = {
  createReturn,
  getMyReturns,
  getAllReturns,
  getReturnsByUser,
  updateReturnStatus
};
