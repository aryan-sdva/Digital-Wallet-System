const express = require('express');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const router = express.Router();

router.get('/flagged', async (req, res) => {
  const flagged = await Transaction.find({ isFlagged: true });
  res.json(flagged);
});

router.get('/top-users', async (req, res) => {
  const top = await User.find().sort({ balance: -1 }).limit(5);
  res.json(top);
});

router.get('/total-balances', async (req, res) => {
  const users = await User.find();
  const total = users.reduce((sum, u) => sum + u.balance, 0);
  res.json({ total });
});

module.exports = router;
