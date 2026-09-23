const express = require('express');
const { getUsers, getUserById, updateProfile, addFriend } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/', getUsers);
router.put('/profile', updateProfile);
router.get('/:id', getUserById);
router.post('/:id/friend', addFriend);

module.exports = router;
