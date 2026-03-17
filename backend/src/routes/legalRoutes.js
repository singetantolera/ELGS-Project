const express = require('express');
const legalController = require('../controllers/legalController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

const router = express.Router();

// Public routes
router.get('/categories', legalController.getCategories);
router.get('/categories/:id', legalController.getCategory);
router.get('/articles', legalController.getArticles);
router.get('/articles/:id', legalController.getArticle);
router.get('/trending', legalController.getTrendingArticles);

// Admin only routes
router.use(protect);
router.use(isAdmin);

router.post('/articles', legalController.createArticle);
router.put('/articles/:id', legalController.updateArticle);
router.delete('/articles/:id', legalController.deleteArticle);

module.exports = router;