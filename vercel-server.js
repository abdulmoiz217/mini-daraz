// Vercel-compatible server entry point
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/database');

// Load environment variables
dotenv.config();

const app = express();

// Database connection with error handling
const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    // Vercel par process.exit(1) mat karna, warna function fail dikhayega
  }
};

startServer();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Serve static files from public folder
app.use(express.static('public'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'E-commerce API is running on Vercel!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Export for Vercel
module.exports = app;