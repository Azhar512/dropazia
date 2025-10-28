const mongoose = require('mongoose');

const productImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  altText: {
    type: String,
    default: ''
  },
  isPrimary: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['png', 'jpg', 'jpeg', 'webp', 'svg'],
    default: 'jpg'
  },
  sortOrder: {
    type: Number,
    default: 0
  }
});

const productDocumentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['pdf', 'doc', 'docx'],
    required: true
  },
  sizeBytes: {
    type: Number,
    default: 0
  }
});

const productSpecificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  profit: {
    type: Number,
    min: 0,
    default: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  module: {
    type: String,
    enum: ['daraz', 'shopify'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'active'
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  weight: {
    type: Number,
    min: 0
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  images: [productImageSchema],
  documents: [productDocumentSchema],
  specifications: [productSpecificationSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
productSchema.index({ module: 1, status: 1 });
productSchema.index({ category: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
