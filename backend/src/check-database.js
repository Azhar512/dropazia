// Check Database - Supabase PostgreSQL
const path = require('path');
const fs = require('fs');
// Explicitly load .env from backend directory (go up 2 levels from src/)
const envPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath, override: true });
} else {
  require('dotenv').config({ override: true });
}

const { connectDB } = require('./config/database-supabase');
const User = require('./models/User');
const Product = require('./models/Product');

const checkDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to Supabase PostgreSQL');
    console.log('');

    // Check users
    const users = await User.find({});
    const userCount = users.length;
    const adminUser = await User.findByEmail('admin@shopdaraz.com');
    const approvedUsers = users.filter(u => u.status === 'approved').length;
    const pendingUsers = users.filter(u => u.status === 'pending').length;

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
    const products = await Product.find({});
    const productCount = products.length;
    const darazProducts = products.filter(p => p.module === 'daraz').length;
    const shopifyProducts = products.filter(p => p.module === 'shopify').length;
    const activeProducts = products.filter(p => p.status === 'active').length;

    console.log('📦 PRODUCTS:');
    console.log(`   Total Products: ${productCount}`);
    console.log(`   Daraz Products: ${darazProducts}`);
    console.log(`   Shopify Products: ${shopifyProducts}`);
    console.log(`   Active Products: ${activeProducts}`);
    console.log('');

    // Show sample products if any
    if (productCount > 0) {
      const sampleProducts = products.slice(0, 5);
      console.log('📋 Sample Products (first 5):');
      sampleProducts.forEach((product, index) => {
        const formattedProduct = Product.formatProduct(product);
        console.log(`   ${index + 1}. ${formattedProduct.name} (${formattedProduct.category}) - ${formattedProduct.price} PKR [${formattedProduct.module}]`);
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
    const { closeDB } = require('./config/database-supabase');
    await closeDB();
    process.exit(0);
  }
};

// Run
checkDatabase();
