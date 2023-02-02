const mongoose = require('mongoose');

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    postId: {
      type: Number,
      required: true,
      unique: true,
    },
    categorySeq: {
      type: Number,
      required: true,
    },
    categoryId: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    userId: {
      type: Number,
    },
    /**
     * 인증이 완료된 client의 경우 nickName을 author에 저장한다.
     * userId로 조인하여 가져오기보다 author을 통해 당시 사용자의 nickName을 보여주도록
     */
    author: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
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
