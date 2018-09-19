const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
  foundDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  foundPlace: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: true
  }
});

module.exports = () => mongoose.model('Item', ItemSchema);
