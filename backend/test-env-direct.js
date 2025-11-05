// Test what DATABASE_URL is actually being loaded
console.log('🔍 Testing Environment Variables...\n');

// Check system env first
console.log('1. System Environment Variable:');
const systemEnv = process.env.DATABASE_URL;
if (systemEnv) {
  console.log('   ❌ FOUND SYSTEM ENV VAR! This overrides .env file!');
  console.log('   Value (masked):', systemEnv.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@'));
  console.log('   Hostname:', new URL(systemEnv).hostname);
  console.log('');
  console.log('   💡 SOLUTION: Remove system environment variable');
  console.log('   Run in PowerShell: Remove-Item Env:\DATABASE_URL');
} else {
  console.log('   ✅ No system env var (good)');
}

console.log('\n2. Loading .env file...');
const path = require('path');
const fs = require('fs');
const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  console.log('   ❌ .env file not found at:', envPath);
} else {
  console.log('   ✅ .env file found');
  const content = fs.readFileSync(envPath, 'utf8');
  const dbLine = content.split('\n').find(l => l.trim().startsWith('DATABASE_URL='));
  if (dbLine) {
    const match = dbLine.match(/DATABASE_URL=(.+)/);
    if (match) {
      const url = match[1].trim();
      console.log('   Found in .env:', url.substring(0, 80) + '...');
      try {
        const urlObj = new URL(url);
        console.log('   Hostname:', urlObj.hostname);
        if (urlObj.hostname.includes('pooler.supabase.com')) {
          console.log('   ✅ CORRECT format in .env file');
        } else {
          console.log('   ❌ WRONG format in .env file!');
        }
      } catch (e) {
        console.log('   ❌ Invalid URL format');
      }
    }
  }
}

console.log('\n3. After loading dotenv...');
require('dotenv').config({ path: envPath });
const loadedEnv = process.env.DATABASE_URL;
if (loadedEnv) {
  try {
    const urlObj = new URL(loadedEnv);
    console.log('   Hostname:', urlObj.hostname);
    if (urlObj.hostname.includes('pooler.supabase.com')) {
      console.log('   ✅ CORRECT: Will use pooler format');
    } else {
      console.log('   ❌ WRONG: Will use old format');
      console.log('   This is why it fails!');
    }
  } catch (e) {
    console.log('   ❌ Invalid URL');
  }
} else {
  console.log('   ❌ DATABASE_URL not loaded from .env');
}

