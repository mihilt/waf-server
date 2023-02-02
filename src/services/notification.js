const { getNextSequence } = require('../utils');
const Notification = require('../models/notification');
const User = require('../models/user');

exports.postNotification = async ({ userId, content, link, icon }) => {
  const userExist = await User.exists({ userId });

  if (!userExist) {
    throw new Error('User not found');
  }

  const result = await Notification.create({
    notificationId: await getNextSequence('notificationId'),
    userId,
    content,
    link,
    icon,
  });

  return result;
};
