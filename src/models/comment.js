const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    commentId: {
      type: Number,
      required: true,
    },
    postId: {
      type: Number,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    parentComment: {
      type: Number,
    },
    author: {
      type: String,
      required: true,
    },
    password: {
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

module.exports = mongoose.model('comment', commentSchema);
