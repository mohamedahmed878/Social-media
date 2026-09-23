const express = require('express');
const {
  getConversations,
  startConversation,
  getMessages,
  markAsRead,
  sendTyping,
} = require('../controllers/conversationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/', getConversations);
router.post('/', startConversation);
router.get('/:id/messages', getMessages);
router.put('/:id/read', markAsRead);
router.post('/:id/typing', sendTyping);

module.exports = router;
