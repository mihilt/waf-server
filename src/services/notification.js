const { getNextSequence } = require('../utils');
const Notification = require('../models/notification');
const User = require('../models/user');

// TODO: 덧글 생성 && 익명 게시글 아닐 경우 알림 생성
exports.postNotificationService = async ({ userId, content, link, icon }) => {
  const userExist = await User.exists({ userId });

  if (!userExist) {
    throw new Error('User not found');
  }

  const notification = await Notification.create({
    notificationId: await getNextSequence('notificationId'),
    userId,
    content,
    link,
    icon,
  });

  return notification.toObject();
};
