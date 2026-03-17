// const express = require('express');
// const searchController = require('../controllers/searchController');
// const { protect } = require('../middleware/auth');

// const router = express.Router();

// // Public routes
// router.get('/', searchController.search);
// router.get('/suggestions', searchController.getSuggestions);
// router.get('/trending', searchController.getTrendingSearches);

// // Protected routes
// router.use(protect);

// router.post('/history', searchController.saveSearchHistory);
// router.get('/history', searchController.getSearchHistory);
// router.delete('/history', searchController.clearSearchHistory);

// module.exports = router;

// Kana dabale
const express = require('express');
const searchController = require('../controllers/searchController');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', searchController.search);
router.get('/suggestions', searchController.getSuggestions);
router.get('/trending', searchController.getTrendingSearches);
router.get('/stats', searchController.getSearchStats);

// Protected routes
router.post('/history', protect, searchController.saveSearchHistory);
router.get('/history', protect, searchController.getSearchHistory);
router.delete('/history', protect, searchController.clearSearchHistory);

module.exports = router;