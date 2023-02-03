const Category = require('../models/category');

exports.getCategoryService = async ({ categoryId }) => {
  const category = await Category.findOne({ categoryId }).select('-_id -createdAt -updatedAt');

  if (!category) {
    const err = new Error('Category not found');
    err.statusCode = 400;
    throw err;
  }

  return category.toObject();
};
