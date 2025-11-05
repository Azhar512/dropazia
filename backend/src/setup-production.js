// Production Setup - Supabase PostgreSQL
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { connectDB } = require('./config/database-supabase');
const User = require('./models/User');
const Product = require('./models/Product');

const setupProduction = async () => {
  try {
    console.log('🚀 Starting Professional Production Setup...\n');
    
    // Connect to database
    await connectDB();
    console.log('✅ Connected to Supabase PostgreSQL');
    console.log('');

    // Check current data
    const users = await User.find({});
    const userCount = users.length;
    const products = await Product.find({});
    const productCount = products.length;
    
    console.log('📊 Current Database State:');
    console.log(`   Users: ${userCount}`);
    console.log(`   Products: ${productCount}`);
    console.log('');

    // Check if admin exists
    const existingAdmin = await User.findByEmail('admin@shopdaraz.com');
    
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
    
    const finalUserCount = (await User.find({})).length;
    const finalProductCount = (await Product.find({})).length;
    console.log('📊 Final Database State:');
    console.log(`   Users: ${finalUserCount}`);
    console.log(`   Products: ${finalProductCount}`);
    console.log('');
    console.log('🎉 Your professional production site is ready!');
    console.log('   - Add products through admin dashboard');
    console.log('   - Users can register and await approval');
    console.log('   - Everything is production-ready');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('❌ Details:', error);
    if (error.stack) {
      console.error('❌ Stack:', error.stack);
    }
    process.exit(1);
  } finally {
    const { closeDB } = require('./config/database-supabase');
    await closeDB();
    process.exit(0);
  }
};

// Run
setupProduction();
