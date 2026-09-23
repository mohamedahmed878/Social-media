const express = require('express');
const { createGroup, getMyGroups, addMembers } = require('../controllers/groupController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/', getMyGroups);
router.post('/', createGroup);
router.put('/:id/members', addMembers);

module.exports = router;
