const express = require('express');

const router = express.Router();

const postRoutes = require('./post.route');
const testRoutes = require('./test.route');

router.use('/post', postRoutes);
router.use('/test', testRoutes);

module.exports = router;
