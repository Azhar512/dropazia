// Script to directly fix the .env file
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env');
console.log('🔧 Fixing .env file at:', envPath);
console.log('');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found!');
  process.exit(1);
}

// Read current content
const content = fs.readFileSync(envPath, 'utf8');
console.log('📄 Current content:');
console.log(content);
console.log('');

// Replace DATABASE_URL line
const correctUrl = 'postgresql://postgres.jrajzvmcaaqqmezymyix:Shaikhprince5588%40@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true';

const lines = content.split('\n');
let updated = false;
const newLines = lines.map(line => {
  if (line.trim().startsWith('DATABASE_URL=')) {
    if (!line.includes('pooler.supabase.com')) {
      console.log('🔄 Replacing old DATABASE_URL...');
      updated = true;
      return `DATABASE_URL=${correctUrl}`;
    } else {
      console.log('✅ DATABASE_URL already correct');
      return line;
    }
  }
  return line;
});

if (updated) {
  const newContent = newLines.join('\n');
  fs.writeFileSync(envPath, newContent, 'utf8');
  console.log('');
  console.log('✅ .env file updated!');
  console.log('✅ New DATABASE_URL:', correctUrl.substring(0, 80) + '...');
} else {
  console.log('ℹ️  No changes needed');
}

console.log('');
console.log('Now test: npm run check-db');

