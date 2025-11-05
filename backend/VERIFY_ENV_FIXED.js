// Verify .env file is being read correctly
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying .env file...\n');

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found at:', envPath);
  process.exit(1);
}

console.log('✅ .env file found at:', envPath);
console.log('');

// Read raw file content
const content = fs.readFileSync(envPath, 'utf8');
const lines = content.split('\n');

console.log('📄 File contents:');
lines.forEach((line, index) => {
  if (line.trim().startsWith('DATABASE_URL')) {
    console.log(`Line ${index + 1}: ${line.substring(0, 100)}...`);
    
    // Extract the connection string
    const match = line.match(/DATABASE_URL=(.+)/);
    if (match) {
      const url = match[1].trim();
      console.log('');
      console.log('🔍 Connection String Analysis:');
      console.log('  Length:', url.length);
      console.log('  Starts with:', url.substring(0, 20));
      
      // Check for old format
      if (url.includes('db.jrajzvmcaaqqmezymyix.supabase.co')) {
        console.log('  ❌ WRONG: Contains old db.xxx format!');
      } else if (url.includes('pooler.supabase.com')) {
        console.log('  ✅ CORRECT: Contains pooler format');
      }
      
      // Check port
      if (url.includes(':5432')) {
        console.log('  ❌ WRONG: Using port 5432 (should be 6543)');
      } else if (url.includes(':6543')) {
        console.log('  ✅ CORRECT: Using port 6543');
      }
      
      // Try to parse
      try {
        const urlObj = new URL(url);
        console.log('');
        console.log('  Parsed hostname:', urlObj.hostname);
        console.log('  Parsed port:', urlObj.port || '5432 (default)');
        
        if (urlObj.hostname.includes('pooler.supabase.com')) {
          console.log('  ✅ Hostname is CORRECT!');
        } else {
          console.log('  ❌ Hostname is WRONG!');
        }
      } catch (error) {
        console.log('  ❌ Failed to parse URL:', error.message);
      }
    }
  }
});

console.log('');
console.log('💡 If you see wrong format, make sure:');
console.log('   1. The entire connection string is on ONE line');
console.log('   2. No spaces around the = sign');
console.log('   3. Uses pooler.supabase.com (not db.xxx.supabase.co)');
console.log('   4. Uses port 6543 (not 5432)');

