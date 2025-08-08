// Import required packages

const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Loads environment variables from a .env file
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const memberRoutes = require('./routes/memberRoutes');
const issueRoutes = require('./routes/issueRoutes');


// Create an Express application
const app = express();


// Define the port the server will run on.
// It will use the port from the .env file or default to 5001 to avoid conflicts
const PORT = process.env.PORT || 5001;

// Apply middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Allow the server to accept JSON in request bodies

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes); 
app.use('/api/issue', issueRoutes); 


// A simple test route to confirm the server is working
app.get('/', (req, res) => {
  res.send('Library Management System API is running...');
});

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});