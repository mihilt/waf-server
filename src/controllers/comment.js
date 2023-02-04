const redisClient = require('../config/redis-client');
const Comment = require('../models/comment');
const Post = require('../models/post');
const { checkRequiredFields } = require('../utils');

exports.postComment = async (req, res, next) => {
  try {
    const { postId, author, content, password: commentPassword, parentCommentId } = req.body;

    checkRequiredFields({ postId, author, content, password: commentPassword });

    const postExists = await Post.exists({ postId, deleted: false });

    if (!postExists) {
      const err = new Error('Post not found');
      err.statusCode = 400;
      throw err;
    }

    if (parentCommentId) {
      const parentCommentExists = await Comment.exists({
        postId,
        commentId: parentCommentId,
        deleted: false,
      });
      if (!parentCommentExists) {
        const err = new Error('Parent comment not found');
        err.statusCode = 400;
        throw err;
      }
    }

    const comment = await Comment.create({
      postId,
      author,
      content,
      password: commentPassword,
      ip: req.ip.replace(/^.*:/, ''),
      commentId: (await Comment.countDocuments({ postId })) + 1,
      parentCommentId,
    });

    // TODO: parentCommentId의 userId와 postId의 userId에게 알림을 보내는데 알림을 보내지 않아야 할 경우를 생각하고(게시글 등록자와 postComment 요청 Authenticated User가 같을 경우 등..) 구현 필요

    // TODO: 프론트에서 굳이 응답에 comment 내용을 받을 필요가 있는지 구현 후 확인 필요
    const { _id, password, ip, ...result } = comment.toObject();

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { postId, commentId, password } = req.query;

    checkRequiredFields({ postId, commentId, password });

    const comment = await Comment.findOneAndUpdate(
      { postId, commentId, password, deleted: false },
      { deleted: true },
      { new: true },
    );

    if (!comment) {
      const err = new Error('Comment not found');
      err.statusCode = 400;
      throw err;
    }

    res.status(200).json({ message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
};

exports.likeComment = async (req, res, next) => {
  try {
    const { postId, commentId } = req.body;

    checkRequiredFields({ postId, commentId });

    const refinedIp = req.ip.replace(/^.*:/, '');
    const redisKey = `like:${refinedIp}:comments`;
    const redisValue = `${postId}:${commentId}`;
    const sAddResult = await redisClient.sAdd(redisKey, redisValue);

    if (sAddResult !== 1) {
      res.status(409).json({ message: 'Already did', code: 'already-did' });
      return;
    }

    await redisClient.expire(redisKey, 60 * 60 * 24);

    const comment = await Comment.findOneAndUpdate(
      { postId, commentId },
      { $inc: { like: 1 } },
      { new: true, timestamps: false },
    );

    if (!comment) {
      const err = new Error('Comment not found');
      err.statusCode = 400;
      throw err;
    }

    res.status(200).json({ message: 'Comment liked' });
  } catch (err) {
    next(err);
  }
};

exports.dislikeComment = async (req, res, next) => {
  try {
    const { postId, commentId } = req.body;

    checkRequiredFields({ postId, commentId });

    const refinedIp = req.ip.replace(/^.*:/, '');
    const redisKey = `like:${refinedIp}:comments`;
    const redisValue = `${postId}:${commentId}`;
    const sAddResult = await redisClient.sAdd(redisKey, redisValue);

    if (sAddResult !== 1) {
      res.status(409).json({ message: 'Already did', code: 'already-did' });
      return;
    }

    await redisClient.expire(redisKey, 60 * 60 * 24);

    const comment = await Comment.findOneAndUpdate(
      { postId, commentId },
      { $inc: { like: -1 } },
      { new: true, timestamps: false },
    );

    if (!comment) {
      const err = new Error('Comment not found');
      err.statusCode = 400;
      throw err;
    }

    res.status(200).json({ message: 'Comment disliked' });
  } catch (err) {
    next(err);
  }
};
