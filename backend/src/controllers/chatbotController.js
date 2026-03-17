const Conversation = require('../models/Conversation');
const LegalContent = require('../models/LegalContent');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const chatbotService = require('../services/chatbotService');

// @desc    Create new conversation
// @route   POST /api/chatbot/conversations
// @access  Private
exports.createConversation = catchAsync(async (req, res, next) => {
  const conversation = await Conversation.create({
    user: req.user.id,
    messages: []
  });

  res.status(201).json({
    status: 'success',
    conversationId: conversation._id
  });
});

// @desc    Get user conversations
// @route   GET /api/chatbot/conversations
// @access  Private
exports.getConversations = catchAsync(async (req, res, next) => {
  const conversations = await Conversation.find({ user: req.user.id })
    .sort({ updatedAt: -1 })
    .limit(20);

  res.status(200).json({
    status: 'success',
    conversations
  });
});

// @desc    Send message to chatbot
// @route   POST /api/chatbot/message
// @access  Private
exports.sendMessage = catchAsync(async (req, res, next) => {
  const { message, conversationId, language = 'en' } = req.body;

  if (!message) {
    return next(new AppError('Please provide a message', 400));
  }

  let conversation;
  
  if (conversationId) {
    conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return next(new AppError('Conversation not found', 404));
    }
    
    // Check if user owns this conversation
    if (conversation.user.toString() !== req.user.id) {
      return next(new AppError('You do not have permission to access this conversation', 403));
    }
  } else {
    // Create new conversation
    conversation = await Conversation.create({
      user: req.user.id,
      messages: []
    });
  }

  // Add user message
  conversation.messages.push({
    role: 'user',
    content: message
  });

  // Get bot response
  const botResponse = await chatbotService.processMessage(message, language);

  // Add bot response
  conversation.messages.push({
    role: 'assistant',
    content: botResponse.response
  });

  // Update conversation title if it's the first message
  if (conversation.messages.length === 2) {
    conversation.title = message.substring(0, 50) + (message.length > 50 ? '...' : '');
  }

  await conversation.save();

  res.status(200).json({
    status: 'success',
    message: botResponse.response,
    conversationId: conversation._id,
    sources: botResponse.sources || [],
    quickReplies: botResponse.quickReplies || []
  });
});

// @desc    Get conversation history
// @route   GET /api/chatbot/history
// @access  Private
exports.getChatHistory = catchAsync(async (req, res, next) => {
  const { limit = 10 } = req.query;

  const conversations = await Conversation.find({ user: req.user.id })
    .sort({ updatedAt: -1 })
    .limit(parseInt(limit))
    .select('title updatedAt');

  res.status(200).json({
    status: 'success',
    conversations
  });
});

// @desc    Get conversation by ID
// @route   GET /api/chatbot/conversations/:id
// @access  Private
exports.getConversation = catchAsync(async (req, res, next) => {
  const conversation = await Conversation.findById(req.params.id);

  if (!conversation) {
    return next(new AppError('Conversation not found', 404));
  }

  if (conversation.user.toString() !== req.user.id) {
    return next(new AppError('You do not have permission to access this conversation', 403));
  }

  res.status(200).json({
    status: 'success',
    conversation
  });
});

// @desc    Clear conversation
// @route   DELETE /api/chatbot/conversations/:id
// @access  Private
exports.clearConversation = catchAsync(async (req, res, next) => {
  const conversation = await Conversation.findById(req.params.id);

  if (!conversation) {
    return next(new AppError('Conversation not found', 404));
  }

  if (conversation.user.toString() !== req.user.id) {
    return next(new AppError('You do not have permission to delete this conversation', 403));
  }

  await conversation.deleteOne();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// @desc    Get suggested questions
// @route   GET /api/chatbot/suggested-questions
// @access  Public
exports.getSuggestedQuestions = catchAsync(async (req, res, next) => {
  const { language = 'en' } = req.query;

  const suggestions = chatbotService.getSuggestedQuestions(language);

  res.status(200).json({
    status: 'success',
    questions: suggestions.map((text, index) => ({
      id: index + 1,
      text,
      category: index === 0 ? 'Family Law' : index === 1 ? 'Criminal Law' : 'Labor Law'
    }))
  });
});