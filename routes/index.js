const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Assuming you have a User model
const router = express.Router();

// POST route for user login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }
    req.session.user = user;
    res.send('Login successful');
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// POST route for user registration
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.send('Registration successful');
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// POST route for user logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Failed to log out');
    }
    res.send('Logout successful');
  });
});

module.exports = router;
