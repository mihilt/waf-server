const express = require('express');

const controller = require('../../controllers/post');

const router = express.Router();

router.get('/:postId', controller.getPost);

router.post('/', controller.postPost);

module.exports = router;
