const express = require('express');

const router = express.Router();

const postRoutes = require('./post.route');
const commentRoutes = require('./comment.route');
const userRoutes = require('./user.route');
const uploadRoutes = require('./upload.route');
const authRoutes = require('./auth.route');

router.use('/post', postRoutes);
router.use('/comment', commentRoutes);
router.use('/upload', uploadRoutes);
router.use('/user', userRoutes);
router.use('/auth', authRoutes);

module.exports = router;
