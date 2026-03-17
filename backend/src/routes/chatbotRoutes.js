const express = require('express');
const chatbotController = require('../controllers/chatbotController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Conversations
router.post('/conversations', chatbotController.createConversation);
router.get('/conversations', chatbotController.getConversations);
router.get('/conversations/:id', chatbotController.getConversation);
router.delete('/conversations/:id', chatbotController.clearConversation);

// Messages
router.post('/message', chatbotController.sendMessage);

// History & suggestions
router.get('/history', chatbotController.getChatHistory);
router.get('/suggested-questions', chatbotController.getSuggestedQuestions);

module.exports = router;