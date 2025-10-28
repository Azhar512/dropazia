const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    required: true,
    trim: true
  },
  storeName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  module: {
    type: String,
    required: true,
    enum: ['daraz', 'shopify']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  reason: {
    type: String,
    trim: true
  },
  adminNotes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for faster queries
returnSchema.index({ user: 1, createdAt: -1 });
returnSchema.index({ status: 1 });
returnSchema.index({ module: 1 });

module.exports = mongoose.model('Return', returnSchema);

