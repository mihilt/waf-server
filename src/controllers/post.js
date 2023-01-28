const { checkRequiredFields, getNextSequence } = require('../utils');
const Post = require('../models/post');
const Comment = require('../models/comment');

exports.getPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const posts = await Post.find({ deleted: false })
      .sort({ postId: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const postIds = posts.map(post => post.postId);
    const commentCounts = await Comment.aggregate([
      { $match: { postId: { $in: postIds } } },
      { $group: { _id: '$postId', count: { $sum: 1 } } },
    ]);
    const commentCountsMap = new Map(commentCounts.map(item => [item._id, item.count]));
    const result = posts.map(post => {
      const { _id, password, contents, deleted, ...rest } = post.toObject();
      const commentCount = commentCountsMap.get(post.postId) || 0;
      return { ...rest, commentCount };
    });
    const count = await Post.countDocuments({ deleted: false });
    res.status(200).json({ result, count });
  } catch (err) {
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findOne({ postId, deleted: false });
    if (!post) {
      const err = new Error('Post not found');
      err.statusCode = 404;
      throw err;
    }
    const { _id, password, deleted, ...postResult } = post.toObject();

    const comments = await Comment.find({ postId: post.postId }).select('-password -postId');

    const commentsWithReplies = comments.reduce((pre, cur) => {
      if (cur.deleted) {
        // eslint-disable-next-line no-param-reassign
        cur.contents = '[삭제된 댓글입니다.]';
      }

      if (cur.parentComment) {
        const parentComment = pre.find(e => e.commentId === cur.parentComment);
        parentComment.comments = parentComment.comments || [];
        parentComment.comments.push(cur);
      } else {
        pre.push({
          ...cur.toObject(),
        });
      }
      return pre;
    }, []);

    const topLevelComments = commentsWithReplies.filter(comment => !comment.parentComment);
    postResult.comments = topLevelComments;

    res.status(200).json(postResult);
  } catch (err) {
    next(err);
  }
};

exports.postPost = async (req, res, next) => {
  try {
    const { author, title, contents, password } = req.body;

    checkRequiredFields({ author, password, title, contents });

    const post = await Post.create({
      author,
      password,
      title,
      contents,
      ip: req.ip,
      postId: await getNextSequence('postId'),
    });
    const { _id, ...result } = post.toObject();
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.patchPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { author, title, contents, password, newPassword } = req.body;

    checkRequiredFields({ author, password, title, contents, newPassword });

    const post = await Post.findOneAndUpdate(
      { postId, password },
      { author, title, contents, password: newPassword },
      { new: true },
    );

    if (!post) {
      const err = new Error('Post not found');
      err.statusCode = 404;
      throw err;
    }
    const { _id, ...result } = post.toObject();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { password } = req.body;

    checkRequiredFields({ password });

    const post = await Post.findOneAndUpdate(
      { postId, password, deleted: false },
      { deleted: true },
      { new: true },
    );

    if (!post) {
      const err = new Error('Post not found');
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({ message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
};

exports.checkPasswordPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { password } = req.body;

    checkRequiredFields({ password });

    const post = await Post.findOne({ postId, password, deleted: false });

    const { _id, ...result } = post.toObject();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
