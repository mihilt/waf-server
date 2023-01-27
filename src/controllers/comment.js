const Comment = require('../models/comment');
const { checkRequiredFields, getNextSequence } = require('../utils');

exports.postComment = async (req, res, next) => {
  try {
    const { postId, author, contents, password, parentComment } = req.body;

    checkRequiredFields({ postId, author, contents, password });

    const comment = await Comment.create({
      postId,
      author,
      contents,
      password,
      ip: req.ip,
      commentId: await getNextSequence('commentId'),
      parentComment,
    });

    const { _id, ...result } = comment.toObject();
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};
