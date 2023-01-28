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
