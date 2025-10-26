const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shopdaraz');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@shopdaraz.com',
      phone: '+92-300-1234567',
      passwordHash: hashedPassword,
      role: 'admin',
      status: 'approved'
    });
    console.log('👤 Created admin user');

    // Create demo user
    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@shopdaraz.com',
      phone: '+92-300-1234568',
      passwordHash: hashedPassword,
      role: 'buyer',
      status: 'approved'
    });
    console.log('👤 Created demo user');

    // Create sample products
    const products = [
      {
        name: 'Summer Dress Collection',
        description: 'Beautiful summer dress perfect for any occasion. Made with high-quality fabric and comfortable fit.',
        category: 'women clothing',
        price: 2500,
        stock: 45,
        module: 'daraz',
        status: 'active',
        createdBy: adminUser._id,
        images: [{
          url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
          altText: 'Summer Dress',
          isPrimary: true,
          type: 'jpg'
        }],
        documents: [{
          name: 'Summer Dress Description.pdf',
          url: '#',
          type: 'pdf',
          sizeBytes: 1024000
        }]
      },
      {
        name: 'Men\'s Watch',
        description: 'Elegant men\'s wristwatch with leather strap. Water resistant and durable.',
        category: 'men\'s watches',
        price: 5000,
        stock: 20,
        module: 'daraz',
        status: 'active',
        createdBy: adminUser._id,
        images: [{
          url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
          altText: 'Men\'s Watch',
          isPrimary: true,
          type: 'jpg'
        }],
        documents: [{
          name: 'Watch Specifications.pdf',
          url: '#',
          type: 'pdf',
          sizeBytes: 512000
        }]
      },
      {
        name: 'Premium Home Decor Set',
        description: 'Modern home decoration pieces that will transform your living space. High-quality materials and elegant design.',
        category: 'home decoration',
        price: 3500,
        stock: 15,
        module: 'shopify',
        status: 'active',
        createdBy: adminUser._id,
        images: [{
          url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
          altText: 'Home Decor',
          isPrimary: true,
          type: 'jpg'
        }],
        documents: [{
          name: 'Home Decor Guide.pdf',
          url: '#',
          type: 'pdf',
          sizeBytes: 2048000
        }]
      },
      {
        name: 'Kids Running Shoes',
        description: 'Comfortable and durable running shoes for kids. Perfect for sports and daily activities.',
        category: 'kids shoes',
        price: 1200,
        stock: 30,
        module: 'shopify',
        status: 'active',
        createdBy: adminUser._id,
        images: [{
          url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
          altText: 'Kids Shoes',
          isPrimary: true,
          type: 'jpg'
        }],
        documents: [{
          name: 'Shoe Size Guide.pdf',
          url: '#',
          type: 'pdf',
          sizeBytes: 768000
        }]
      }
    ];

    await Product.insertMany(products);
    console.log('📦 Created sample products');

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Login credentials:');
    console.log('Admin: admin@shopdaraz.com / admin123');
    console.log('Demo: demo@shopdaraz.com / admin123');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run seeding
connectDB().then(() => {
  seedData();
});
