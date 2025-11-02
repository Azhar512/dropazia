/**
 * Check what users are ACTUALLY in the database
 * This will show if mock users (Ali Haider, etc) are really stored
 */

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/User');
const connectDB = require('./src/config/database');

const checkActualUsers = async () => {
  try {
    console.log('🔍 ==========================================');
    console.log('🔍 CHECKING ACTUAL USERS IN DATABASE');
    console.log('🔍 ==========================================\n');
    
    await connectDB();
    console.log('✅ Connected to MongoDB\n');
    
    // Get ALL users
    const allUsers = await User.find({}).select('-passwordHash -__v').lean().sort({ createdAt: -1 });
    console.log(`📊 TOTAL USERS IN DATABASE: ${allUsers.length}\n`);
    
    if (allUsers.length === 0) {
      console.log('⚠️  DATABASE IS EMPTY - No users found');
      console.log('   This means mock data is NOT coming from database');
      console.log('   The issue is likely browser cache or frontend bundle');
      console.log('   Solution: Hard refresh browser (Ctrl+Shift+R)');
      process.exit(0);
    }
    
    // Check for mock users
    const mockEmails = ['abc12@gmail.com', 'sara@gmail.com', 'm.ali@gmail.com'];
    const mockUsers = allUsers.filter(u => mockEmails.includes(u.email.toLowerCase()));
    
    if (mockUsers.length > 0) {
      console.log('❌ MOCK USERS FOUND IN DATABASE:');
      mockUsers.forEach(user => {
        console.log(`   - ${user.name} (${user.email})`);
        console.log(`     Status: ${user.status}, Role: ${user.role}`);
        console.log(`     Created: ${user.createdAt}`);
        console.log('');
      });
      console.log('⚠️  SOLUTION: Run CLEAR_MOCK_DATA.bat to delete them\n');
    } else {
      console.log('✅ NO MOCK USERS IN DATABASE');
      console.log('   Mock data is NOT coming from database');
      console.log('   The issue is browser cache or old frontend code\n');
    }
    
    // Show pending users
    const pendingUsers = allUsers.filter(u => u.status === 'pending');
    console.log(`📋 PENDING USERS: ${pendingUsers.length}`);
    if (pendingUsers.length > 0) {
      pendingUsers.forEach((user, i) => {
        console.log(`   ${i + 1}. ${user.name} (${user.email})`);
        console.log(`      Phone: ${user.phone || 'N/A'}`);
        console.log(`      Role: ${user.role}, Module: ${user.module || 'N/A'}`);
        console.log(`      Created: ${user.createdAt}`);
        console.log('');
      });
    } else {
      console.log('   No pending users found\n');
    }
    
    // Show approved users
    const approvedUsers = allUsers.filter(u => u.status === 'approved');
    console.log(`✅ APPROVED USERS: ${approvedUsers.length}`);
    if (approvedUsers.length > 0) {
      approvedUsers.slice(0, 10).forEach((user, i) => {
        console.log(`   ${i + 1}. ${user.name} (${user.email}) - ${user.role}`);
      });
      if (approvedUsers.length > 10) {
        console.log(`   ... and ${approvedUsers.length - 10} more`);
      }
      console.log('');
    }
    
    console.log('==========================================');
    console.log('SUMMARY:');
    console.log(`   Total Users: ${allUsers.length}`);
    console.log(`   Pending: ${pendingUsers.length}`);
    console.log(`   Approved: ${approvedUsers.length}`);
    console.log(`   Mock Users: ${mockUsers.length} ${mockUsers.length > 0 ? '❌ DELETE THEM' : '✅ NONE'}`);
    console.log('==========================================\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

checkActualUsers();

