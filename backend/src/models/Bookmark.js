const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LegalContent',
    required: true
  },
  collection: {
    type: String,
    default: 'default'
  },
  notes: {
    type: String,
    maxlength: 500
  },
  tags: [String]
}, {
  timestamps: true
});

// Ensure one user can't bookmark the same content twice
bookmarkSchema.index({ user: 1, content: 1 }, { unique: true });

// Populate content when querying
bookmarkSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'content',
    select: 'title category language views'
  });
  next();
});

// Update bookmark count on legal content
bookmarkSchema.post('save', async function() {
  const LegalContent = mongoose.model('LegalContent');
  const count = await mongoose.model('Bookmark').countDocuments({ content: this.content });
  await LegalContent.findByIdAndUpdate(this.content, { bookmarks: count });
});

bookmarkSchema.post('remove', async function() {
  const LegalContent = mongoose.model('LegalContent');
  const count = await mongoose.model('Bookmark').countDocuments({ content: this.content });
  await LegalContent.findByIdAndUpdate(this.content, { bookmarks: count });
});

module.exports = mongoose.model('Bookmark', bookmarkSchema);