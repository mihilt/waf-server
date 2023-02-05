const { checkRequiredFields, getNextSequence } = require('../utils');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Category = require('../models/category');
const { getCategoryService } = require('../services/category');
const redisClient = require('../config/redis-client');

exports.getPosts = async (req, res, next) => {
  try {
    const { categoryId, page = 1, limit = 20, like, searchType, searchValue } = req.query;

    const query = {
      deleted: false,
      ...(categoryId && { categoryId }),
      ...(like && { like: { $gte: like } }),
      ...(searchType &&
        searchValue &&
        (searchType === 'title content'
          ? {
              $or: [
                { title: { $regex: searchValue, $options: 'i' } },
                { content: { $regex: searchValue, $options: 'i' } },
              ],
            }
          : { [searchType]: { $regex: searchValue, $options: 'i' } })),
    };

    const count = await Post.countDocuments(query);

    const category = await getCategoryService({ categoryId });

    const postsWithoutComments = await Post.find(query) // content를 검색조건에서 사용하기에 select에서 거르지 않았다.
      .sort({ postId: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const postIds = postsWithoutComments.map(post => post.postId);
    const commentCounts = await Comment.aggregate([
      { $match: { postId: { $in: postIds } } },
      { $group: { _id: '$postId', count: { $sum: 1 } } },
    ]);
    const commentCountsMap = new Map(commentCounts.map(item => [item._id, item.count]));
    const posts = postsWithoutComments.map(post => {
      const { _id, password, content, deleted, ip, ...rest } = post.toObject();

      rest.ip = ip.split('.').slice(0, 2).join('.');

      const commentCount = commentCountsMap.get(post.postId) || 0;

      return { ...rest, commentCount };
    });
    res.status(200).json({ count, category, posts });
  } catch (err) {
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndUpdate(
      { ...req.params, deleted: false },
      { $inc: { view: 1 } },
      { new: true, timestamps: false },
    );
    if (!post) {
      const err = new Error('Post not found');
      err.statusCode = 400;
      throw err;
    }
    const { _id, password, ip, ...postResult } = post.toObject();

    postResult.category = await getCategoryService({ categoryId: post.categoryId });

    postResult.ip = ip.split('.').slice(0, 2).join('.');

    const comments = await Comment.find({ postId: post.postId }).select('-password -postId -_id');

    const commentsWithReplies = comments
      .map(e => {
        e.ip = e.ip.split('.').slice(0, 2).join('.');
        return e;
      })
      .reduce((pre, cur) => {
        // to avoid eslintno-param-reassign :0
        const currentComment = cur.toObject();

        if (currentComment.deleted) {
          delete currentComment.author;
          delete currentComment.content;
          delete currentComment.ip;
        }

        if (currentComment.parentCommentId) {
          const parentComment = pre.find(e => e.commentId === currentComment.parentCommentId);
          parentComment.comments = parentComment.comments || [];
          delete currentComment.parentCommentId;
          parentComment.comments.push(currentComment);
        } else {
          pre.push({
            ...currentComment,
          });
        }
        return pre;
      }, []);

    const topLevelComments = commentsWithReplies.filter(comment => !comment.parentCommentId);
    postResult.comments = topLevelComments;

    res.status(200).json(postResult);
  } catch (err) {
    next(err);
  }
};

exports.postPost = async (req, res, next) => {
  try {
    const { categoryId, author, title, content, password } = req.body;

    checkRequiredFields({ categoryId, author, password, title, content });

    const category = await Category.exists({ categoryId });

    if (!category) {
      const err = new Error('Category not found');
      err.statusCode = 400;
      throw err;
    }

    // TODO: 글 등록 A 권한 체크

    const refinedIp = req.headers['x-forwarded-for'] || req.ip.replace(/^.*:/, '');

    const post = await Post.create({
      categoryId,
      author,
      password,
      title,
      content,
      ip: refinedIp,
      postId: await getNextSequence('postId'),
      categorySeq: await getNextSequence(`category:${categoryId}`),
    });

    const { _id, ip, password: postPassword, ...result } = post.toObject();

    result.ip = refinedIp.split('.').slice(0, 2).join('.');

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.patchPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { author, title, content, password, newPassword } = req.body;

    checkRequiredFields({ author, password, title, content, newPassword });

    const post = await Post.findOneAndUpdate(
      { postId, password },
      { author, title, content, password: newPassword },
      { new: true },
    );

    if (!post) {
      const err = new Error('Post not found');
      err.statusCode = 400;
      throw err;
    }

    const { _id, ip, password: postPassword, ...result } = post.toObject();

    result.ip = ip.split('.').slice(0, 2).join('.');

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { postId, password } = req.query;

    checkRequiredFields({ password });

    const post = await Post.findOneAndUpdate(
      { postId, password, deleted: false },
      { deleted: true },
      { new: true },
    );

    if (!post) {
      const err = new Error('Post not found');
      err.statusCode = 400;
      throw err;
    }

    res.status(200).json({ message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
};

exports.checkPasswordPost = async (req, res, next) => {
  try {
    const { postId, password } = req.body;

    checkRequiredFields({ postId, password });

    const post = await Post.findOne({ postId, password, deleted: false });

    if (!post) {
      const err = new Error('Post not found');
      err.statusCode = 400;
      throw err;
    }

    // need to res password necessary cuz it can be editing post after checking password
    // TODO: 게시글 비밀번호 암호화 이후라면 수정할 때 어떻게 해야할지 고민해보기 -> 개인정보가 아니라 해싱이 필요가 없다?
    const { _id, ip, ...result } = post.toObject();

    result.ip = ip.split('.').slice(0, 2).join('.');

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.likePost = async (req, res, next) => {
  try {
    const { postId } = req.body;

    checkRequiredFields({ postId });

    const refinedIp = req.headers['x-forwarded-for'] || req.ip.replace(/^.*:/, '');
    const redisKey = `like:${refinedIp}:posts`;
    const sAddResult = await redisClient.sAdd(redisKey, postId.toString());

    if (sAddResult !== 1) {
      res.status(409).json({ message: 'Already did', code: 'already-did' });
      return;
    }

    await redisClient.expire(redisKey, 60 * 60 * 24);

    const post = await Post.findOneAndUpdate(
      { postId },
      { $inc: { like: 1 } },
      { new: true, timestamps: false },
    );

    if (!post) {
      const err = new Error('Post not found');
      err.statusCode = 400;
      throw err;
    }

    res.status(200).json({ message: 'Post liked' });
  } catch (err) {
    next(err);
  }
};

exports.dislikePost = async (req, res, next) => {
  try {
    const { postId } = req.body;
    checkRequiredFields({ postId });

    const refinedIp = req.headers['x-forwarded-for'] || req.ip.replace(/^.*:/, '');
    const redisKey = `like:${refinedIp}:posts`;
    const sAddResult = await redisClient.sAdd(redisKey, postId.toString());

    if (sAddResult !== 1) {
      res.status(409).json({ message: 'Already did', code: 'already-did' });
      return;
    }

    await redisClient.expire(redisKey, 60 * 60 * 24);

    const post = await Post.findOneAndUpdate(
      { postId },
      { $inc: { like: -1 } },
      { new: true, timestamps: false },
    );

    if (!post) {
      const err = new Error('Post not found');
      err.statusCode = 400;
      throw err;
    }

    res.status(200).json({ message: 'Post disliked' });
  } catch (err) {
    next(err);
  }
};
