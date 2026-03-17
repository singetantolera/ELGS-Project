const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    en: { type: String, required: true },
    am: { type: String, required: true },
    om: { type: String, required: true }
  },
  description: {
    en: { type: String, required: true },
    am: { type: String, required: true },
    om: { type: String, required: true }
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  articleCount: {
    type: Number,
    default: 0
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Update article count
categorySchema.methods.updateArticleCount = async function() {
  const LegalContent = mongoose.model('LegalContent');
  this.articleCount = await LegalContent.countDocuments({ 
    category: this.id,
    status: 'published'
  });
  return this.save();
};

module.exports = mongoose.model('Category', categorySchema);