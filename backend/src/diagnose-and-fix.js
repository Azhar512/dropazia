const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Set default MongoDB URI if not in env (PRODUCTION DATABASE)
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb+srv://dropazia:dropazia123@cluster0.9hv504i.mongodb.net/shopdaraz?retryWrites=true&w=majority';
  console.log('ℹ️  Using production MONGODB_URI');
}
console.log('🔗 MongoDB URI:', process.env.MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'shopdaraz-hub-production-secret-key-min-32-chars-2024';
}

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/database');

const diagnoseAndFix = async () => {
  try {
    console.log('🔍 ==========================================');
    console.log('🔍 DATABASE DIAGNOSTIC & FIX TOOL');
    console.log('🔍 ==========================================\n');
    
    // Step 1: Test Database Connection
    console.log('📡 Step 1: Testing Database Connection...');
    await connectDB();
    const dbName = mongoose.connection.db.databaseName;
    console.log('✅ Connected to MongoDB');
    console.log('📊 Database:', dbName);
    
    if (dbName === 'test') {
      console.error('❌ ERROR: Connected to "test" database!');
      console.error('❌ Your MONGODB_URI is missing the database name!');
      process.exit(1);
    }
    console.log('');
    
    // Step 2: Check Users
    console.log('👤 Step 2: Checking Users...');
    const userCount = await User.countDocuments();
    console.log(`   Total Users: ${userCount}`);
    
    const adminUser = await User.findOne({ email: 'admin@shopdaraz.com' });
    if (adminUser) {
      console.log('   ✅ Admin user EXISTS');
      console.log(`   Name: ${adminUser.name}`);
      console.log(`   Role: ${adminUser.role}`);
      console.log(`   Status: ${adminUser.status}`);
      console.log(`   Active: ${adminUser.isActive}`);
      console.log(`   Password Hash: ${adminUser.passwordHash ? 'SET' : 'MISSING'}`);
      
      // Test password
      console.log('   🔐 Testing password...');
      const testPassword = 'admin123';
      try {
        const isValid = await bcrypt.compare(testPassword, adminUser.passwordHash);
        if (isValid) {
          console.log('   ✅ Password "admin123" is CORRECT');
        } else {
          console.log('   ❌ Password "admin123" does NOT match!');
          console.log('   🔄 Resetting password...');
          const newHash = await bcrypt.hash('admin123', 10);
          adminUser.passwordHash = newHash;
          adminUser.isActive = true;
          adminUser.status = 'approved';
          await adminUser.save();
          console.log('   ✅ Password reset to "admin123"');
        }
      } catch (pwdError) {
        console.log('   ❌ Error testing password:', pwdError.message);
        console.log('   🔄 Resetting password...');
        const newHash = await bcrypt.hash('admin123', 10);
        adminUser.passwordHash = newHash;
        adminUser.isActive = true;
        adminUser.status = 'approved';
        await adminUser.save();
        console.log('   ✅ Password reset to "admin123"');
      }
    } else {
      console.log('   ❌ Admin user does NOT exist');
      console.log('   🔄 Creating admin user...');
      
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const newAdmin = await User.create({
        name: 'Administrator',
        email: 'admin@shopdaraz.com',
        phone: '+92-325-6045679',
        passwordHash: hashedPassword,
        role: 'admin',
        status: 'approved',
        isActive: true
      });
      console.log('   ✅ Admin user CREATED');
      console.log(`   User ID: ${newAdmin._id}`);
    }
    console.log('');
    
    // Step 3: Verify Admin User
    console.log('✅ Step 3: Final Verification...');
    const finalAdmin = await User.findOne({ email: 'admin@shopdaraz.com' });
    if (!finalAdmin) {
      throw new Error('Admin user still not found after creation!');
    }
    
    const finalPasswordTest = await bcrypt.compare('admin123', finalAdmin.passwordHash);
    if (!finalPasswordTest) {
      throw new Error('Password verification failed after fix!');
    }
    
    console.log('   ✅ Admin user verified');
    console.log('   ✅ Password verified');
    console.log('   ✅ Status: approved');
    console.log('   ✅ Active: true');
    console.log('');
    
    // Step 4: Check Products
    console.log('📦 Step 4: Checking Products...');
    const productCount = await Product.countDocuments();
    console.log(`   Total Products: ${productCount}`);
    console.log('');
    
    // Final Summary
    console.log('✅ ==========================================');
    console.log('✅ DIAGNOSTIC COMPLETE - ALL ISSUES FIXED!');
    console.log('✅ ==========================================');
    console.log('');
    console.log('📋 Admin Login Credentials:');
    console.log('   Email: admin@shopdaraz.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('🎉 You can now login to the admin dashboard!');
    console.log('   URL: https://dropazia.online/admin-login');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('❌ Details:', error);
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
diagnoseAndFix();

