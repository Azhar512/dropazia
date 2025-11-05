// Verify Supabase Connection String Format
require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL;

console.log('🔍 Verifying Connection String Format...\n');

if (!databaseUrl) {
  console.error('❌ DATABASE_URL not found in environment variables!');
  console.error('❌ Please set DATABASE_URL in backend/.env file');
  process.exit(1);
}

console.log('📋 Current Connection String (masked):');
const masked = databaseUrl.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@');
console.log(masked);
console.log('');

// Check format
const issues = [];

if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
  issues.push('❌ Must start with postgresql:// or postgres://');
}

// Check hostname
try {
  const url = new URL(databaseUrl);
  
  console.log('🔍 Parsed Connection Details:');
  console.log(`   Protocol: ${url.protocol}`);
  console.log(`   Username: ${url.username}`);
  console.log(`   Hostname: ${url.hostname}`);
  console.log(`   Port: ${url.port || '5432 (default)'}`);
  console.log(`   Database: ${url.pathname}`);
  console.log('');
  
  // Check hostname format
  if (url.hostname.includes('db.') && url.hostname.includes('.supabase.co')) {
    issues.push('❌ Hostname uses old format: db.xxx.supabase.co');
    issues.push('   ✅ Should use: aws-0-[REGION].pooler.supabase.com');
  }
  
  if (!url.hostname.includes('pooler.supabase.com') && !url.hostname.includes('supabase.com')) {
    issues.push('❌ Hostname does not appear to be a Supabase hostname');
  }
  
  // Check username format
  if (url.username === 'postgres' && !url.username.includes('.')) {
    issues.push('⚠️  Username should be: postgres.[PROJECT-REF]');
    issues.push('   Example: postgres.abcdefghijklmnop');
  }
  
  // Check port
  const port = url.port || '5432';
  if (port === '6543') {
    console.log('✅ Using connection pooling (port 6543) - Good!');
  } else if (port === '5432') {
    console.log('ℹ️  Using session mode (port 5432) - OK, but pooling (6543) is recommended');
  }
  
} catch (error) {
  issues.push(`❌ Failed to parse URL: ${error.message}`);
}

console.log('');

if (issues.length > 0) {
  console.log('❌ Issues Found:');
  issues.forEach(issue => console.log(`   ${issue}`));
  console.log('');
  console.log('📖 How to Fix:');
  console.log('   1. Go to: https://app.supabase.com');
  console.log('   2. Select your project');
  console.log('   3. Go to Settings → Database');
  console.log('   4. Scroll to "Connection string"');
  console.log('   5. Select "Connection pooling" tab');
  console.log('   6. Copy the connection string');
  console.log('   7. Update DATABASE_URL in backend/.env');
  console.log('');
  console.log('✅ Correct format example:');
  console.log('   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres');
  process.exit(1);
} else {
  console.log('✅ Connection string format looks correct!');
  console.log('   Try running: npm run check-db');
}

