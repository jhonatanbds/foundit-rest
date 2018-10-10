const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  foundDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  foundBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
    required: false,
    default: false
  },
  comments: [
    {
      author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
      },
      content: String
    }
  ]
});

ItemSchema.methods.comment = function(c) {
  this.comments.push(c)
  return this.save()
}

module.exports = () => mongoose.model('Item', ItemSchema);
