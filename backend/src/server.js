require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { protect } = require('./middleware/authMiddleware');
const { pusher, conversationChannel, userChannel } = require('./services/pusherService');
const Conversation = require('./models/Conversation');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const groupRoutes = require('./routes/groupRoutes');

connectDB();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'ok', service: 'Jeera API' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/groups', groupRoutes);

// نقطة الـ auth الخاصة بـ Pusher: هنا محل ما كان الاتصال بيتعمل في socket.io،
// بس هنا مجرد request/response عادي بيرجع توكن صلاحية للقناة، فمناسب مع Vercel.
app.post('/api/pusher/auth', protect, async (req, res) => {
  try {
    const { socket_id: socketId, channel_name: channelName } = req.body;

    if (channelName === userChannel(req.user._id)) {
      const auth = pusher.authorizeChannel(socketId, channelName);
      return res.json(auth);
    }

    const match = channelName.match(/^private-conversation-(.+)$/);
    if (match) {
      const conversation = await Conversation.findById(match[1]);
      if (!conversation || !conversation.participants.some((p) => p.equals(req.user._id))) {
        return res.status(403).json({ message: 'معندكش صلاحية على القناة دي' });
      }
      const auth = pusher.authorizeChannel(socketId, channelName);
      return res.json(auth);
    }

    return res.status(403).json({ message: 'قناة غير معروفة' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// على Vercel السيرفر بيشتغل كـ function مش بـ listen دايم، فبنصدّر app
// وبنعمل listen بس لو شغالين محليًا (مش على Vercel).
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => console.log(`Jeera API running on port ${PORT}`));
}

module.exports = app;
