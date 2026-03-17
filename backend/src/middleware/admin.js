const AppError = require('../utils/AppError');

// Admin specific middleware
exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('You are not logged in', 401));
  }
  
  if (req.user.role !== 'admin') {
    return next(new AppError('Admin access required', 403));
  }
  
  next();
};

// Log admin actions
exports.logAdminAction = (req, res, next) => {
  console.log(`[ADMIN ACTION] User: ${req.user.email} | Action: ${req.method} ${req.originalUrl} | Time: ${new Date().toISOString()}`);
  next();
};

// Check if user is admin or self
exports.isAdminOrSelf = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('You are not logged in', 401));
  }
  
  const userId = req.params.id || req.body.userId;
  
  if (req.user.role !== 'admin' && req.user.id !== userId) {
    return next(new AppError('You can only modify your own account', 403));
  }
  
  next();
};