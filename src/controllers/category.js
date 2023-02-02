const Category = require('../models/category');
const { checkRequiredFields } = require('../utils');

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
