const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const { triggerNewMessage } = require('./pusherService');
const { createNotification } = require('./notificationService');

const sendMessage = async ({ conversationId, senderId, text, attachment }) => {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw new Error('المحادثة مش موجودة');
  if (!conversation.participants.some((p) => p.equals(senderId))) {
    throw new Error('معندكش صلاحية تبعت في المحادثة دي');
  }

  const message = await Message.create({
    conversation: conversationId,
    sender: senderId,
    text,
    attachment,
    readBy: [senderId],
  });

  conversation.lastMessage = message._id;
  await conversation.save();

  const populated = await message.populate('sender', 'name avatar');

  // realtime broadcast عن طريق Pusher بدل socket.io
  await triggerNewMessage(conversationId, populated);

  // إشعار لباقي الأعضاء
  const recipients = conversation.participants.filter((p) => !p.equals(senderId));
  await Promise.all(
    recipients.map((r) =>
      createNotification({
        recipient: r,
        sender: senderId,
        type: 'message',
        payload: { conversationId, text },
      })
    )
  );

  return populated;
};

module.exports = { sendMessage };
