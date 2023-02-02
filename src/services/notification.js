const { getNextSequence } = require('../utils');
const Notification = require('../models/notification');

exports.postNotification = async ({ userId, content, link, icon }) => {
  // TODO: 실제 userId가 DB에 존재하는 사용자인지 검증하는 과정이 과연 필요한지 고민 필요

  const result = await Notification.create({
    notificationId: await getNextSequence('notificationId'),
    userId,
    content,
    link,
    icon,
  });

  return result;
};
