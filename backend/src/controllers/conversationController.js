const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { triggerTyping } = require('../services/pusherService');

// GET /api/conversations
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate('participants', 'name avatar status lastSeen')
      .populate('lastMessage')
      .populate('group', 'name avatar')
      .sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/conversations  { userId }
const startConversation = async (req, res) => {
  try {
    const { userId } = req.body;
    let conversation = await Conversation.findOne({
      isGroup: false,
      participants: { $all: [req.user._id, userId], $size: 2 },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, userId],
        isGroup: false,
      });
    }

    conversation = await conversation.populate('participants', 'name avatar status lastSeen');
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/conversations/:id/messages
const getMessages = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation || !conversation.participants.some((p) => p.equals(req.user._id))) {
      return res.status(403).json({ message: 'معندكش صلاحية تشوف المحادثة دي' });
    }
    const messages = await Message.find({ conversation: req.params.id })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/conversations/:id/read
// بنعلّم كل الرسايل اللي مش مبعوتة مني في المحادثة دي إني قريتها،
// عشان نقدر نحسب "unread" بدقة في القايمة بدل ما نعتمد بس على وجود رسالة.
const markAsRead = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation || !conversation.participants.some((p) => p.equals(req.user._id))) {
      return res.status(403).json({ message: 'معندكش صلاحية على المحادثة دي' });
    }

    await Message.updateMany(
      { conversation: req.params.id, sender: { $ne: req.user._id }, readBy: { $ne: req.user._id } },
      { $addToSet: { readBy: req.user._id } }
    );

    res.json({ message: 'تم التعليم كمقروءة' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/conversations/:id/typing   { isTyping }
// نقطة request/response عادية بس بتبعت حدث لحظي عن طريق Pusher،
// مفيش اتصال دائم محتاج زي socket.io.
const sendTyping = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation || !conversation.participants.some((p) => p.equals(req.user._id))) {
      return res.status(403).json({ message: 'معندكش صلاحية على المحادثة دي' });
    }

    await triggerTyping(req.params.id, {
      userId: req.user._id,
      name: req.user.name,
      isTyping: !!req.body.isTyping,
    });

    res.json({ message: 'تم' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getConversations, startConversation, getMessages, markAsRead, sendTyping };
