// Debug script to check what environment variables are actually loaded
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('🔍 Environment Variable Debug\n');
console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);
console.log('Loading .env from:', path.join(__dirname, '.env'));
console.log('');

const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL;

if (!dbUrl) {
  console.log('❌ DATABASE_URL not found!');
  console.log('Available env vars:', Object.keys(process.env).filter(k => k.includes('DATABASE')));
} else {
  console.log('✅ DATABASE_URL found');
  console.log('Length:', dbUrl.length);
  console.log('');
  
  // Parse and show details
  try {
    const url = new URL(dbUrl);
    console.log('Parsed connection details:');
    console.log('  Protocol:', url.protocol);
    console.log('  Username:', url.username);
    console.log('  Hostname:', url.hostname);
    console.log('  Port:', url.port || '5432 (default)');
    console.log('  Database:', url.pathname);
    console.log('');
    
    // Check if it's the correct format
    if (url.hostname.includes('pooler.supabase.com')) {
      console.log('✅ CORRECT: Using pooler format');
    } else if (url.hostname.includes('db.') && url.hostname.includes('.supabase.co')) {
      console.log('❌ WRONG: Still using old db.xxx format!');
      console.log('   Expected: aws-X-[REGION].pooler.supabase.com');
      console.log('   Got:', url.hostname);
    }
  } catch (error) {
    console.log('❌ Failed to parse URL:', error.message);
    console.log('First 100 chars:', dbUrl.substring(0, 100));
  }
}

