const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../config/vars');
const { checkRequiredFields } = require('../utils');
const Notification = require('../models/notification');

exports.getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.params;

    const accessToken = req.headers.authorization.split(' ')[1];
    const { userId } = jwt.verify(accessToken, jwtSecret);

    const notifications = await Notification.find({ userId, read: false })
      .sort({ notificationId: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ notifications });
  } catch (err) {
    next(err);
  }
};

exports.readNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.body;

    checkRequiredFields({ notificationId });

    await Notification.findOneAndUpdate({ notificationId }, { read: true });

    res.status(200).json({ message: 'Notification read' });
  } catch (err) {
    next(err);
  }
};

exports.readAllNotifications = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(' ')[1];
    const { userId } = jwt.verify(accessToken, jwtSecret);

    await Notification.updateMany({ userId, read: false }, { read: true });

    res.status(200).json({ message: 'All notifications read' });
  } catch (err) {
    next(err);
  }
};
