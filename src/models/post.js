const mongoose = require('mongoose');

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    postId: {
      type: Number,
      required: true,
      unique: true,
    },
    categoryId: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    contents: {
      type: String,
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('post', postSchema);
