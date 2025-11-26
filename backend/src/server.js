// Import dependencies
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline scripts for frontend
  crossOriginEmbedderPolicy: false
}));

// Rate limiting - prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all API routes
app.use('/api/', limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' })); // Limit request body size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --------------------
// ✅ CORS SETUP - Environment Based
// --------------------
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

// Add development origins automatically
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:3000', 'http://localhost:8080', 'http://localhost:5173');
}

// Validate that we have at least one allowed origin
if (allowedOrigins.length === 0) {
  console.warn('⚠️  Warning: No ALLOWED_ORIGINS set. CORS will block all requests!');
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) {
        return callback(null, true);
      }
      
      if (allowedOrigins.includes(origin)) {
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
const payfastRoutes = require('./routes/payfast');

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
app.use('/api/auth', authLimiter, authRoutes);
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
app.use('/api/payfast', payfastRoutes);

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
