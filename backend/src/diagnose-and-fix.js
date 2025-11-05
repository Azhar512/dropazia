// Database Diagnostic & Fix Tool - Supabase PostgreSQL
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { connectDB } = require('./config/database-supabase');
const User = require('./models/User');
const Product = require('./models/Product');

const diagnoseAndFix = async () => {
  try {
    console.log('🔍 ==========================================');
    console.log('🔍 DATABASE DIAGNOSTIC & FIX TOOL');
    console.log('🔍 ==========================================\n');
    
    // Step 1: Test Database Connection
    console.log('📡 Step 1: Testing Database Connection...');
    await connectDB();
    console.log('✅ Connected to Supabase PostgreSQL');
    console.log('');
    
    // Step 2: Check Users
    console.log('👤 Step 2: Checking Users...');
    const users = await User.find({});
    const userCount = users.length;
    console.log(`   Total Users: ${userCount}`);
    
    const adminUser = await User.findByEmail('admin@shopdaraz.com');
    if (adminUser) {
      console.log('   ✅ Admin user EXISTS');
      console.log(`   Name: ${adminUser.name}`);
      console.log(`   Role: ${adminUser.role}`);
      console.log(`   Status: ${adminUser.status}`);
      console.log(`   Active: ${adminUser.is_active}`);
      console.log(`   Password Hash: ${adminUser.password_hash ? 'SET' : 'MISSING'}`);
      
      // Test password
      console.log('   🔐 Testing password...');
      const testPassword = 'admin123';
      try {
        const isValid = await bcrypt.compare(testPassword, adminUser.password_hash);
        if (isValid) {
          console.log('   ✅ Password "admin123" is CORRECT');
        } else {
          console.log('   ❌ Password "admin123" does NOT match!');
          console.log('   🔄 Resetting password...');
          const newHash = await bcrypt.hash('admin123', 10);
          await User.update(adminUser.id, { 
            passwordHash: newHash,
            isActive: true,
            status: 'approved'
          });
          console.log('   ✅ Password reset to "admin123"');
        }
      } catch (pwdError) {
        console.log('   ❌ Error testing password:', pwdError.message);
        console.log('   🔄 Resetting password...');
        const newHash = await bcrypt.hash('admin123', 10);
        await User.update(adminUser.id, { 
          passwordHash: newHash,
          isActive: true,
          status: 'approved'
        });
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
      console.log(`   User ID: ${newAdmin.id}`);
    }
    console.log('');
    
    // Step 3: Check Products
    console.log('📦 Step 3: Checking Products...');
    const products = await Product.find({});
    const productCount = products.length;
    console.log(`   Total Products: ${productCount}`);
    
    const darazProducts = products.filter(p => p.module === 'daraz').length;
    const shopifyProducts = products.filter(p => p.module === 'shopify').length;
    console.log(`   Daraz Products: ${darazProducts}`);
    console.log(`   Shopify Products: ${shopifyProducts}`);
    console.log('');
    
    // Step 4: Summary
    console.log('📊 Step 4: Summary');
    console.log('   ✅ Database connection: OK');
    console.log(`   ✅ Users: ${userCount}`);
    console.log(`   ✅ Products: ${productCount}`);
    console.log(`   ✅ Admin user: ${adminUser ? 'EXISTS' : 'CREATED'}`);
    console.log('');
    console.log('✅ ==========================================');
    console.log('✅ DIAGNOSTIC COMPLETE!');
    console.log('✅ ==========================================');
    console.log('');
    console.log('📋 Admin Login Credentials:');
    console.log('   Email: admin@shopdaraz.com');
    console.log('   Password: admin123');
    console.log('');

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
diagnoseAndFix();
