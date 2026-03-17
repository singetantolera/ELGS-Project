// const LegalContent = require('../models/LegalContent');
// const AppError = require('../utils/AppError');
// const catchAsync = require('../utils/catchAsync');

// // @desc    Search articles
// // @route   GET /api/search
// // @access  Public
// exports.search = catchAsync(async (req, res, next) => {
//   const { q, type, category, language, date, page = 1, limit = 10 } = req.query;
  
//   if (!q) {
//     return next(new AppError('Please provide a search query', 400));
//   }

//   const skip = (parseInt(page) - 1) * parseInt(limit);

//   // Build search query
//   const searchQuery = { status: 'published' };
  
//   // Text search
//   if (type === 'natural' || type === 'all') {
//     searchQuery.$text = { $search: q };
//   } else {
//     // Keyword search - search in titles
//     searchQuery.$or = [
//       { 'title.en': { $regex: q, $options: 'i' } },
//       { 'title.am': { $regex: q, $options: 'i' } },
//       { 'title.om': { $regex: q, $options: 'i' } }
//     ];
//   }

//   // Apply filters
//   if (category && category !== 'all') searchQuery.category = category;
//   if (language && language !== 'all') searchQuery.language = language;

//   // Date filter
//   if (date && date !== 'all') {
//     const now = new Date();
//     let startDate;
    
//     switch(date) {
//       case 'today':
//         startDate = new Date(now.setHours(0,0,0,0));
//         break;
//       case 'week':
//         startDate = new Date(now.setDate(now.getDate() - 7));
//         break;
//       case 'month':
//         startDate = new Date(now.setMonth(now.getMonth() - 1));
//         break;
//       case 'year':
//         startDate = new Date(now.setFullYear(now.getFullYear() - 1));
//         break;
//     }
    
//     if (startDate) {
//       searchQuery.createdAt = { $gte: startDate };
//     }
//   }

//   // Determine sort order
//   let sortOption = {};
//   if (type === 'natural') {
//     sortOption = { score: { $meta: 'textScore' } };
//   } else {
//     sortOption = { views: -1, createdAt: -1 };
//   }

//   // Execute search
//   const results = await LegalContent.find(
//     searchQuery,
//     type === 'natural' ? { score: { $meta: 'textScore' } } : {}
//   )
//     .sort(sortOption)
//     .skip(skip)
//     .limit(parseInt(limit))
//     .select('title category language excerpt views bookmarks updatedAt');

//   const total = await LegalContent.countDocuments(searchQuery);

//   res.status(200).json({
//     status: 'success',
//     results: results.length,
//     total,
//     page: parseInt(page),
//     pages: Math.ceil(total / parseInt(limit)),
//     results: results
//   });
// });

// // @desc    Get search suggestions
// // @route   GET /api/search/suggestions
// // @access  Public
// exports.getSuggestions = catchAsync(async (req, res, next) => {
//   const { q } = req.query;

//   if (!q || q.length < 2) {
//     return res.status(200).json({ suggestions: [] });
//   }

//   const suggestions = await LegalContent.find({
//     status: 'published',
//     $or: [
//       { 'title.en': { $regex: q, $options: 'i' } },
//       { 'title.am': { $regex: q, $options: 'i' } },
//       { 'title.om': { $regex: q, $options: 'i' } }
//     ]
//   })
//     .limit(5)
//     .select('title category');

//   res.status(200).json({
//     status: 'success',
//     suggestions: suggestions.map(s => ({
//       id: s._id,
//       text: s.title.en,
//       category: s.category
//     }))
//   });
// });

// // @desc    Get trending searches
// // @route   GET /api/search/trending
// // @access  Public
// exports.getTrendingSearches = catchAsync(async (req, res, next) => {
//   // This would typically come from analytics
//   // For now, return mock data
//   const trending = [
//     'divorce laws',
//     'employee rights',
//     'theft penalty',
//     'marriage requirements',
//     'termination benefits'
//   ];

//   res.status(200).json({
//     status: 'success',
//     trending
//   });
// });

// // @desc    Save search history (authenticated users)
// // @route   POST /api/search/history
// // @access  Private
// exports.saveSearchHistory = catchAsync(async (req, res, next) => {
//   const { searchTerm } = req.body;
//   const userId = req.user.id;

//   // This would save to a SearchHistory model
//   // For now, just return success

//   res.status(200).json({
//     status: 'success',
//     message: 'Search history saved'
//   });
// });

// // @desc    Get search history
// // @route   GET /api/search/history
// // @access  Private
// exports.getSearchHistory = catchAsync(async (req, res, next) => {
//   // This would fetch from SearchHistory model
//   // For now, return empty array
//   res.status(200).json({
//     status: 'success',
//     history: []
//   });
// });

// // @desc    Clear search history
// // @route   DELETE /api/search/history
// // @access  Private
// exports.clearSearchHistory = catchAsync(async (req, res, next) => {
//   // This would delete from SearchHistory model
//   res.status(204).json({
//     status: 'success',
//     data: null
//   });
// });


// Kana dabale
const LegalContent = require('../models/LegalContent');
const SearchHistory = require('../models/SearchHistory');
const SearchAnalytics = require('../models/SearchAnalytics');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// @desc    Search articles
// @route   GET /api/search
// @access  Public
exports.search = catchAsync(async (req, res, next) => {
  const { q, type, category, language, date, page = 1, limit = 10 } = req.query;
  
  if (!q) {
    return next(new AppError('Please provide a search query', 400));
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build search query
  const searchQuery = { status: 'published' };
  
  // Text search
  if (type === 'natural' || type === 'all') {
    searchQuery.$text = { $search: q };
  } else {
    // Keyword search - search in titles
    searchQuery.$or = [
      { 'title.en': { $regex: q, $options: 'i' } },
      { 'title.am': { $regex: q, $options: 'i' } },
      { 'title.om': { $regex: q, $options: 'i' } }
    ];
  }

  // Apply filters
  if (category && category !== 'all') searchQuery.category = category;
  if (language && language !== 'all') searchQuery.language = language;

  // Date filter
  if (date && date !== 'all') {
    const now = new Date();
    let startDate;
    
    switch(date) {
      case 'today':
        startDate = new Date(now.setHours(0,0,0,0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
    }
    
    if (startDate) {
      searchQuery.createdAt = { $gte: startDate };
    }
  }

  // Determine sort order
  let sortOption = {};
  if (type === 'natural') {
    sortOption = { score: { $meta: 'textScore' } };
  } else {
    sortOption = { views: -1, createdAt: -1 };
  }

  // Execute search
  const results = await LegalContent.find(
    searchQuery,
    type === 'natural' ? { score: { $meta: 'textScore' } } : {}
  )
    .sort(sortOption)
    .skip(skip)
    .limit(parseInt(limit))
    .select('title category language excerpt views bookmarks updatedAt');

  const total = await LegalContent.countDocuments(searchQuery);

  // Update analytics (async - don't wait)
  if (total > 0) {
    updateSearchAnalytics(q, results[0]?.category).catch(console.error);
  }

  res.status(200).json({
    status: 'success',
    results: results.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: results
  });
});

// Helper function to update search analytics
const updateSearchAnalytics = async (term, category) => {
  const analytics = await SearchAnalytics.findOneAndUpdate(
    { term: term.toLowerCase() },
    { 
      $inc: { count: 1 },
      $set: { 
        category: category || 'general',
        lastSearched: new Date()
      }
    },
    { upsert: true, new: true }
  );
  return analytics;
};

// @desc    Get search suggestions
// @route   GET /api/search/suggestions
// @access  Public
exports.getSuggestions = catchAsync(async (req, res, next) => {
  const { q } = req.query;

  if (!q || q.length < 2) {
    return res.status(200).json({ suggestions: [] });
  }

  const suggestions = await LegalContent.find({
    status: 'published',
    $or: [
      { 'title.en': { $regex: q, $options: 'i' } },
      { 'title.am': { $regex: q, $options: 'i' } },
      { 'title.om': { $regex: q, $options: 'i' } }
    ]
  })
    .limit(5)
    .select('title category');

  res.status(200).json({
    status: 'success',
    suggestions: suggestions.map(s => ({
      id: s._id,
      text: s.title.en,
      category: s.category
    }))
  });
});

// @desc    Get trending searches
// @route   GET /api/search/trending
// @access  Public
exports.getTrendingSearches = catchAsync(async (req, res, next) => {
  const trending = await SearchAnalytics.find()
    .sort({ count: -1, lastSearched: -1 })
    .limit(10)
    .select('term count category lastSearched');

  res.status(200).json({
    status: 'success',
    trending
  });
});

// @desc    Save search history (authenticated users)
// @route   POST /api/search/history
// @access  Private
exports.saveSearchHistory = catchAsync(async (req, res, next) => {
  const { searchTerm, resultsCount } = req.body;
  const userId = req.user.id;

  await SearchHistory.create({
    user: userId,
    term: searchTerm,
    results: resultsCount || 0
  });

  res.status(200).json({
    status: 'success',
    message: 'Search history saved'
  });
});

// @desc    Get search history
// @route   GET /api/search/history
// @access  Private
exports.getSearchHistory = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const history = await SearchHistory.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(20)
    .select('term results createdAt');

  res.status(200).json({
    status: 'success',
    history
  });
});

// @desc    Clear search history
// @route   DELETE /api/search/history
// @access  Private
exports.clearSearchHistory = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  await SearchHistory.deleteMany({ user: userId });

  res.status(200).json({
    status: 'success',
    message: 'Search history cleared'
  });
});

// @desc    Get search stats
// @route   GET /api/search/stats
// @access  Public
exports.getSearchStats = catchAsync(async (req, res, next) => {
  const totalSearches = await SearchAnalytics.aggregate([
    { $group: { _id: null, total: { $sum: '$count' } } }
  ]);

  const topCategories = await SearchAnalytics.aggregate([
    { $group: { _id: '$category', count: { $sum: '$count' } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  res.status(200).json({
    status: 'success',
    stats: {
      totalSearches: totalSearches[0]?.total || 0,
      topCategories,
      uniqueTerms: await SearchAnalytics.countDocuments()
    }
  });
});