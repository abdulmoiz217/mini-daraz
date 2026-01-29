const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

// Serve static files from public folder
app.use(express.static('public'));

// Basic API endpoints that return mock data to prevent frontend errors
app.get('/api/auth/check-session', (req, res) => {
  res.json({ authenticated: false, user: null });
});

app.post('/api/auth/login', (req, res) => {
  // Mock login that returns an error to indicate DB is not connected
  res.status(500).json({
    error: 'Database connection error. Please check your database configuration.',
    message: 'Login temporarily unavailable due to database connection issues.'
  });
});

app.post('/api/auth/register', (req, res) => {
  // Mock registration that returns an error to indicate DB is not connected
  res.status(500).json({
    error: 'Database connection error. Please check your database configuration.',
    message: 'Registration temporarily unavailable due to database connection issues.'
  });
});

// Serve login.html as the default page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Explicit route for login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Other routes
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'profile.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Temporary server running on http://localhost:${PORT}`);
  console.log(`Open your browser and go to: http://localhost:${PORT}/login`);
  console.log('');
  console.log('Note: Database connection failed, but static files are served.');
  console.log('Login functionality will not work until the database connection is fixed.');
});