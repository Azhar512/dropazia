/**
 * FORCE DELETE MOCK USERS
 * This will DELETE the exact mock users showing in your dashboard:
 * - Ali Haider (abc12@gmail.com)
 * - Sara Khan (sara@gmail.com)  
 * - Muhammad Ali (m.ali@gmail.com)
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Set default MongoDB URI if not in env
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb+srv://dropazia:dropazia123@cluster0.9hv504i.mongodb.net/shopdaraz?retryWrites=true&w=majority';
}

const User = require('./src/models/User');
const connectDB = require('./src/config/database');

const deleteMockUsers = async () => {
  try {
    console.log('🗑️ ==========================================');
    console.log('🗑️ FORCE DELETING MOCK USERS FROM DATABASE');
    console.log('🗑️ ==========================================\n');
    
    await connectDB();
    console.log('✅ Connected to MongoDB\n');
    
    // Exact mock user emails from your screenshot
    const mockEmails = [
      'abc12@gmail.com',      // Ali Haider
      'sara@gmail.com',        // Sara Khan
      'm.ali@gmail.com'        // Muhammad Ali
    ];
    
    console.log('🔍 Searching for mock users...');
    
    // Find all users with these exact emails
    const mockUsers = await User.find({ 
      email: { $in: mockEmails.map(e => e.toLowerCase()) } 
    });
    
    if (mockUsers.length === 0) {
      console.log('✅ No mock users found in database');
      console.log('⚠️  The mock data is coming from browser cache!');
      console.log('\n📋 Solution:');
      console.log('   1. Press Ctrl+Shift+Delete');
      console.log('   2. Select "All time"');
      console.log('   3. Check ALL boxes');
      console.log('   4. Click "Clear data"');
      console.log('   5. Close browser completely');
      console.log('   6. Reopen and go to admin dashboard');
    } else {
      console.log(`📋 Found ${mockUsers.length} mock user(s) to delete:\n`);
      mockUsers.forEach(user => {
        console.log(`   - ${user.name} (${user.email})`);
        console.log(`     Phone: ${user.phone}`);
        console.log(`     Status: ${user.status}`);
        console.log(`     Role: ${user.role}`);
        console.log('');
      });
      
      // DELETE them
      const deleteResult = await User.deleteMany({ 
        email: { $in: mockEmails.map(e => e.toLowerCase()) } 
      });
      
      console.log(`\n🗑️  DELETED ${deleteResult.deletedCount} mock user(s) from database`);
      console.log('✅ Database cleaned!\n');
    }
    
    // Show current state
    const allPending = await User.find({ status: 'pending' });
    console.log('📊 Current Database State:');
    console.log(`   Total pending users: ${allPending.length}`);
    if (allPending.length > 0) {
      console.log('   Pending users:');
      allPending.forEach(u => {
        console.log(`     - ${u.name} (${u.email})`);
      });
    } else {
      console.log('   ✅ No pending users (this is correct if no one registered yet)');
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

deleteMockUsers();

