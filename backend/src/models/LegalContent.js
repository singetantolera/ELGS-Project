const mongoose = require('mongoose');

const legalContentSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    am: { type: String, required: true },
    om: { type: String, required: true }
  },
  category: {
    type: String,
    required: true,
    enum: ['criminal', 'family', 'labor']
  },
  language: {
    type: String,
    required: true,
    enum: ['en', 'am', 'om']
  },
  content: {
    en: { type: String, required: true },
    am: { type: String, required: true },
    om: { type: String, required: true }
  },
  simplifiedContent: {
    en: String,
    am: String,
    om: String
  },
  metadata: {
    articleNumber: String,
    proclamationNo: String,
    dateEnacted: String,
    lastAmended: String,
    source: String
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  views: {
    type: Number,
    default: 0
  },
  bookmarks: {
    type: Number,
    default: 0
  },
  tags: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for search
legalContentSchema.index({ 
  'title.en': 'text', 
  'title.am': 'text', 
  'title.om': 'text',
  'content.en': 'text',
  'content.am': 'text',
  'content.om': 'text',
  tags: 'text'
});

// Increment view count
legalContentSchema.methods.incrementViews = async function() {
  this.views += 1;
  return this.save();
};

module.exports = mongoose.model('LegalContent', legalContentSchema);