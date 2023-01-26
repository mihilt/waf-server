const { checkRequiredFields, getNextSequence } = require('../utils');
const Post = require('../models/post');

exports.getPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findOne({ postId, deleted: false });
    if (!post) {
      const err = new Error('Post not found');
      err.statusCode = 404;
      throw err;
    }
    const { _id, password, ...result } = post.toObject();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.postPost = async (req, res, next) => {
  try {
    const { author, title, contents, password } = req.body;

    checkRequiredFields([author, password, title, contents]);

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
