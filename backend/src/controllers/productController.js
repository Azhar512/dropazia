const Product = require('../models/Product');
const { connectDB } = require('../config/database-supabase');
const User = require('../models/User');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    // Ensure database is connected
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
    
    const filters = {};
    if (module) filters.module = module;
    if (status) filters.status = status;
    if (category) filters.category = category;

    const products = await Product.find(filters);
    
    // Format products and populate createdBy
    const formattedProducts = await Promise.all(products.map(async (row) => {
      const product = Product.formatProduct(row);
      
      // Populate createdBy if needed
      if (product.createdBy) {
        const creator = await User.findById(product.createdBy);
        if (creator) {
          product.createdBy = {
            id: creator.id,
            name: creator.name,
            email: creator.email
          };
        }
      }
      
      return product;
    }));

    res.json({
      success: true,
      data: formattedProducts,
      count: formattedProducts.length
    });
  } catch (error) {
    console.error('❌ Get products error:', error);
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
    // Ensure database is connected
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
    
    const row = await Product.findById(id);

    if (!row) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const product = Product.formatProduct(row);
    
    // Populate createdBy if needed
    if (product.createdBy) {
      const creator = await User.findById(product.createdBy);
      if (creator) {
        product.createdBy = {
          id: creator.id,
          name: creator.name,
          email: creator.email
        };
      }
    }

    res.json({
      success: true,
      data: product
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
    // Ensure database is connected
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

    // Map images from frontend format to backend format
    const mappedImages = (images || []).map((img, index) => ({
      id: img.id || index,
      url: img.url,
      alt: img.alt || img.altText || '',
      altText: img.alt || img.altText || '',
      isPrimary: img.isPrimary !== undefined ? img.isPrimary : index === 0,
      type: img.type || 'jpg',
      sortOrder: img.sortOrder || index
    }));

    // Map documents from frontend format to backend format
    const mappedDocuments = (documents || []).map((doc, index) => ({
      id: doc.id || index,
      name: doc.name,
      url: doc.url,
      type: doc.type || 'pdf',
      sizeBytes: doc.size || doc.sizeBytes || 0
    }));

    // Map specifications
    const mappedSpecifications = (specifications || []).map((spec, index) => ({
      id: spec.id || index,
      name: spec.name,
      value: spec.value,
      sortOrder: spec.sortOrder || index
    }));

    // Create product
    const product = await Product.create({
      name,
      description: description || '',
      category,
      price: parseFloat(price),
      profit: parseFloat(req.body.profit || 0),
      stock: parseInt(stock || 0),
      module,
      status: status || 'active',
      sku,
      weight: weight ? parseFloat(weight) : null,
      dimensions,
      images: mappedImages,
      documents: mappedDocuments,
      specifications: mappedSpecifications,
      createdBy: req.user.id
    });

    const formattedProduct = Product.formatProduct(product);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: formattedProduct
    });
  } catch (error) {
    console.error('❌ Create product error:', error);
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
    const { createdBy, id: _id, ...allowedUpdates } = updates;

    // Handle images, documents, specifications mapping if provided
    if (updates.images) {
      allowedUpdates.images = updates.images.map((img, index) => ({
        id: img.id || index,
        url: img.url,
        alt: img.alt || img.altText || '',
        altText: img.alt || img.altText || '',
        isPrimary: img.isPrimary !== undefined ? img.isPrimary : index === 0,
        type: img.type || 'jpg',
        sortOrder: img.sortOrder || index
      }));
    }

    if (updates.documents) {
      allowedUpdates.documents = updates.documents.map((doc, index) => ({
        id: doc.id || index,
        name: doc.name,
        url: doc.url,
        type: doc.type || 'pdf',
        sizeBytes: doc.size || doc.sizeBytes || 0
      }));
    }

    if (updates.specifications) {
      allowedUpdates.specifications = updates.specifications.map((spec, index) => ({
        id: spec.id || index,
        name: spec.name,
        value: spec.value,
        sortOrder: spec.sortOrder || index
      }));
    }

    // Convert price and stock to numbers if provided
    if (allowedUpdates.price !== undefined) {
      allowedUpdates.price = parseFloat(allowedUpdates.price);
    }
    if (allowedUpdates.stock !== undefined) {
      allowedUpdates.stock = parseInt(allowedUpdates.stock);
    }

    const row = await Product.update(id, allowedUpdates);

    if (!row) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const product = Product.formatProduct(row);
    
    // Populate createdBy
    if (product.createdBy) {
      const creator = await User.findById(product.createdBy);
      if (creator) {
        product.createdBy = {
          id: creator.id,
          name: creator.name,
          email: creator.email
        };
      }
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

    await Product.delete(id);

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
    // Ensure database is connected
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

    const products = await Product.find({ module, status });
    
    // Format products
    const formattedProducts = await Promise.all(products.map(async (row) => {
      const product = Product.formatProduct(row);
      
      // Populate createdBy if needed
      if (product.createdBy) {
        const creator = await User.findById(product.createdBy);
        if (creator) {
          product.createdBy = {
            id: creator.id,
            name: creator.name,
            email: creator.email
          };
        }
      }
      
      return product;
    }));

    res.json({
      success: true,
      data: formattedProducts,
      count: formattedProducts.length
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
