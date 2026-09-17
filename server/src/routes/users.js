const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all users
router.get('/', (req, res) => {
  try {
    const users = db.getUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CREATE user
router.post('/', (req, res) => {
  try {
    const { name, email, avatar_url, role } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required' });
    }

    const users = db.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' });
    }

    const id = 'usr-' + Math.random().toString(36).substr(2, 7);
    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`;

    const newUser = {
      id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      avatar_url: avatar_url || defaultAvatar,
      role: role || 'Member',
      created_at: new Date().toISOString()
    };

    const created = db.createUser(newUser);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
