


 

/********************************************************************************* 

* WEB322 – Assignment 06 

* I declare that this assignment is my own work in accordance with Seneca Academic Policy. 

* No part of this assignment has been copied manually or electronically from any other source 

* (including web sites) or distributed to other students. 

* 

* Name: vivek krishna ombalmurikkal vinod Student ID: 129478236_  Date: 16-4-2025________________ 

* 

* Vercel Web App URL: ________________________________________________________ 

* 

* GitHub Repository URL: ______________________________________________________ 

* 

********************************************************************************/ 


const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const clientSessions = require('client-sessions');
const app = express();

const users = [];

app.use(clientSessions({
  cookieName: 'session',
  secret: 'veryLongRandomSecretString123!',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.post('/register', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).send('All fields are required.');
  }

  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match.');
  }

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).send('Email is already registered.');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({ username, email, password: hashedPassword });

    console.log(`User registered: ${username} (${email})`);
    res.send('Registration successful!');
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('An error occurred during registration.');
  }
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required.');
  }

  try {
    const user = users.find(u => u.email === email);

    if (user && await bcrypt.compare(password, user.password)) {
      req.session.user = { email: user.email, username: user.username };
      res.redirect('/dashboard');
    } else {
      res.status(400).send('Invalid email or password.');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('An error occurred during login.');
  }
});

app.get('/dashboard', ensureLogin, (req, res) => {
  const user = req.session.user;
  res.send(`
    <h1>Welcome, ${user.username}!</h1>
    <p>Email: ${user.email}</p>
    <p>This is your personalized dashboard. 🎉</p>
    <form action="/logout" method="POST">
      <button type="submit">Logout</button>
    </form>
  `);
});

app.post('/logout', (req, res) => {
  req.session.reset();
  res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
