const LegalContent = require('../models/LegalContent');
const Category = require('../models/Category');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// @desc    Get all categories
// @route   GET /api/legal/categories
// @access  Public
exports.getCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find({ isActive: true }).sort('order');
  
  res.status(200).json({
    status: 'success',
    results: categories.length,
    categories
  });
});

// @desc    Get category by ID
// @route   GET /api/legal/categories/:id
// @access  Public
exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findOne({ 
    id: req.params.id,
    isActive: true 
  });

  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  res.status(200).json({
    status: 'success',
    category
  });
});

// @desc    Get articles with pagination
// @route   GET /api/legal/articles
// @access  Public
exports.getArticles = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const category = req.query.category;
  const language = req.query.language;
  const status = req.query.status || 'published';

  // Build query
  const query = { status };
  if (category && category !== 'all') query.category = category;
  if (language && language !== 'all') query.language = language;

  // Execute query
  const articles = await LegalContent.find(query)
    .sort('-createdAt')
    .skip(skip)
    .limit(limit)
    .populate('createdBy', 'fullName');

  const total = await LegalContent.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: articles.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    articles
  });
});

// @desc    Get single article
// @route   GET /api/legal/articles/:id
// @access  Public
exports.getArticle = catchAsync(async (req, res, next) => {
  const article = await LegalContent.findById(req.params.id)
    .populate('createdBy', 'fullName')
    .populate('updatedBy', 'fullName');

  if (!article) {
    return next(new AppError('Article not found', 404));
  }

  // Increment view count
  await article.incrementViews();

  // Get related articles
  const related = await LegalContent.find({
    category: article.category,
    _id: { $ne: article._id },
    status: 'published'
  })
    .limit(5)
    .select('title category');

  res.status(200).json({
    status: 'success',
    article,
    related
  });
});

// @desc    Create article (Admin only)
// @route   POST /api/legal/articles
// @access  Private/Admin
exports.createArticle = catchAsync(async (req, res, next) => {
  const articleData = {
    ...req.body,
    createdBy: req.user.id
  };

  const article = await LegalContent.create(articleData);

  // Update category article count
  const category = await Category.findOne({ id: article.category });
  if (category) {
    await category.updateArticleCount();
  }

  res.status(201).json({
    status: 'success',
    article
  });
});

// @desc    Update article (Admin only)
// @route   PUT /api/legal/articles/:id
// @access  Private/Admin
exports.updateArticle = catchAsync(async (req, res, next) => {
  const article = await LegalContent.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      updatedBy: req.user.id
    },
    { new: true, runValidators: true }
  );

  if (!article) {
    return next(new AppError('Article not found', 404));
  }

  // Update category article count if category changed
  if (req.body.category) {
    const oldCategory = await Category.findOne({ id: article.category });
    const newCategory = await Category.findOne({ id: req.body.category });
    
    if (oldCategory) await oldCategory.updateArticleCount();
    if (newCategory) await newCategory.updateArticleCount();
  }

  res.status(200).json({
    status: 'success',
    article
  });
});

// @desc    Delete article (Admin only)
// @route   DELETE /api/legal/articles/:id
// @access  Private/Admin
exports.deleteArticle = catchAsync(async (req, res, next) => {
  const article = await LegalContent.findById(req.params.id);

  if (!article) {
    return next(new AppError('Article not found', 404));
  }

  await article.remove();

  // Update category article count
  const category = await Category.findOne({ id: article.category });
  if (category) {
    await category.updateArticleCount();
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// @desc    Get trending articles
// @route   GET /api/legal/trending
// @access  Public
exports.getTrendingArticles = catchAsync(async (req, res, next) => {
  const articles = await LegalContent.find({ status: 'published' })
    .sort('-views -bookmarks -createdAt')
    .limit(10)
    .select('title category views bookmarks');

  res.status(200).json({
    status: 'success',
    results: articles.length,
    articles
  });
});