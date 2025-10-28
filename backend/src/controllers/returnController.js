const Return = require('../models/Return');
const User = require('../models/User');

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
    const returnRequest = new Return({
      user: userId,
      orderNumber,
      storeName,
      email,
      module: module || 'daraz',
      reason: reason || '',
      status: 'pending'
    });

    await returnRequest.save();

    res.status(201).json({
      success: true,
      message: 'Return request submitted successfully',
      data: returnRequest
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

    const query = { user: userId };
    if (module) {
      query.module = module;
    }

    const returns = await Return.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'name email');

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
    const returns = await Return.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone module role')
      .select('-__v');

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

    const returns = await Return.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone module role')
      .select('-__v');

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

    const updateData = { status };
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }

    const returnRequest = await Return.findByIdAndUpdate(
      returnId,
      updateData,
      { new: true }
    ).populate('user', 'name email');

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

