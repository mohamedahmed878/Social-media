const Group = require('../models/Group');
const Conversation = require('../models/Conversation');
const { createNotification } = require('../services/notificationService');

// POST /api/groups   { name, description, memberIds }
const createGroup = async (req, res) => {
  try {
    const { name, description, memberIds = [] } = req.body;
    if (!name) return res.status(400).json({ message: 'اسم الجروب مطلوب' });

    const members = Array.from(new Set([req.user._id.toString(), ...memberIds]));

    const conversation = await Conversation.create({
      participants: members,
      isGroup: true,
    });

    const group = await Group.create({
      name,
      description,
      owner: req.user._id,
      admins: [req.user._id],
      members,
      conversation: conversation._id,
    });

    conversation.group = group._id;
    await conversation.save();

    await Promise.all(
      memberIds.map((id) =>
        createNotification({
          recipient: id,
          sender: req.user._id,
          type: 'group_add',
          payload: { groupId: group._id, groupName: group.name },
        })
      )
    );

    const populated = await group.populate('members admins owner', 'name avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/groups
const getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate('members admins owner', 'name avatar status');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/groups/:id/members   { memberIds }  (admins only)
const addMembers = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'الجروب مش موجود' });
    if (!group.admins.some((a) => a.equals(req.user._id))) {
      return res.status(403).json({ message: 'الأدمن بس اللي يقدر يضيف أعضاء' });
    }

    const { memberIds = [] } = req.body;
    memberIds.forEach((id) => {
      if (!group.members.some((m) => m.equals(id))) group.members.push(id);
    });
    await group.save();

    const conversation = await Conversation.findById(group.conversation);
    if (conversation) {
      memberIds.forEach((id) => {
        if (!conversation.participants.some((p) => p.equals(id))) {
          conversation.participants.push(id);
        }
      });
      await conversation.save();
    }

    const populated = await group.populate('members admins owner', 'name avatar');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createGroup, getMyGroups, addMembers };
