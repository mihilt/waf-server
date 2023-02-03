const Category = require('../models/category');
const Post = require('../models/post');
const { checkRequiredFields } = require('../utils');
const Comment = require('../models/comment');

// TODO: isGetRecentPosts false일 때도 잘 동작하는지 확인 필요
exports.getCategories = async (req, res, next) => {
  try {
    const isGetRecentPosts = req.query.isGetRecentPosts === 'true';

    const categories = await Category.find({}, { _id: 0, createdAt: 0, updatedAt: 0 }).sort({
      name: 1,
    });

    const result = isGetRecentPosts
      ? await Promise.all(
          categories.map(async category => {
            const recentPosts = await Post.find({ categoryId: category.categoryId, deleted: false })
              .select('postId categorySeq title createdAt likes')
              .sort({ postId: -1 })
              .limit(5);

            const postIds = recentPosts.map(post => post.postId);
            const commentCounts = await Comment.aggregate([
              { $match: { postId: { $in: postIds } } },
              { $group: { _id: '$postId', count: { $sum: 1 } } },
            ]);
            const commentCountsMap = new Map(commentCounts.map(item => [item._id, item.count]));

            const postResult = recentPosts.map(post => {
              const { _id, postId, ...rest } = post.toObject();
              const commentCount = commentCountsMap.get(post.postId) || 0;

              return { ...rest, commentCount };
            });

            return {
              postResult,
              ...category.toObject(),
            };
          }),
        )
      : categories;

    res.status(200).json({ result });
  } catch (err) {
    next(err);
  }
};

exports.postCategory = async (req, res, next) => {
  try {
    const { categoryId, name, auth } = req.body;

    checkRequiredFields({ categoryId, name });

    await Category.create({
      categoryId,
      name,
      auth,
    });

    res.status(200).json({
      message: 'Category created',
    });
  } catch (err) {
    next(err);
  }
};
