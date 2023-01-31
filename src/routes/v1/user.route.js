const express = require('express');

const controller = require('../../controllers/user');

const router = express.Router();

router.post('/', controller.postUser);

router.post('/check-email', controller.checkEmailDuplication);

router.post('/check-nickname', controller.checkNicknameDuplication);

module.exports = router;
