const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/database');

const checkDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('');

    // Check users
    const userCount = await User.countDocuments();
    const adminUser = await User.findOne({ email: 'admin@shopdaraz.com' });
    const approvedUsers = await User.countDocuments({ status: 'approved' });
    const pendingUsers = await User.countDocuments({ status: 'pending' });

    console.log('👤 USERS:');
    console.log(`   Total Users: ${userCount}`);
    console.log(`   Approved: ${approvedUsers}`);
    console.log(`   Pending: ${pendingUsers}`);
    if (adminUser) {
      console.log(`   ✅ Admin user exists: admin@shopdaraz.com`);
    } else {
      console.log(`   ❌ Admin user does NOT exist`);
    }
    console.log('');

    // Check products
    const productCount = await Product.countDocuments();
    const darazProducts = await Product.countDocuments({ module: 'daraz' });
    const shopifyProducts = await Product.countDocuments({ module: 'shopify' });
    const activeProducts = await Product.countDocuments({ status: 'active' });

    console.log('📦 PRODUCTS:');
    console.log(`   Total Products: ${productCount}`);
    console.log(`   Daraz Products: ${darazProducts}`);
    console.log(`   Shopify Products: ${shopifyProducts}`);
    console.log(`   Active Products: ${activeProducts}`);
    console.log('');

    // Show sample products if any
    if (productCount > 0) {
      const sampleProducts = await Product.find().limit(5).select('name category price module status');
      console.log('📋 Sample Products (first 5):');
      sampleProducts.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} (${product.category}) - ${product.price} PKR [${product.module}]`);
      });
      console.log('');
    }

    // Summary
    console.log('📊 SUMMARY:');
    if (productCount === 0 && userCount === 0) {
      console.log('   ✅ Database is EMPTY - Safe to run seed script');
      console.log('   ✅ You can use the seed script to create admin + sample products');
    } else if (productCount > 0) {
      console.log(`   ⚠️  Database has ${productCount} products`);
      console.log('   ⚠️  Seed script will DELETE all products and users!');
    } else {
      console.log(`   ℹ️  Database has ${userCount} users but no products`);
    }

  } catch (error) {
    console.error('❌ Error checking database:', error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

// Run
checkDatabase();

