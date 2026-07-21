const mongoose = require('mongoose');

const { Schema } = mongoose;

const bookModel = new Schema(
  {
    title: { type: String },
    author: { type: String },
    genre: { type: String, maxlength: 30 }, // Added maxlength: 30 as per requirements
    read: { type: Boolean, default: false }
  }
);

module.exports = mongoose.model('Book', bookModel);