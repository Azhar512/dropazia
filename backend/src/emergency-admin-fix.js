// EMERGENCY ADMIN FIX - Run this if login fails
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Production MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://dropazia:dropazia123@cluster0.9hv504i.mongodb.net/shopdaraz?retryWrites=true&w=majority';

console.log('🚨 EMERGENCY ADMIN FIX');
console.log('====================\n');

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
.then(async () => {
  console.log('✅ Connected to MongoDB');
  console.log('📊 Database:', mongoose.connection.db.databaseName);
  console.log('');

  const User = mongoose.model('User', new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
    role: String,
    status: String,
    isActive: Boolean,
    phone: String
  }, { collection: 'users' }));

  // Delete existing admin if any
  await User.deleteOne({ email: 'admin@shopdaraz.com' });
  console.log('🗑️  Removed any existing admin user');

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
  console.log('👤 ID:', admin._id);
  console.log('');

  // Verify password
  const isValid = await bcrypt.compare('admin123', admin.passwordHash);
  console.log('✅ Password verification:', isValid ? 'PASSED' : 'FAILED');
  console.log('');
  console.log('🎉 DONE! You can now login.');
  console.log('   URL: https://dropazia.online/admin-login');
  console.log('');

  process.exit(0);
})
.catch(error => {
  console.error('❌ ERROR:', error.message);
  process.exit(1);
});

