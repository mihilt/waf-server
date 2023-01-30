const express = require('express');

const router = express.Router();

const postRoutes = require('./post.route');
const commentRoutes = require('./comment.route');
const testRoutes = require('./test.route');
const uploadRoutes = require('./upload.route');

router.use('/post', postRoutes);
router.use('/comment', commentRoutes);
router.use('/upload', uploadRoutes);
router.use('/test', testRoutes);

module.exports = router;
