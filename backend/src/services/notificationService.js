const Notification = require('../models/Notification');
const { triggerNotification } = require('./pusherService');

const createNotification = async ({ recipient, sender, type, payload = {} }) => {
  const notification = await Notification.create({ recipient, sender, type, payload });
  const populated = await notification.populate('sender', 'name avatar');
  await triggerNotification(recipient.toString(), populated);
  return populated;
};

module.exports = { createNotification };
