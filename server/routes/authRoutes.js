const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 👇 THIS WAS THE FIX: Use '../' to go up to the server folder first
const User = require('../models/User'); 

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

router.post('/register', async (req, res) => {
  const { name, email, password, role, employeeId, department } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // The hashing happens in the User model pre-save hook, or you can do it here if needed
    const user = await User.create({ name, email, password, role, employeeId, department });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
const { protect } = require('../middleware/authMiddleware'); // Import protect at top

router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    
    // Check if user exists and password matches
    // Note: If you seeded the data, the password is plain text '123' unless you hashed it in seed.js
    if (user && (user.password === password || (user.matchPassword && await user.matchPassword(password)))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;