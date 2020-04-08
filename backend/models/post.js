const mongoose = require('mongoose');   // import mongoose package

// define a Schema
const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }
});

module.exports = mongoose.model('Post', postSchema);    // create a model and export it
