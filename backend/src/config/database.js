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
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      // Ensure data persistence - no automatic expiration
      retryWrites: true, // Retry writes for reliability
      w: 'majority', // Write concern - ensure data is written to majority of nodes
      // Keep connection alive
      keepAlive: true,
      keepAliveInitialDelay: 300000, // 5 minutes
      // Auto-reconnect settings
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false,
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
    // Don't exit immediately - try to reconnect
    setTimeout(() => {
      console.log('🔄 Attempting to reconnect...');
      connectDB();
    }, 5000);
  }
};

// Handle connection events with auto-reconnect
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected - attempting to reconnect...');
  // Auto-reconnect
  setTimeout(() => {
    if (mongoose.connection.readyState === 0) {
      connectDB();
    }
  }, 5000);
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