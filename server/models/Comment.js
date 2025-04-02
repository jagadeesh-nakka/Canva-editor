// models/Comment.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    x: Number,
    y: Number
  },
  resolved: {
    type: Boolean,
    default: false
  },
  design: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Design',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment', commentSchema);