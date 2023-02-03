const express = require('express');

const controller = require('../../controllers/category');
const { checkAdminAuth } = require('../../middlewares/auth');

const router = express.Router();

router.get('/', controller.getCategories);

router.post('/', checkAdminAuth, controller.postCategory);

module.exports = router;
