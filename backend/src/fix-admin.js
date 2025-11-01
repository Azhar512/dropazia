const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Set default MongoDB URI if not in env
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb+srv://dropazia:dropazia123@cluster0.9hv504i.mongodb.net/shopdaraz?retryWrites=true&w=majority';
  console.log('ℹ️  Using default MONGODB_URI');
}

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'shopdaraz-hub-production-secret-key-min-32-chars-2024';
}

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

const User = require('./models/User');
const connectDB = require('./config/database');

const fixAdmin = async () => {
  try {
    console.log('🔧 Fixing Admin User...\n');
    
    // Connect to database
    console.log('🔄 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected to MongoDB');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('');

    // Check if admin exists
    console.log('🔍 Checking for admin user...');
    const existingAdmin = await User.findOne({ email: 'admin@shopdaraz.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin user EXISTS!');
      console.log('📧 Email: admin@shopdaraz.com');
      console.log('👤 Name:', existingAdmin.name);
      console.log('🔐 Role:', existingAdmin.role);
      console.log('✅ Status:', existingAdmin.status);
      console.log('✅ Active:', existingAdmin.isActive);
      console.log('');
      
      // Verify password can be checked
      console.log('🔍 Verifying password hash...');
      const testPassword = 'admin123';
      const isPasswordValid = await bcrypt.compare(testPassword, existingAdmin.passwordHash);
      if (isPasswordValid) {
        console.log('✅ Password hash is valid for: admin123');
      } else {
        console.log('❌ Password hash does NOT match admin123');
        console.log('🔄 Resetting password...');
        const newHash = await bcrypt.hash('admin123', 10);
        existingAdmin.passwordHash = newHash;
        await existingAdmin.save();
        console.log('✅ Password reset to: admin123');
      }
      console.log('');
    } else {
      console.log('❌ Admin user does NOT exist');
      console.log('🔄 Creating admin user...');
      
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
      console.log('🔑 Password: admin123');
      console.log('👤 User ID:', adminUser._id);
      console.log('');
    }

    // Final check - try to find admin again
    const finalCheck = await User.findOne({ email: 'admin@shopdaraz.com' });
    if (finalCheck) {
      const passwordTest = await bcrypt.compare('admin123', finalCheck.passwordHash);
      console.log('✅ ==========================================');
      console.log('✅ ADMIN USER IS READY!');
      console.log('✅ ==========================================');
      console.log('');
      console.log('📋 Login Credentials:');
      console.log('   Email: admin@shopdaraz.com');
      console.log('   Password: admin123');
      console.log('');
      console.log('✅ Password verification:', passwordTest ? 'PASSED' : 'FAILED');
      console.log('');
      console.log('🎉 You can now login to the admin dashboard!');
    } else {
      throw new Error('Failed to create admin user!');
    }

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
fixAdmin();

