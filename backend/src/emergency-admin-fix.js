// EMERGENCY ADMIN FIX - Supabase PostgreSQL
// Run this if login fails
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { connectDB } = require('./config/database-supabase');
const User = require('./models/User');

console.log('🚨 EMERGENCY ADMIN FIX');
console.log('====================\n');

connectDB()
  .then(async () => {
    console.log('✅ Connected to Supabase PostgreSQL');
    console.log('');

    // Delete existing admin if any
    const existingAdmin = await User.findByEmail('admin@shopdaraz.com');
    if (existingAdmin) {
      await User.delete(existingAdmin.id);
      console.log('🗑️  Removed any existing admin user');
    }

    // Create fresh admin
    const hash = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Administrator',
      email: 'admin@shopdaraz.com',
      phone: '+92-325-6045679',
      passwordHash: hash,
      role: 'admin',
      status: 'approved',
      isActive: true
    });

    console.log('✅ Admin user CREATED');
    console.log('📧 Email: admin@shopdaraz.com');
    console.log('🔑 Password: admin123');
    console.log('👤 ID:', admin.id);
    console.log('');

    // Verify password
    const adminCheck = await User.findByEmail('admin@shopdaraz.com');
    const isValid = await bcrypt.compare('admin123', adminCheck.password_hash);
    console.log('✅ Password verification:', isValid ? 'PASSED' : 'FAILED');
    console.log('');
    console.log('🎉 DONE! You can now login.');
    console.log('   URL: https://dropazia.online/admin-login');
    console.log('');

    const { closeDB } = require('./config/database-supabase');
    await closeDB();
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ ERROR:', error.message);
    console.error('❌ Full error:', error);
    process.exit(1);
  });
