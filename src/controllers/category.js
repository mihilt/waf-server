const Category = require('../models/category');
const Post = require('../models/post');
const { checkRequiredFields } = require('../utils');
const Comment = require('../models/comment');
const { getCategoryService } = require('../services/category');

exports.getCategories = async (req, res, next) => {
  try {
    const isGetRecentPosts = req.query.isGetRecentPosts === 'true';

    const categoriesWithoutPosts = await Category.find().select('-_id -createdAt -updatedAt').sort({
      name: 1,
    });

    const categories = isGetRecentPosts
      ? await Promise.all(
          categoriesWithoutPosts.map(async category => {
            const recentPostsWithoutCommentCount = await Post.find({
              categoryId: category.categoryId,
              deleted: false,
            })
              .select('postId categorySeq title createdAt like')
              .sort({ postId: -1 })
              .limit(5);

            const postIds = recentPostsWithoutCommentCount.map(post => post.postId);
            const commentCounts = await Comment.aggregate([
              { $match: { postId: { $in: postIds } } },
              { $group: { _id: '$postId', count: { $sum: 1 } } },
            ]);
            const commentCountsMap = new Map(commentCounts.map(item => [item._id, item.count]));

            const recentPosts = recentPostsWithoutCommentCount.map(post => {
              const { _id, postId, ...rest } = post.toObject();
              const commentCount = commentCountsMap.get(post.postId) || 0;

              return { ...rest, commentCount };
            });

            return {
              recentPosts,
              ...category.toObject(),
            };
          }),
        )
      : categoriesWithoutPosts;

    res.status(200).json({ categories });
  } catch (err) {
    next(err);
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    checkRequiredFields({ categoryId });

    const getCategoryServiceResult = await getCategoryService({ categoryId });

    res.status(200).json({ category: getCategoryServiceResult });
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
