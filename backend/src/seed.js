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
    // ULTRA-SAFE: Check database state first (connectDB already called before seedData)
    const existingUsers = await User.countDocuments({});
    const existingProducts = await Product.countDocuments({});
    
    console.log('\n🔍 DATABASE STATE CHECK:');
    console.log(`   Users: ${existingUsers}`);
    console.log(`   Products: ${existingProducts}\n`);
    
    // CRITICAL SAFETY: Always require explicit confirmation if data exists
    if (existingProducts > 0 || existingUsers > 0) {
      console.error('❌❌❌ CRITICAL WARNING ❌❌❌');
      console.error('⚠️ DATABASE CONTAINS EXISTING DATA!');
      console.error(`⚠️ Found ${existingUsers} users and ${existingProducts} products`);
      console.error('⚠️ Running seed script will DELETE ALL existing data!');
      console.error('\n🔒 BLOCKED: This script is now DISABLED to prevent data loss.');
      console.error('💡 If you need to create admin user, use: npm run create-admin');
      console.error('💡 If you need to add products, use the admin dashboard.\n');
      process.exit(1);
    }
    
    // PRODUCTION SAFETY: Additional production check
    const isProduction = process.env.NODE_ENV === 'production';
    const forceSeed = process.env.FORCE_SEED === 'true';
    
    if (isProduction && !forceSeed) {
      console.error('❌ SEED SCRIPT BLOCKED: Cannot run seed script in production mode without FORCE_SEED=true');
      console.error('⚠️ This is a safety measure to prevent accidental data deletion.');
      process.exit(1);
    }
    
    if (isProduction && forceSeed) {
      console.warn('⚠️ WARNING: Running seed script in PRODUCTION with FORCE_SEED=true');
      console.warn('⚠️ This will DELETE ALL existing users and products!');
      console.warn('⚠️ Waiting 10 seconds... Press Ctrl+C to cancel.');
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
    
    // Only clear if database is already empty (double-check)
    const finalUserCount = await User.countDocuments({});
    const finalProductCount = await Product.countDocuments({});
    
    if (finalProductCount > 0 || finalUserCount > 0) {
      console.error('❌ ABORTED: Database still contains data. Not clearing.');
      process.exit(1);
    }
    
    console.log('✅ Database is empty, proceeding with seed...');

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
