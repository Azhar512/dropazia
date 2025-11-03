const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopdaraz';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const checkDatabase = async () => {
  try {
    await connectDB();
    
    console.log('\n🔍 URGENT DATABASE CHECK\n');
    console.log('='.repeat(50));
    
    // Check products
    const productCount = await Product.countDocuments({});
    const activeProducts = await Product.countDocuments({ status: 'active' });
    const allProducts = await Product.find({}).select('name category price module status createdAt').lean();
    
    console.log(`\n📦 PRODUCTS:`);
    console.log(`   Total Products: ${productCount}`);
    console.log(`   Active Products: ${activeProducts}`);
    
    if (productCount > 0) {
      console.log(`\n📋 ALL PRODUCTS IN DATABASE:`);
      allProducts.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name}`);
        console.log(`      Category: ${product.category || 'N/A'}`);
        console.log(`      Price: Rs ${product.price || 0}`);
        console.log(`      Module: ${product.module || 'N/A'}`);
        console.log(`      Status: ${product.status || 'N/A'}`);
        console.log(`      Created: ${product.createdAt ? new Date(product.createdAt).toLocaleString() : 'N/A'}`);
        console.log('');
      });
    } else {
      console.log('   ❌ NO PRODUCTS FOUND - Database is empty');
    }
    
    // Check users
    const userCount = await User.countDocuments({});
    console.log(`\n👤 USERS: ${userCount}`);
    
    // Check orders
    const orderCount = await Order.countDocuments({});
    console.log(`📋 ORDERS: ${orderCount}`);
    
    console.log('\n' + '='.repeat(50));
    
    if (productCount === 0) {
      console.log('\n❌ CONFIRMED: No products found in database.');
      console.log('⚠️ Products have been deleted and cannot be recovered (backups are inactive).');
      console.log('💡 You will need to re-upload your products.');
    } else {
      console.log('\n✅ GOOD NEWS: Products still exist in database!');
      console.log('💡 They should appear in your admin dashboard.');
    }
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

checkDatabase();

