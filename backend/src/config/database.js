const mongoose = require('mongoose');
require('dotenv').config();

// Cache the connection promise to avoid multiple simultaneous connections
let connectionPromise = null;

const connectDB = async () => {
  try {
    // If already connected, return immediately
    if (mongoose.connection.readyState === 1) {
      console.log('✅ Already connected to MongoDB');
      return mongoose.connection;
    }

    // If connection is in progress, wait for it
    if (connectionPromise) {
      console.log('⏳ Connection already in progress, waiting...');
      return await connectionPromise;
    }

    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('❌ MONGODB_URI environment variable is not set!');
      throw new Error('MONGODB_URI not configured');
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
    
    // Create connection promise and cache it
    connectionPromise = mongoose.connect(mongoURI, connectionOptions);

    await connectionPromise;

    console.log('✅ Connected to MongoDB database');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🔒 Data persistence: ENABLED (no automatic deletion)');
    
    // Verify connection is stable
    const state = mongoose.connection.readyState;
    if (state === 1) {
      console.log('✅ Database connection is stable and ready');
    }

    // Clear the promise after successful connection
    connectionPromise = null;
    
    return mongoose.connection;
  } catch (error) {
    // Clear the promise on error so we can retry
    connectionPromise = null;
    console.error('❌ MongoDB connection error:', error.message);
    console.error('❌ Full error:', error);
    throw error;
  }
};

// Handle connection events with auto-reconnect
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
  connectionPromise = null; // Clear promise on disconnect
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
  connectionPromise = null; // Clear promise on error
  // Don't exit - allow retry logic to handle reconnection
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected successfully');
  connectionPromise = null;
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
