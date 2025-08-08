// backend/controllers/authController.js

const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt =require('jsonwebtoken');

// --- registerUser function remains the same ---
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const [existingUser] = await db.query('SELECT email FROM MEMBERS WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await db.query(
      'INSERT INTO MEMBERS (name, email, phone, passwd) VALUES (?, ?, ?, ?)',
      [name, email, phone, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// --- Add the new loginUser function ---
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // 2. Find user by email
    const [users] = await db.query('SELECT * FROM MEMBERS WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' }); // 401 Unauthorized
    }
    const user = users[0];

    // 3. Compare passwords
    const isMatch = await bcrypt.compare(password, user.passwd);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // 4. Generate JWT
    const payload = {
      id: user.id,
      role: user.role
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Token expires in 1 day
    );

    // 5. Send response
    res.status(200).json({
      message: 'Login successful!',
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

module.exports = { registerUser, loginUser };