// Format date
exports.formatDate = (date, format = 'default') => {
  const d = new Date(date);
  
  const formats = {
    default: d.toLocaleDateString(),
    short: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    long: d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    datetime: d.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };

  return formats[format] || formats.default;
};

// Generate slug from text
exports.slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// Truncate text
exports.truncate = (text, length = 100, suffix = '...') => {
  if (text.length <= length) return text;
  return text.substring(0, length) + suffix;
};

// Extract keywords from text
exports.extractKeywords = (text) => {
  const words = text.toLowerCase().split(/\W+/);
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  return [...new Set(words.filter(word => word.length > 2 && !stopWords.includes(word)))];
};

// Generate random string
exports.generateRandomString = (length = 10) => {
  return Math.random().toString(36).substring(2, length + 2);
};

// Paginate results
exports.paginate = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return { skip, limit: parseInt(limit) };
};

// Build search query
exports.buildSearchQuery = (params) => {
  const query = {};
  
  if (params.category && params.category !== 'all') {
    query.category = params.category;
  }
  
  if (params.language && params.language !== 'all') {
    query.language = params.language;
  }
  
  if (params.status) {
    query.status = params.status;
  }
  
  if (params.search) {
    query.$text = { $search: params.search };
  }
  
  if (params.date && params.date !== 'all') {
    const now = new Date();
    let startDate;
    
    switch(params.date) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
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
      query.createdAt = { $gte: startDate };
    }
  }
  
  return query;
};

// Sanitize user input
exports.sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/[<>]/g, '');
};

// Validate MongoDB ID
exports.isValidObjectId = (id) => {
  const mongoose = require('mongoose');
  return mongoose.Types.ObjectId.isValid(id);
};