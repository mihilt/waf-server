const express = require('express');

const controller = require('../../controllers/comment');

const router = express.Router();

router.post('/', controller.postComment);

module.exports = router;
