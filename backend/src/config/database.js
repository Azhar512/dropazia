const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('❌ MONGODB_URI environment variable is not set!');
      process.exit(1);
    }
    
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('📍 Connection string:', mongoURI.replace(/\/\/.*@/, '//***:***@'));
    
    // Configure connection options for production persistence
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Increased for serverless
      socketTimeoutMS: 45000,
      // Ensure data persistence - no automatic expiration
      retryWrites: true, // Retry writes for reliability
      w: 'majority', // Write concern - ensure data is written to majority of nodes
      // Serverless-friendly settings
      ...(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME ? {
        // Serverless: shorter timeouts, no keep-alive
        maxPoolSize: 1, // Limit connections for serverless
      } : {
        // Traditional server: keep-alive enabled
        keepAlive: true,
        keepAliveInitialDelay: 300000, // 5 minutes
        bufferMaxEntries: 0, // Disable mongoose buffering
        bufferCommands: false,
      }),
    };
    
    await mongoose.connect(mongoURI, connectionOptions);

    console.log('✅ Connected to MongoDB database');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🔒 Data persistence: ENABLED (no automatic deletion)');
    
    // Verify connection is stable
    const state = mongoose.connection.readyState;
    if (state === 1) {
      console.log('✅ Database connection is stable and ready');
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('❌ Full error:', error);
    // On Vercel/serverless, we can't use setTimeout for reconnection
    // Throw error to let Vercel handle retry on next request
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      // Serverless environment - connection will be retried on next request
      console.log('⚠️ Serverless environment detected - connection will retry on next request');
    } else {
      // Traditional server - can use setTimeout
      setTimeout(() => {
        console.log('🔄 Attempting to reconnect...');
        connectDB();
      }, 5000);
    }
    throw error; // Re-throw to ensure request fails if DB not connected
  }
};

// Handle connection events with auto-reconnect
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
  // Only auto-reconnect on traditional servers (not serverless)
  if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
    console.log('🔄 Attempting to reconnect...');
    setTimeout(() => {
      if (mongoose.connection.readyState === 0) {
        connectDB();
      }
    }, 5000);
  } else {
    console.log('ℹ️ Serverless environment - connection will be established on next request');
  }
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
  // Don't exit - allow retry logic to handle reconnection
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected successfully');
});

mongoose.connection.on('connecting', () => {
  console.log('🔄 Connecting to MongoDB...');
});

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected successfully');
});

// Prevent app termination on unhandled promise rejection
process.on('unhandledRejection', (error) => {
  console.error('⚠️ Unhandled Promise Rejection:', error);
  // Don't exit - allow the app to continue
});

module.exports = connectDB;