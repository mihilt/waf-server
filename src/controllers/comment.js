const Comment = require('../models/comment');
const { checkRequiredFields } = require('../utils');

exports.postComment = async (req, res, next) => {
  try {
    const { postId, author, contents, password: commentPassword, parentComment } = req.body;

    checkRequiredFields({ postId, author, contents, password: commentPassword });

    const comment = await Comment.create({
      postId,
      author,
      contents,
      password: commentPassword,
      ip: req.ip,
      commentId: (await Comment.countDocuments({ postId })) + 1,
      parentComment,
    });

    const { _id, password, ...result } = comment.toObject();
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { postId, commentId, password } = req.body;

    checkRequiredFields({ password });

    const comment = await Comment.findOneAndUpdate(
      { postId, commentId, password },
      { deleted: true },
      { new: true },
    );

    if (!comment) {
      const err = new Error('Comment not found');
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({ message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
};
