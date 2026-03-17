const express = require('express');
const bookmarkController = require('../controllers/bookmarkController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', bookmarkController.getBookmarks);
router.post('/', bookmarkController.addBookmark);
router.delete('/:id', bookmarkController.removeBookmark);
router.get('/check/:articleId', bookmarkController.checkBookmark);
router.get('/collections', bookmarkController.getCollections);
router.post('/collections', bookmarkController.createCollection);
router.put('/:id/move', bookmarkController.moveToCollection);
router.get('/export', bookmarkController.exportBookmarks);

module.exports = router;