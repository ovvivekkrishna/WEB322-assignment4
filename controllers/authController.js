const bcrypt = require('bcrypt');
const User = require('../models/User');
const { sessionSecret } = require('../config/config');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send('User not found');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');
    req.session.user = user;
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).send('User already exists');
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send('Failed to log out');
    res.redirect('/');
  });
};
