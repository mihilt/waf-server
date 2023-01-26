const Post = require('../models/post');

exports.getPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    const { _id, ...result } = post.toObject();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.postPost = async (req, res, next) => {
  try {
    const { title, contents } = req.body;
    const post = await Post.create({ title, contents });
    const { _id, ...result } = post.toObject();
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};
