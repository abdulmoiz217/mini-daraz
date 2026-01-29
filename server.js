const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/database');

// Load environment variables
dotenv.config();

const app = express();

// Connect to PostgreSQL
connectDB();

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
  res.json({ message: 'E-commerce API is running!' });
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

// Export the app for Vercel serverless functions
module.exports = app;

// Only start the server if running directly (not on Vercel)
if (require.main === module) {
  const PORT = process.env.PORT || 5000; // Will use Vercel's port or default to 5000

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
