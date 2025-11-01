// Quick test script to verify users API works
require('dotenv').config();

// Set default MongoDB URI if not in env
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb+srv://dropazia:dropazia123@cluster0.9hv504i.mongodb.net/shopdaraz?retryWrites=true&w=majority';
}

const User = require('./src/models/User');
const connectDB = require('./src/config/database');

const testUsersAPI = async () => {
  try {
    console.log('🧪 Testing Users API...\n');
    
    await connectDB();
    console.log('✅ Connected to database\n');

    // Check pending users
    const pendingUsers = await User.find({ status: 'pending' }).select('-passwordHash').lean();
    console.log(`📊 Pending Users: ${pendingUsers.length}`);
    if (pendingUsers.length > 0) {
      console.log('Pending users:');
      pendingUsers.forEach((u, i) => {
        console.log(`  ${i + 1}. ${u.name} (${u.email}) - Status: ${u.status}`);
      });
    } else {
      console.log('⚠️  No pending users found in database');
    }
    console.log('');

    // Check approved users
    const approvedUsers = await User.find({ status: 'approved' }).select('-passwordHash').lean();
    console.log(`📊 Approved Users: ${approvedUsers.length}`);
    if (approvedUsers.length > 0) {
      console.log('Approved users:');
      approvedUsers.forEach((u, i) => {
        console.log(`  ${i + 1}. ${u.name} (${u.email}) - Status: ${u.status}`);
      });
    }
    console.log('');

    // Check all users
    const allUsers = await User.find({}).select('-passwordHash').lean();
    console.log(`📊 Total Users: ${allUsers.length}`);
    console.log('All users by status:');
    const statusCounts = {};
    allUsers.forEach(u => {
      statusCounts[u.status] = (statusCounts[u.status] || 0) + 1;
    });
    console.log('  Status counts:', statusCounts);
    console.log('');

    if (pendingUsers.length === 0 && allUsers.length > 0) {
      console.log('💡 TIP: All users might already be approved. Try registering a new user to test.');
    }

    console.log('✅ Test complete!');
  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    process.exit(0);
  }
};

testUsersAPI();

