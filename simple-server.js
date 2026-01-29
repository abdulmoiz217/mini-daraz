const express = require('express');
const path = require('path');
const app = express();

// Serve static files from public folder
app.use(express.static('public'));

// Serve login.html as the default page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Serve login page specifically
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Serve other pages
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Simple server running on http://localhost:${PORT}`);
  console.log(`Opening login page at: http://localhost:${PORT}/login`);
});