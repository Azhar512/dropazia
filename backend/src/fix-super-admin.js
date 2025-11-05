// Fix Super Admin User - Supabase PostgreSQL
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

const { connectDB, closeDB } = require('./config/database-supabase');
const User = require('./models/User');

const fixSuperAdmin = async () => {
  try {
    console.log('🔧 Setting up Super Admin...\n');
    
    // Connect to database
    console.log('🔄 Connecting to Supabase PostgreSQL...');
    await connectDB();
    console.log('✅ Connected to Supabase PostgreSQL');
    console.log('');

    // Check if super admin already exists
    const superAdminEmail = 'superadmin@dropazia.com';
    console.log('🔍 Checking for super admin user...');
    
    // First, check if any super admin exists
    const { getPool } = require('./config/database-supabase');
    const pool = getPool();
    const existingSuperAdmins = await pool.query(
      "SELECT * FROM users WHERE role = 'super_admin'"
    );
    
    if (existingSuperAdmins.rows.length > 0) {
      const existingSuperAdmin = existingSuperAdmins.rows[0];
      console.log('✅ Super admin already EXISTS!');
      console.log('📧 Email:', existingSuperAdmin.email);
      console.log('👤 Name:', existingSuperAdmin.name);
      console.log('🔐 Role:', existingSuperAdmin.role);
      console.log('');
      
      // Verify password
      const testPassword = 'superadmin123';
      const isPasswordValid = await bcrypt.compare(testPassword, existingSuperAdmin.password_hash);
      if (isPasswordValid) {
        console.log('✅ Password is valid for: superadmin123');
      } else {
        console.log('🔄 Resetting password...');
        const newHash = await bcrypt.hash('superadmin123', 10);
        await User.update(existingSuperAdmin.id, { passwordHash: newHash });
        console.log('✅ Password reset to: superadmin123');
      }
      
      // Ensure email is correct
      if (existingSuperAdmin.email !== superAdminEmail) {
        console.log(`🔄 Updating email to ${superAdminEmail}...`);
        await User.update(existingSuperAdmin.id, { email: superAdminEmail });
        console.log('✅ Email updated');
      }
      
      console.log('');
      console.log('✅ ==========================================');
      console.log('✅ SUPER ADMIN IS READY!');
      console.log('✅ ==========================================');
      console.log('');
      console.log('📋 Login Credentials:');
      console.log('   Email:', superAdminEmail);
      console.log('   Password: superadmin123');
      console.log('');
    } else {
      console.log('❌ No super admin found');
      console.log('🔄 Creating super admin user...');
      
      const hashedPassword = await bcrypt.hash('superadmin123', 10);
      const superAdminUser = await User.create({
        name: 'Super Administrator',
        email: superAdminEmail,
        phone: '+92-325-6045679',
        passwordHash: hashedPassword,
        role: 'super_admin',
        status: 'approved',
        isActive: true
      });
      
      console.log('✅ Super admin created successfully!');
      console.log('📧 Email:', superAdminEmail);
      console.log('🔑 Password: superadmin123');
      console.log('👤 User ID:', superAdminUser.id);
      console.log('');
      
      // Verify creation
      const verifySuperAdmin = await User.findByEmail(superAdminEmail);
      if (verifySuperAdmin) {
        const passwordTest = await bcrypt.compare('superadmin123', verifySuperAdmin.password_hash);
        console.log('✅ ==========================================');
        console.log('✅ SUPER ADMIN CREATED SUCCESSFULLY!');
        console.log('✅ ==========================================');
        console.log('');
        console.log('📋 Login Credentials:');
        console.log('   Email:', superAdminEmail);
        console.log('   Password: superadmin123');
        console.log('');
        console.log('✅ Password verification:', passwordTest ? 'PASSED' : 'FAILED');
        console.log('');
      } else {
        throw new Error('Failed to verify super admin creation!');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('❌ Details:', error);
    if (error.stack) {
      console.error('❌ Stack:', error.stack);
    }
    process.exit(1);
  } finally {
    await closeDB();
    process.exit(0);
  }
};

// Run
fixSuperAdmin();

