const express = require('express');
const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const contentService = require('./content-service');

const app = express();
const PORT = 3000;

cloudinary.config({
  cloud_name: 'your-cloud-name',
  api_key: 'your-api-key',
  api_secret: 'your-api-secret'
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', (req, res) => {
  res.render('home', { title: 'Home Page', message: 'Welcome to the Home Page!' });
});

// Render the add article page with categories
app.get('/articles/add', (req, res) => {
  let errorMessage = null;
  contentService.getCategories()
    .then(categories => {
      res.render('addArticle', { categories, errorMessage });
    })
    .catch(err => {
      res.render('addArticle', { categories: [], errorMessage: 'Failed to load categories' });
    });
});

// Handle the submission of a new article
app.post('/articles/add', multer().single('featureImage'), (req, res) => {
  const { title, content, category, published } = req.body;
  const featureImage = req.file;

  if (!featureImage) {
    return res.render('addArticle', { errorMessage: 'Feature image is required', categories: [] });
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: 'articles' },
    (error, result) => {
      if (error) {
        return res.render('addArticle', { errorMessage: 'Image upload failed', categories: [] });
      }

      // Build the article data, including the Cloudinary image URL
      const articleData = {
        title: title,
        content: content,
        category: category,
        published: published === 'true', // convert string to boolean
        featureImage: result.secure_url,
        publishedDate: new Date().toISOString().split('T')[0]
      };

      // Add the article using the content service
      contentService.addArticle(articleData)
        .then(newArticle => {
          res.redirect('/articles');
        })
        .catch(err => {
          res.render('addArticle', { errorMessage: 'Failed to add article', categories: [] });
        });
    }
  );

  streamifier.createReadStream(featureImage.buffer).pipe(uploadStream);
});

// Render the list of all articles
app.get('/articles', (req, res) => {
  contentService.getAllArticles()
    .then(articles => {
      res.render('articles', { articles, errorMessage: null });
    })
    .catch(err => {
      res.render('articles', { articles: [], errorMessage: 'Failed to load articles' });
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
