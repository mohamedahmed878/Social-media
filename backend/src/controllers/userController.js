const User = require('../models/User');

// GET /api/users?search=
const getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = search
      ? { $text: { $search: search }, _id: { $ne: req.user._id } }
      : { _id: { $ne: req.user._id } };
    const users = await User.find(filter).select('-password').limit(30);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'المستخدم مش موجود' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/users/:id/friend
const addFriend = async (req, res) => {
  try {
    const targetId = req.params.id;
    if (targetId === req.user._id.toString()) {
      return res.status(400).json({ message: 'معرفتش تضيف نفسك' });
    }
    const user = await User.findById(req.user._id);
    if (!user.friends.includes(targetId)) {
      user.friends.push(targetId);
      await user.save();
    }
    res.json({ message: 'تمت الإضافة' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, getUserById, updateProfile, addFriend };
