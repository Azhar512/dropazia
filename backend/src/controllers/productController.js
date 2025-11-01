const Product = require('../models/Product');
const mongoose = require('mongoose');

const connectDB = require('../config/database');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    // Ensure database is connected (important for serverless)
    try {
      await connectDB();
    } catch (dbError) {
      console.error('❌ Failed to connect to database:', dbError.message);
      return res.status(503).json({
        success: false,
        message: 'Database connection not available',
        error: 'Please try again in a moment'
      });
    }

    const { module, status, category } = req.query;
    
    let filter = {};
    if (module) filter.module = module;
    if (status) filter.status = status;
    if (category) filter.category = category;

    // Use aggregation pipeline to allow disk use for large sorts
    // This prevents MongoDB 32MB in-memory sort limit error
    const products = await Product.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdByData',
          pipeline: [{ $project: { name: 1, email: 1 } }]
        }
      },
      {
        $addFields: {
          createdBy: {
            $cond: {
              if: { $gt: [{ $size: '$createdByData' }, 0] },
              then: { $arrayElemAt: ['$createdByData', 0] },
              else: null
            }
          }
        }
      },
      { $project: { createdByData: 0 } }
    ]).allowDiskUse(true); // CRITICAL: Allows sorting large datasets

    // Clean up products - set createdBy to null if populate failed
    const cleanedProducts = products.map(product => ({
      ...product,
      createdBy: product.createdBy || null
    }));

    res.json({
      success: true,
      data: cleanedProducts,
      count: cleanedProducts.length
    });
  } catch (error) {
    console.error('❌ Get products error:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    // Ensure database is connected (important for serverless)
    try {
      await connectDB();
    } catch (dbError) {
      console.error('❌ Failed to connect to database:', dbError.message);
      return res.status(503).json({
        success: false,
        message: 'Database connection not available'
      });
    }

    const { id } = req.params;
    
    const product = await Product.findById(id)
      .populate({
        path: 'createdBy',
        select: 'name email',
        strictPopulate: false
      })
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: {
        ...product,
        createdBy: product.createdBy || null
      }
    });
  } catch (error) {
    console.error('❌ Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    // Ensure database is connected (important for serverless)
    try {
      await connectDB();
    } catch (dbError) {
      console.error('❌ Failed to connect to database:', dbError.message);
      return res.status(503).json({
        success: false,
        message: 'Database connection not available'
      });
    }
    const {
      name,
      description,
      category,
      price,
      stock,
      module,
      status,
      sku,
      weight,
      dimensions,
      images,
      documents,
      specifications
    } = req.body;

    // Validate required fields
    if (!name || !category || !price || !module) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, category, price, module'
      });
    }

    // Validate user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to create products'
      });
    }

    // Convert user ID string to ObjectId
    const createdByUserId = new mongoose.Types.ObjectId(req.user.id);

    // Map images from frontend format to backend format
    const mappedImages = (images || []).map((img, index) => ({
      url: img.url,
      altText: img.alt || img.altText || '',
      isPrimary: img.isPrimary !== undefined ? img.isPrimary : index === 0,
      type: img.type || 'jpg',
      sortOrder: img.sortOrder || index
    }));

    // Map documents from frontend format to backend format
    const mappedDocuments = (documents || []).map((doc) => ({
      name: doc.name,
      url: doc.url,
      type: doc.type,
      sizeBytes: doc.size || doc.sizeBytes || 0
    }));

    // Map specifications
    const mappedSpecifications = (specifications || []).map((spec, index) => ({
      name: spec.name,
      value: spec.value,
      sortOrder: spec.sortOrder || index
    }));

    // Create product
    const product = new Product({
      name,
      description: description || '',
      category,
      price,
      stock: stock || 0,
      module,
      status: status || 'active',
      sku,
      weight,
      dimensions,
      images: mappedImages,
      documents: mappedDocuments,
      specifications: mappedSpecifications,
      createdBy: createdByUserId // Use authenticated user's ID
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('❌ Create product error:', error);
    console.error('❌ Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      user: req.user?.id,
      productData: {
        name,
        category,
        price,
        module
      }
    });
    
    // Return more detailed error for debugging
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message,
      ...(process.env.NODE_ENV === 'development' && { details: error.stack })
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to update products'
      });
    }

    // Remove fields that shouldn't be updated
    const { createdBy, _id, __v, ...allowedUpdates } = updates;

    const product = await Product.findByIdAndUpdate(
      id,
      { ...allowedUpdates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to delete products'
      });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

// Get products by module
const getProductsByModule = async (req, res) => {
  try {
    // Ensure database is connected (important for serverless)
    try {
      await connectDB();
    } catch (dbError) {
      console.error('❌ Failed to connect to database:', dbError.message);
      return res.status(503).json({
        success: false,
        message: 'Database connection not available'
      });
    }

    const { module } = req.params;
    const { status = 'active' } = req.query;

    // Use aggregation pipeline to allow disk use for large sorts
    const products = await Product.aggregate([
      { $match: { module, status } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdByData',
          pipeline: [{ $project: { name: 1, email: 1 } }]
        }
      },
      {
        $addFields: {
          createdBy: {
            $cond: {
              if: { $gt: [{ $size: '$createdByData' }, 0] },
              then: { $arrayElemAt: ['$createdByData', 0] },
              else: null
            }
          }
        }
      },
      { $project: { createdByData: 0 } }
    ]).allowDiskUse(true); // CRITICAL: Allows sorting large datasets

    const cleanedProducts = products.map(product => ({
      ...product,
      createdBy: product.createdBy || null
    }));

    res.json({
      success: true,
      data: cleanedProducts,
      count: cleanedProducts.length
    });
  } catch (error) {
    console.error('❌ Get products by module error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByModule
};
