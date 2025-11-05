// Fix Admin User - Supabase PostgreSQL
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { connectDB } = require('./config/database-supabase');
const User = require('./models/User');

const fixAdmin = async () => {
  try {
    console.log('🔧 Fixing Admin User...\n');
    
    // Connect to database
    console.log('🔄 Connecting to Supabase PostgreSQL...');
    await connectDB();
    console.log('✅ Connected to Supabase PostgreSQL');
    console.log('');

    // Check if admin exists with new email
    const adminEmail = 'admin@dropazia.com';
    console.log('🔍 Checking for admin user...');
    let existingAdmin = await User.findByEmail(adminEmail);
    
    // Also check old email for migration
    if (!existingAdmin) {
      const oldAdmin = await User.findByEmail('admin@shopdaraz.com');
      if (oldAdmin) {
        console.log('🔄 Found admin with old email, updating to new email...');
        await User.update(oldAdmin.id, { email: adminEmail });
        existingAdmin = await User.findByEmail(adminEmail);
      }
    }
    
    if (existingAdmin) {
      console.log('✅ Admin user EXISTS!');
      console.log('📧 Email:', adminEmail);
      console.log('👤 Name:', existingAdmin.name);
      console.log('🔐 Role:', existingAdmin.role);
      console.log('✅ Status:', existingAdmin.status);
      console.log('✅ Active:', existingAdmin.is_active);
      console.log('');
      
      // Verify password can be checked
      console.log('🔍 Verifying password hash...');
      const testPassword = 'admin123';
      const isPasswordValid = await bcrypt.compare(testPassword, existingAdmin.password_hash);
      if (isPasswordValid) {
        console.log('✅ Password hash is valid for: admin123');
      } else {
        console.log('❌ Password hash does NOT match admin123');
        console.log('🔄 Resetting password...');
        const newHash = await bcrypt.hash('admin123', 10);
        await User.update(existingAdmin.id, { passwordHash: newHash });
        console.log('✅ Password reset to: admin123');
      }
      console.log('');
    } else {
      console.log('❌ Admin user does NOT exist');
      console.log('🔄 Creating admin user...');
      
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminUser = await User.create({
        name: 'Administrator',
        email: adminEmail,
        phone: '+92-325-6045679',
        passwordHash: hashedPassword,
        role: 'admin',
        status: 'approved',
        isActive: true
      });
      
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Password: admin123');
      console.log('👤 User ID:', adminUser.id);
      console.log('');
    }

    // Final check - try to find admin again
    const finalCheck = await User.findByEmail(adminEmail);
    if (finalCheck) {
      const passwordTest = await bcrypt.compare('admin123', finalCheck.password_hash);
      console.log('✅ ==========================================');
      console.log('✅ ADMIN USER IS READY!');
      console.log('✅ ==========================================');
      console.log('');
      console.log('📋 Login Credentials:');
      console.log('   Email:', adminEmail);
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
    const { closeDB } = require('./config/database-supabase');
    await closeDB();
    process.exit(0);
  }
};

// Run
fixAdmin();
