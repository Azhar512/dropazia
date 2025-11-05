// Simple script to check .env file
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env');

console.log('Checking:', envPath);
console.log('');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found!');
  process.exit(1);
}

const content = fs.readFileSync(envPath, 'utf8');
const dbUrlLine = content.split('\n').find(line => line.trim().startsWith('DATABASE_URL='));

if (!dbUrlLine) {
  console.error('❌ DATABASE_URL not found in .env file!');
  process.exit(1);
}

console.log('Found DATABASE_URL line:');
console.log(dbUrlLine.substring(0, 120) + '...');
console.log('');

// Extract URL
const match = dbUrlLine.match(/DATABASE_URL=(.+)/);
if (match) {
  const url = match[1].trim();
  
  if (url.includes('db.jrajzvmcaaqqmezymyix.supabase.co')) {
    console.error('❌ WRONG: Still using old db.xxx format!');
    console.error('   This will NOT work - needs pooler format');
  } else if (url.includes('pooler.supabase.com')) {
    console.log('✅ CORRECT: Using pooler format');
  }
  
  if (url.includes(':5432')) {
    console.error('❌ WRONG: Using port 5432 (should be 6543)');
  } else if (url.includes(':6543')) {
    console.log('✅ CORRECT: Using port 6543');
  }
  
  console.log('');
  console.log('Full connection string (first 150 chars):');
  console.log(url.substring(0, 150));
}

