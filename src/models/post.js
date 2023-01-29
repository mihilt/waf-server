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
    view: {
      type: Number,
      default: 0,
    },
    like: {
      type: Number,
      default: 0,
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
