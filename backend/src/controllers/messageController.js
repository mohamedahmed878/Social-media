const { sendMessage } = require('../services/messageService');

// POST /api/messages   { conversationId, text, attachment }
const createMessage = async (req, res) => {
  try {
    const { conversationId, text, attachment } = req.body;
    if (!conversationId || (!text && !attachment)) {
      return res.status(400).json({ message: 'لازم conversationId ونص أو مرفق' });
    }
    const message = await sendMessage({
      conversationId,
      senderId: req.user._id,
      text,
      attachment,
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createMessage };
