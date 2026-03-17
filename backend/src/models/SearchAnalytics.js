const mongoose = require('mongoose');

const searchAnalyticsSchema = new mongoose.Schema({
  term: {
    type: String,
    required: true,
    unique: true
  },
  count: {
    type: Number,
    default: 1
  },
  category: String,
  lastSearched: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for trending searches
searchAnalyticsSchema.index({ count: -1, lastSearched: -1 });

module.exports = mongoose.model('SearchAnalytics', searchAnalyticsSchema);