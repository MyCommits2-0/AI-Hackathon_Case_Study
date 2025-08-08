const express = require('express');
// Import both controller functions
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

// Define the registration route
// POST /api/auth/register
router.post('/register', registerUser);

// Define the login route
// POST /api/auth/login
router.post('/login', loginUser); // <-- Add this line

module.exports = router;