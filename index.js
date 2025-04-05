const express = require('express');
const contentService = require('./content-service');

const app = express();
const PORT = 3000; // Change to a unique port

// Serve static files from public folder
app.use(express.static('public'));

// Initialize content service
contentService.initialize()
    .then(() => console.log("Data initialized successfully"))
    .catch(err => console.log(err));

// Redirect root ("/") to "/about"
app.get('/', (req, res) => {
    res.redirect('/about');
});

// Serve about.html
app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/views/about.html');
});

// Get all articles
app.get('/articles', (req, res) => {
    contentService.getAllArticles()
        .then(data => res.json(data))
        .catch(err => res.status(404).json({ message: err }));
});

// Get published articles
app.get('/articles/published', (req, res) => {
    contentService.getPublishedArticles()
        .then(data => res.json(data))
        .catch(err => res.status(404).json({ message: err }));
});

// Get all categories
app.get('/categories', (req, res) => {
    contentService.getCategories()
        .then(data => res.json(data))
        .catch(err => res.status(404).json({ message: err }));
});

// Start server
app.listen(PORT, () => {
    console.log(`Express http server listening on port ${PORT}`);
});
