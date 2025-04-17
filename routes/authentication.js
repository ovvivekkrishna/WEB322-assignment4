const bcrypt = require('bcrypt');
const User = require('../models/User');

async function registerUser(req, res) {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(500).send('Server error');
  }
}

async function loginUser(req, res) {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }

    req.session.user = user;

    res.status(200).send('Login successful');
  } catch (error) {
    res.status(500).send('Server error');
  }
}

module.exports = { registerUser, loginUser };
