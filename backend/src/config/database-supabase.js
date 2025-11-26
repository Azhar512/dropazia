// Supabase PostgreSQL Database Connection
// Environment variables are loaded in server.js - no file system access needed
const { Pool } = require('pg');

// Cache the connection pool
let pool = null;

const connectDB = async () => {
  try {
    // If pool already exists and is connected, return it
    if (pool && !pool.ended) {
      // Test connection
      try {
        await pool.query('SELECT 1');
        return pool;
      } catch (error) {
        // Connection lost, create new pool
        pool = null;
      }
    }

    const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL;
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    // Validate connection string format
    if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
      throw new Error('Invalid DATABASE_URL format - must start with postgresql://');
    }

    // Parse and validate connection string
    let url;
    try {
      url = new URL(databaseUrl);
      
      // Warn if using direct connection instead of pooler
      if (url.hostname.includes('db.') && url.hostname.endsWith('.supabase.co')) {
        console.warn('⚠️  Warning: Using direct database connection. Use pooler URL for better performance: aws-0-[REGION].pooler.supabase.com');
      }
    } catch (parseError) {
      throw new Error('Invalid DATABASE_URL format: ' + parseError.message);
    }
    
    // Create connection pool optimized for serverless (Vercel)
    // IMPORTANT: Vercel serverless requires minimal connection pooling
    const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
    
    const poolConfig = {
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false // Required for Supabase
      },
      // Serverless optimization: Use single connection per function instance
      max: isServerless ? 1 : 10, // 1 for serverless, 10 for traditional servers
      idleTimeoutMillis: isServerless ? 0 : 30000, // Keep alive in serverless
      connectionTimeoutMillis: 10000, // 10 second timeout
      allowExitOnIdle: isServerless, // Allow cleanup in serverless
    };
    
    pool = new Pool(poolConfig);

    // Test the connection
    await pool.query('SELECT 1');
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ Connected to Supabase PostgreSQL database');
    }
    
    return pool;
  } catch (error) {
    pool = null;
    throw new Error('Database connection failed: ' + error.message);
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

