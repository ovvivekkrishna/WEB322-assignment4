const fs = require('fs');

let articles = [];
let categories = [
  { id: 1, name: 'Tech' },
  { id: 2, name: 'Lifestyle' },
  { id: 3, name: 'Health' }
];


function initialize() {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/articles.json', 'utf8', (err, data) => {
            if (err) {
                console.log("Unable to read articles file, using in-memory data.");
                
                articles = [
                    { id: 1, title: 'Article 1', categoryId: 1, categoryName: 'Tech', published: true },
                    { id: 2, title: 'Article 2', categoryId: 2, categoryName: 'Lifestyle', published: false }
                ];
                resolve();
                return;
            }
            articles = JSON.parse(data);

            fs.readFile('./data/categories.json', 'utf8', (err, data) => {
                if (err) {
                    console.log("Unable to read categories file, using in-memory categories.");
                     
                    categories = [
                        { id: 1, name: 'Tech' },
                        { id: 2, name: 'Lifestyle' },
                        { id: 3, name: 'Health' }
                    ];
                    resolve();
                    return;
                }
                categories = JSON.parse(data);
                resolve();
            });
        });
    });
}


function addArticle(articleData) {
    return new Promise((resolve) => {
        articleData.id = articles.length + 1;
        const cat = categories.find(c => c.id == articleData.category || c.name === articleData.category);
        articleData.categoryId = cat ? cat.id : articleData.category;
        articleData.categoryName = cat ? cat.name : 'Unknown';
        if (!articleData.publishedDate) {
            articleData.publishedDate = new Date().toISOString().split('T')[0];
        }
        articles.push(articleData);
        resolve(articleData);
    });
}

function getAllArticles() {
    return new Promise((resolve, reject) => {
        if (articles.length > 0) {
            resolve(articles);
        } else {
            reject("No results returned");
        }
    });
}

function getArticlesByCategory(categoryId) {
    const filtered = articles.filter(article => article.categoryId == categoryId);
    if (filtered.length) {
        return Promise.resolve(filtered);
    } else {
        return Promise.reject("No results returned");
    }
}

function getArticleById(id) {
    return articles.find(article => article.id == id);
}

function getCategories() {
    return new Promise((resolve, reject) => {
        if (categories.length > 0) {
            resolve(categories);
        } else {
            reject("No categories found");
        }
    });
}

function getPublishedArticles() {
    return new Promise((resolve, reject) => {
        let publishedArticles = articles.filter(article => article.published === true);
        if (publishedArticles.length > 0) {
            resolve(publishedArticles);
        } else {
            reject("No published articles found");
        }
    });
}

module.exports = { 
    initialize, 
    addArticle, 
    getAllArticles, 
    getArticlesByCategory, 
    getArticleById, 
    getCategories,
    getPublishedArticles 
};
