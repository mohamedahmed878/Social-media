// بديل Socket.io: Pusher شغال على أي منصة serverless زي Vercel
// لأنه مش محتاج اتصال دائم بين السيرفر والعميل.
const Pusher = require('pusher');

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

const conversationChannel = (conversationId) => `private-conversation-${conversationId}`;
const userChannel = (userId) => `private-user-${userId}`;

const triggerNewMessage = async (conversationId, message) => {
  await pusher.trigger(conversationChannel(conversationId), 'new-message', message);
};

const triggerNotification = async (userId, notification) => {
  await pusher.trigger(userChannel(userId), 'new-notification', notification);
};

const triggerTyping = async (conversationId, payload) => {
  await pusher.trigger(conversationChannel(conversationId), 'typing', payload);
};

const authorizeChannel = (socketId, channel, user) => {
  if (channel.startsWith('presence-')) {
    return pusher.authorizeChannel(socketId, channel, {
      user_id: user._id.toString(),
      user_info: { name: user.name, avatar: user.avatar },
    });
  }
  return pusher.authorizeChannel(socketId, channel);
};

module.exports = {
  pusher,
  conversationChannel,
  userChannel,
  triggerNewMessage,
  triggerNotification,
  triggerTyping,
  authorizeChannel,
};
