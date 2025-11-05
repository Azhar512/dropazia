// Import dependencies
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------
// ✅ FIXED CORS SETUP
// --------------------
const allowedOrigins = [
  'https://dropazia.online',
  'https://www.dropazia.online',
  'http://localhost:3000', // for local testing
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error('❌ CORS blocked request from:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Handle preflight (OPTIONS) requests
app.options('*', cors());

// --------------------
// ✅ ROUTE IMPORTS
// --------------------
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/products');
const analyticsRoutes = require('./routes/analytics');
const profitsRoutes = require('./routes/profits');
const wishlistRoutes = require('./routes/wishlist');
const returnsRoutes = require('./routes/returns');
const usersRoutes = require('./routes/users');
const walletRoutes = require('./routes/wallet');

// --------------------
// ✅ HEALTH CHECK
// --------------------
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// --------------------
// ✅ API ROUTES
// --------------------
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/super-admin', require('./routes/superAdmin'));
app.use('/api/analytics', analyticsRoutes);
app.use('/api/profits', profitsRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/returns', returnsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/wallet', walletRoutes);

// --------------------
// ✅ 404 HANDLER
// --------------------
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// --------------------
// ✅ GLOBAL ERROR HANDLER
// --------------------
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
});

// --------------------
// ✅ SERVER START (Local / Vercel Compatible)
// --------------------
const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  });
} else {
  console.log('🌐 Serverless environment detected (Vercel/Lambda)');
  console.log('📊 Environment:', process.env.NODE_ENV || 'production');
}

module.exports = app;
