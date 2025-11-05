// ⚠️ DEPRECATED: This file is kept for reference only
// The application now uses Supabase PostgreSQL via database-supabase.js
// This file should NOT be used in production

const mongoose = require('mongoose');
require('dotenv').config();

console.warn('⚠️  WARNING: database.js is DEPRECATED');
console.warn('⚠️  This application uses Supabase PostgreSQL');
console.warn('⚠️  Please use database-supabase.js instead');
console.warn('⚠️  This file is kept for reference only\n');

// Cache the connection promise to avoid multiple simultaneous connections
let connectionPromise = null;

const connectDB = async () => {
  try {
    console.error('❌ ERROR: Attempted to use deprecated MongoDB connection');
    console.error('❌ This application has been migrated to Supabase PostgreSQL');
    console.error('❌ Please update your code to use database-supabase.js');
    throw new Error('MongoDB connection is deprecated. Use Supabase instead.');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
};

module.exports = connectDB;
