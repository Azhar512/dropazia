// Supabase PostgreSQL Database Connection
const path = require('path');
const fs = require('fs');

// Explicitly load .env from backend directory (resolve to absolute path)
// __dirname is backend/src/config, so we need to go up 2 levels to backend/
const envPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  // Clear any existing DATABASE_URL from process.env first
  delete process.env.DATABASE_URL;
  delete process.env.SUPABASE_DATABASE_URL;
  
  require('dotenv').config({ path: envPath, override: true });
  console.log('✅ Loaded .env from:', envPath);
  
  // Verify it loaded the correct connection string
  if (process.env.DATABASE_URL) {
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl.includes('pooler.supabase.com')) {
      console.log('✅ Connection string format: CORRECT (pooler format)');
    } else if (dbUrl.includes('db.') && dbUrl.includes('.supabase.co')) {
      console.error('❌ Connection string format: WRONG (old db.xxx format)');
      console.error('   Your .env file still has the old connection string!');
    }
  }
} else {
  // Try backend/.env from current working directory
  const fallbackPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(fallbackPath)) {
    delete process.env.DATABASE_URL;
    delete process.env.SUPABASE_DATABASE_URL;
    require('dotenv').config({ path: fallbackPath, override: true });
    console.log('✅ Loaded .env from fallback:', fallbackPath);
  } else {
    // Last resort: default location
    require('dotenv').config({ override: true });
    console.log('⚠️  .env not found at:', envPath, '- using default location');
  }
}
const { Pool } = require('pg');

// Configure Node.js to prefer IPv4 for DNS lookups (Node.js 17+)
// This helps when hostnames resolve to both IPv4 and IPv6
if (require('dns').setDefaultResultOrder) {
  require('dns').setDefaultResultOrder('ipv4first');
  console.log('🔧 Configured DNS to prefer IPv4');
}

// Cache the connection pool
let pool = null;

const connectDB = async () => {
  try {
    // If pool already exists and is connected, return it
    if (pool && !pool.ended) {
      // Test connection
      try {
        await pool.query('SELECT NOW()');
        console.log('✅ Already connected to Supabase PostgreSQL');
        return pool;
      } catch (error) {
        // Connection lost, create new pool
        console.log('🔄 Connection lost, reconnecting...');
        pool = null;
      }
    }

    const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL;
    
    if (!databaseUrl) {
      console.error('❌ DATABASE_URL or SUPABASE_DATABASE_URL environment variable is not set!');
      console.error('❌ Please set DATABASE_URL in backend/.env file');
      throw new Error('Database URL not configured');
    }

    // Debug: Show which env var was used and from where
    if (process.env.DATABASE_URL) {
      console.log('📋 Using DATABASE_URL from environment');
      // Show first 80 chars to verify it's the right one
      const masked = databaseUrl.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@');
      console.log('📋 Connection string preview:', masked.substring(0, 80) + '...');
    } else if (process.env.SUPABASE_DATABASE_URL) {
      console.log('📋 Using SUPABASE_DATABASE_URL from environment');
    }

    // Validate connection string format
    if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
      console.error('❌ Invalid DATABASE_URL format!');
      console.error('❌ Expected format: postgresql://user:password@host:port/database');
      console.error('❌ Your URL starts with:', databaseUrl.substring(0, 20) + '...');
      throw new Error('Invalid database URL format');
    }

    // Debug: Show masked connection string
    const maskedUrl = databaseUrl.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@');
    console.log('📋 Connection string (masked):', maskedUrl.substring(0, 80) + '...');

    console.log('🔄 Attempting to connect to Supabase PostgreSQL...');
    
    // Parse connection string to extract hostname for logging
    let url;
    try {
      url = new URL(databaseUrl);
      console.log(`🔗 Connecting to: ${url.hostname}:${url.port || '5432'}`);
      
      // Debug: Check if hostname looks correct
      if (url.hostname.includes('db.') && url.hostname.endsWith('.supabase.co')) {
        console.error('⚠️  WARNING: Hostname format looks incorrect!');
        console.error('⚠️  Expected: aws-0-[REGION].pooler.supabase.com');
        console.error(`⚠️  Got: ${url.hostname}`);
        console.error('⚠️  This might cause DNS resolution errors');
      }
    } catch (parseError) {
      console.error('❌ Failed to parse DATABASE_URL!');
      console.error('❌ Error:', parseError.message);
      console.error('❌ DATABASE_URL format should be: postgresql://user:password@host:port/database');
      console.error('❌ Make sure special characters in password are URL-encoded');
      throw new Error('Invalid DATABASE_URL format: ' + parseError.message);
    }
    
    // Create connection pool - use connection string directly
    // The pg library will handle DNS resolution
    // Note: We pass the connection string directly to avoid parsing issues
    const poolConfig = {
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false // Required for Supabase
      },
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 60000, // Increased timeout for network issues
    };
    
    // Debug: Verify connection string one more time
    const testUrl = new URL(databaseUrl);
    if (testUrl.hostname !== url.hostname) {
      console.error('⚠️  WARNING: URL parsing inconsistency detected!');
      console.error(`⚠️  First parse hostname: ${url.hostname}`);
      console.error(`⚠️  Second parse hostname: ${testUrl.hostname}`);
    }
    
    pool = new Pool(poolConfig);

    // Test the connection
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Connected to Supabase PostgreSQL database');
    console.log('📊 Database time:', result.rows[0].now);
    
    // Verify tables exist
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log(`📋 Found ${tablesResult.rows.length} tables in database`);
    
    return pool;
  } catch (error) {
    console.error('❌ Supabase connection error:', error.message);
    console.error('❌ Full error:', error);
    pool = null;
    throw error;
  }
};

// Get database pool (for use in models)
const getPool = () => {
  if (!pool || pool.ended) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return pool;
};

// Close database connection
const closeDB = async () => {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('✅ Database connection closed');
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await closeDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDB();
  process.exit(0);
});

module.exports = { connectDB, getPool, closeDB };

