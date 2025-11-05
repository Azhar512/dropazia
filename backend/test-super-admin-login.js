// Test Super Admin Login
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// Explicitly load .env from backend directory
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath, override: true });
} else {
  require('dotenv').config({ override: true });
}

const { connectDB, closeDB } = require('./src/config/database-supabase');
const User = require('./src/models/User');

const testLogin = async () => {
  try {
    console.log('🧪 Testing Super Admin Login...\n');
    
    await connectDB();
    console.log('✅ Connected to database\n');

    const email = 'superadmin@dropazia.com';
    const password = 'superadmin123';

    console.log('🔍 Looking for user:', email);
    const user = await User.findByEmail(email);
    
    if (!user) {
      console.log('❌ User not found!');
      return;
    }

    console.log('✅ User found!');
    console.log('   ID:', user.id);
    console.log('   Name:', user.name);
    console.log('   Email:', user.email);
    console.log('   Role:', user.role);
    console.log('   Status:', user.status);
    console.log('   Is Active:', user.is_active);
    console.log('');

    console.log('🔐 Testing password...');
    const isValid = await bcrypt.compare(password, user.password_hash);
    
    if (isValid) {
      console.log('✅ Password is CORRECT!');
      console.log('✅ Login should work!');
    } else {
      console.log('❌ Password is INCORRECT!');
      console.log('🔄 Resetting password...');
      const newHash = await bcrypt.hash(password, 10);
      await User.update(user.id, { passwordHash: newHash });
      console.log('✅ Password reset! Try login again.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await closeDB();
    process.exit(0);
  }
};

testLogin();

