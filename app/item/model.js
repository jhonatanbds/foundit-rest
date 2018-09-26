const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
  foundDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  foundBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foundPlace: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: true
  },
  found: {
    type: Boolean,
    require: true
  }
});

module.exports = () => mongoose.model('Item', ItemSchema);
