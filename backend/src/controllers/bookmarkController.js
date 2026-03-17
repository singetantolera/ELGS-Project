// const Bookmark = require('../models/Bookmark');
// const LegalContent = require('../models/LegalContent');
// const AppError = require('../utils/AppError');
// const catchAsync = require('../utils/catchAsync');

// // @desc    Get user bookmarks
// // @route   GET /api/bookmarks
// // @access  Private
// exports.getBookmarks = catchAsync(async (req, res, next) => {
//   const { collection, page = 1, limit = 10 } = req.query;
//   const skip = (parseInt(page) - 1) * parseInt(limit);

//   const query = { user: req.user.id };
//   if (collection && collection !== 'all') {
//     query.collection = collection;
//   }

//   const bookmarks = await Bookmark.find(query)
//     .sort('-createdAt')
//     .skip(skip)
//     .limit(parseInt(limit))
//     .populate('content');

//   const total = await Bookmark.countDocuments(query);

//   res.status(200).json({
//     status: 'success',
//     results: bookmarks.length,
//     total,
//     page: parseInt(page),
//     pages: Math.ceil(total / parseInt(limit)),
//     bookmarks
//   });
// });

// // @desc    Add bookmark
// // @route   POST /api/bookmarks
// // @access  Private
// exports.addBookmark = catchAsync(async (req, res, next) => {
//   const { articleId, collection, notes, tags } = req.body;

//   // Check if article exists
//   const article = await LegalContent.findById(articleId);
//   if (!article) {
//     return next(new AppError('Article not found', 404));
//   }

//   // Check if already bookmarked
//   const existing = await Bookmark.findOne({
//     user: req.user.id,
//     content: articleId
//   });

//   if (existing) {
//     return next(new AppError('Article already bookmarked', 400));
//   }

//   // Create bookmark
//   const bookmark = await Bookmark.create({
//     user: req.user.id,
//     content: articleId,
//     collection: collection || 'default',
//     notes,
//     tags
//   });

//   // Update user's bookmark count
//   const User = require('../models/User');
//   await User.findByIdAndUpdate(req.user.id, {
//     $inc: { 'stats.bookmarks': 1 }
//   });

//   res.status(201).json({
//     status: 'success',
//     bookmark: {
//       id: bookmark._id,
//       collection: bookmark.collection,
//       createdAt: bookmark.createdAt
//     }
//   });
// });

// // @desc    Remove bookmark
// // @route   DELETE /api/bookmarks/:id
// // @access  Private
// exports.removeBookmark = catchAsync(async (req, res, next) => {
//   const bookmark = await Bookmark.findOne({
//     _id: req.params.id,
//     user: req.user.id
//   });

//   if (!bookmark) {
//     return next(new AppError('Bookmark not found', 404));
//   }

//   await bookmark.remove();

//   // Update user's bookmark count
//   const User = require('../models/User');
//   await User.findByIdAndUpdate(req.user.id, {
//     $inc: { 'stats.bookmarks': -1 }
//   });

//   res.status(204).json({
//     status: 'success',
//     data: null
//   });
// });

// // @desc    Check if article is bookmarked
// // @route   GET /api/bookmarks/check/:articleId
// // @access  Private
// exports.checkBookmark = catchAsync(async (req, res, next) => {
//   const bookmark = await Bookmark.findOne({
//     user: req.user.id,
//     content: req.params.articleId
//   });

//   res.status(200).json({
//     status: 'success',
//     isBookmarked: !!bookmark,
//     bookmarkId: bookmark?._id
//   });
// });

// // @desc    Get user collections
// // @route   GET /api/bookmarks/collections
// // @access  Private
// exports.getCollections = catchAsync(async (req, res, next) => {
//   const collections = await Bookmark.aggregate([
//     { $match: { user: req.user.id } },
//     { $group: {
//       _id: '$collection',
//       count: { $sum: 1 }
//     }},
//     { $project: {
//       id: '$_id',
//       name: '$_id',
//       count: 1,
//       _id: 0
//     }}
//   ]);

//   res.status(200).json({
//     status: 'success',
//     collections
//   });
// });

// // @desc    Create collection
// // @route   POST /api/bookmarks/collections
// // @access  Private
// exports.createCollection = catchAsync(async (req, res, next) => {
//   const { name } = req.body;

//   // Collections are just tags on bookmarks
//   // No need to create a separate document

//   res.status(201).json({
//     status: 'success',
//     collection: { id: name, name, count: 0 }
//   });
// });

// // @desc    Move bookmark to collection
// // @route   PUT /api/bookmarks/:id/move
// // @access  Private
// exports.moveToCollection = catchAsync(async (req, res, next) => {
//   const { collectionId } = req.body;

//   const bookmark = await Bookmark.findOneAndUpdate(
//     { _id: req.params.id, user: req.user.id },
//     { collection: collectionId },
//     { new: true }
//   );

//   if (!bookmark) {
//     return next(new AppError('Bookmark not found', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     bookmark
//   });
// });

// // @desc    Export bookmarks
// // @route   GET /api/bookmarks/export
// // @access  Private
// exports.exportBookmarks = catchAsync(async (req, res, next) => {
//   const { format = 'json' } = req.query;

//   const bookmarks = await Bookmark.find({ user: req.user.id })
//     .populate('content')
//     .lean();

//   const exportData = bookmarks.map(b => ({
//     title: b.content.title,
//     category: b.content.category,
//     savedAt: b.createdAt,
//     collection: b.collection,
//     notes: b.notes,
//     tags: b.tags
//   }));

//   if (format === 'csv') {
//     // Convert to CSV
//     const csv = exportData.map(row => Object.values(row).join(',')).join('\n');
//     res.setHeader('Content-Type', 'text/csv');
//     res.setHeader('Content-Disposition', 'attachment; filename=bookmarks.csv');
//     return res.send(csv);
//   }

//   // Default JSON
//   res.setHeader('Content-Type', 'application/json');
//   res.setHeader('Content-Disposition', 'attachment; filename=bookmarks.json');
//   res.json(exportData);
// });

// Kana dabale
const Bookmark = require('../models/Bookmark');
const LegalContent = require('../models/LegalContent');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// @desc    Get user bookmarks
// @route   GET /api/bookmarks
// @access  Private
exports.getBookmarks = catchAsync(async (req, res, next) => {
  const { collection, page = 1, limit = 20 } = req.query;
  
  const query = { user: req.user.id };
  if (collection && collection !== 'all') {
    query.collection = collection;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const bookmarks = await Bookmark.find(query)
    .populate('content')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Bookmark.countDocuments(query);

  res.status(200).json({
    status: 'success',
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    bookmarks
  });
});

// @desc    Add bookmark
// @route   POST /api/bookmarks
// @access  Private
exports.addBookmark = catchAsync(async (req, res, next) => {
  const { contentId, collection, notes, tags } = req.body;

  // Check if content exists
  const content = await LegalContent.findById(contentId);
  if (!content) {
    return next(new AppError('Legal content not found', 404));
  }

  // Check if already bookmarked
  const existing = await Bookmark.findOne({
    user: req.user.id,
    content: contentId
  });

  if (existing) {
    return next(new AppError('Content already bookmarked', 400));
  }

  const bookmark = await Bookmark.create({
    user: req.user.id,
    content: contentId,
    collection: collection || 'default',
    notes,
    tags
  });

  await bookmark.populate('content');

  res.status(201).json({
    status: 'success',
    bookmark
  });
});

// @desc    Remove bookmark
// @route   DELETE /api/bookmarks/:id
// @access  Private
exports.removeBookmark = catchAsync(async (req, res, next) => {
  const bookmark = await Bookmark.findById(req.params.id);

  if (!bookmark) {
    return next(new AppError('Bookmark not found', 404));
  }

  if (bookmark.user.toString() !== req.user.id) {
    return next(new AppError('You do not have permission to delete this bookmark', 403));
  }

  await bookmark.deleteOne();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// @desc    Check if content is bookmarked
// @route   GET /api/bookmarks/check/:articleId
// @access  Private
exports.checkBookmark = catchAsync(async (req, res, next) => {
  const bookmark = await Bookmark.findOne({
    user: req.user.id,
    content: req.params.articleId
  });

  res.status(200).json({
    status: 'success',
    isBookmarked: !!bookmark,
    bookmark
  });
});

// @desc    Get collections
// @route   GET /api/bookmarks/collections
// @access  Private
exports.getCollections = catchAsync(async (req, res, next) => {
  const collections = await Bookmark.aggregate([
    { $match: { user: req.user._id } },
    { $group: {
        _id: '$collection',
        count: { $sum: 1 }
    }},
    { $sort: { count: -1 } }
  ]);

  res.status(200).json({
    status: 'success',
    collections: collections.map(c => ({
      id: c._id,
      name: c._id === 'default' ? 'Default' : c._id,
      count: c.count
    }))
  });
});

// @desc    Create collection
// @route   POST /api/bookmarks/collections
// @access  Private
exports.createCollection = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return next(new AppError('Please provide a collection name', 400));
  }

  // Collections are just strings, so we just return success
  res.status(201).json({
    status: 'success',
    collection: {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      count: 0
    }
  });
});

// @desc    Move bookmark to collection
// @route   PUT /api/bookmarks/:id/move
// @access  Private
exports.moveToCollection = catchAsync(async (req, res, next) => {
  const { collection } = req.body;

  const bookmark = await Bookmark.findById(req.params.id);

  if (!bookmark) {
    return next(new AppError('Bookmark not found', 404));
  }

  if (bookmark.user.toString() !== req.user.id) {
    return next(new AppError('You do not have permission to modify this bookmark', 403));
  }

  bookmark.collection = collection || 'default';
  await bookmark.save();

  res.status(200).json({
    status: 'success',
    bookmark
  });
});

// @desc    Export bookmarks
// @route   GET /api/bookmarks/export
// @access  Private
exports.exportBookmarks = catchAsync(async (req, res, next) => {
  const { format = 'json' } = req.query;

  const bookmarks = await Bookmark.find({ user: req.user.id })
    .populate('content')
    .sort({ createdAt: -1 });

  const exportData = bookmarks.map(b => ({
    id: b._id,
    title: b.content?.title,
    category: b.content?.category,
    collection: b.collection,
    notes: b.notes,
    tags: b.tags,
    savedAt: b.createdAt
  }));

  if (format === 'csv') {
    // Convert to CSV
    const headers = ['id', 'title', 'category', 'collection', 'notes', 'tags', 'savedAt'];
    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const item of exportData) {
      const values = headers.map(header => {
        const val = item[header] || '';
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=bookmarks.csv');
    return res.send(csvRows.join('\n'));
  }

  // Default JSON
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=bookmarks.json');
  res.json(exportData);
});