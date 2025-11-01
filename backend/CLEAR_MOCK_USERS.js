/**
 * Script to clear any mock/test users from database
 * Run this if you see mock users (Ali Haider, Sara Khan, Muhammad Ali) in admin dashboard
 */

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/User');
const connectDB = require('./src/config/database');

const clearMockUsers = async () => {
  try {
    console.log('🔍 ==========================================');
    console.log('🔍 CLEARING MOCK/TEST USERS FROM DATABASE');
    console.log('🔍 ==========================================\n');
    
    await connectDB();
    console.log('✅ Connected to MongoDB\n');
    
    // List of mock user emails to check
    const mockEmails = [
      'abc12@gmail.com',
      'sara@gmail.com',
      'm.ali@gmail.com'
    ];
    
    // Find all users with these emails
    const mockUsers = await User.find({ email: { $in: mockEmails } });
    console.log(`📋 Found ${mockUsers.length} users with mock emails`);
    
    if (mockUsers.length > 0) {
      console.log('\n📝 Mock users found:');
      mockUsers.forEach(user => {
        console.log(`   - ${user.name} (${user.email}) - Status: ${user.status}`);
      });
      
      // Delete mock users
      const deleteResult = await User.deleteMany({ email: { $in: mockEmails } });
      console.log(`\n🗑️ Deleted ${deleteResult.deletedCount} mock users`);
    } else {
      console.log('✅ No mock users found in database');
      console.log('   The users you see might be from browser cache');
      console.log('   Try: Hard refresh (Ctrl+Shift+R) or clear browser cache');
    }
    
    // Show current pending users
    const pendingUsers = await User.find({ status: 'pending' });
    console.log(`\n📊 Current pending users in database: ${pendingUsers.length}`);
    if (pendingUsers.length > 0) {
      console.log('   Pending users:');
      pendingUsers.forEach(user => {
        console.log(`   - ${user.name} (${user.email})`);
      });
    } else {
      console.log('   No pending users - this is correct if no one has registered');
    }
    
    console.log('\n✅ ==========================================');
    console.log('✅ CLEANUP COMPLETE');
    console.log('✅ ==========================================');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

clearMockUsers();

