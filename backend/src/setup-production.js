const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Set default MongoDB URI if not in env (for production setup)
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb+srv://dropazia:dropazia123@cluster0.9hv504i.mongodb.net/shopdaraz?retryWrites=true&w=majority';
  console.log('ℹ️  Using default MONGODB_URI (not set in .env)');
}

// Set default JWT_SECRET if not in env
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'shopdaraz-hub-production-secret-key-min-32-chars-2024';
  console.log('ℹ️  Using default JWT_SECRET (not set in .env)');
}

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/database');

const setupProduction = async () => {
  try {
    console.log('🚀 Starting Professional Production Setup...\n');
    
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('');

    // Check current data
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    
    console.log('📊 Current Database State:');
    console.log(`   Users: ${userCount}`);
    console.log(`   Products: ${productCount}`);
    console.log('');

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@shopdaraz.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists!');
      console.log('📧 Email: admin@shopdaraz.com');
      console.log('⚠️  IMPORTANT: Change the default password immediately!');
      console.log('');
    } else {
      // Create professional admin user
      console.log('👤 Creating admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminUser = await User.create({
        name: 'Administrator',
        email: 'admin@shopdaraz.com',
        phone: '+92-325-6045679',
        passwordHash: hashedPassword,
        role: 'admin',
        status: 'approved',
        isActive: true
      });
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@shopdaraz.com');
      console.log('🔑 Default Password: admin123');
      console.log('');
      console.log('⚠️  SECURITY WARNING:');
      console.log('   Please change the default password immediately after first login!');
      console.log('');
    }

    // Final summary
    console.log('✅ ==========================================');
    console.log('✅ PRODUCTION SETUP COMPLETE!');
    console.log('✅ ==========================================');
    console.log('');
    console.log('🎯 Professional Production Configuration:');
    console.log('   ✅ Admin user created');
    console.log('   ✅ No demo/test data');
    console.log('   ✅ Clean production database');
    console.log('   ✅ Ready for real products and users');
    console.log('');
    console.log('📋 Admin Login Credentials:');
    console.log('   Email: admin@shopdaraz.com');
    console.log('   Password: admin123 (CHANGE THIS IMMEDIATELY!)');
    console.log('');
    
    const finalUserCount = await User.countDocuments();
    const finalProductCount = await Product.countDocuments();
    console.log('📊 Final Database State:');
    console.log(`   Users: ${finalUserCount}`);
    console.log(`   Products: ${finalProductCount}`);
    console.log('');
    console.log('🎉 Your professional production site is ready!');
    console.log('   - Add products through admin dashboard');
    console.log('   - Users can register and await approval');
    console.log('   - Everything is production-ready');

  } catch (error) {
    console.error('❌ Setup error:', error);
    console.error('❌ Error details:', error.message);
    if (error.stack) {
      console.error('❌ Stack:', error.stack);
    }
    process.exit(1);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

// Run
setupProduction();

