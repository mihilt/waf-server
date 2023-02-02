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
    userId: {
      type: Number,
    },
    /**
     * post model의 author와 동일하게 처리 필요
     */
    author: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    contents: {
      type: String,
      required: true,
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

module.exports = mongoose.model('comment', commentSchema);
