// Create Admin User - Supabase PostgreSQL
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { connectDB } = require('./config/database-supabase');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to Supabase PostgreSQL');

    // Check if admin already exists
    const existingAdmin = await User.findByEmail('admin@shopdaraz.com');
    if (existingAdmin) {
      console.log('✅ Admin user already exists!');
      console.log('📧 Email: admin@shopdaraz.com');
      console.log('🔑 Password: admin123');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@shopdaraz.com',
      phone: '+92-300-1234567',
      passwordHash: hashedPassword,
      role: 'admin',
      status: 'approved',
      isActive: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@shopdaraz.com');
    console.log('🔑 Password: admin123');
    console.log('👤 User ID:', adminUser.id);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  } finally {
    const { closeDB } = require('./config/database-supabase');
    await closeDB();
    process.exit(0);
  }
};

// Run
createAdmin();
