const express = require('express');

const controller = require('../../controllers/notification');
const { checkIsLoggedIn } = require('../../middlewares/auth');

const router = express.Router();

router.get('/', checkIsLoggedIn, controller.getNotifications);

router.post('/read', checkIsLoggedIn, controller.readNotification);

router.post('/readAll', checkIsLoggedIn, controller.readAllNotifications);

module.exports = router;
