const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.use(auth);

router.post('/deposit', async (req, res) => {
  const { amount } = req.body;
  if (amount <= 0) return res.status(400).json({ error: 'Invalid deposit amount' });

  const user = await User.findById(req.userId);
  user.balance += amount;
  await user.save();

  await new Transaction({ from: 'system', to: user.username, amount, type: 'deposit' }).save();
  res.json({ message: 'Deposit successful' });
});

router.post('/withdraw', async (req, res) => {
  const { amount } = req.body;
  if (amount <= 0) return res.status(400).json({ error: 'Invalid withdrawal amount' });

  const user = await User.findById(req.userId);
  if (user.balance < amount) return res.status(400).json({ error: 'Insufficient funds' });

  user.balance -= amount;
  await user.save();

  await new Transaction({ from: user.username, to: 'system', amount, type: 'withdraw' }).save();
  res.json({ message: 'Withdrawal successful' });
});

router.post('/transfer', async (req, res) => {
  const { toUsername, amount } = req.body;
  if (amount <= 0) return res.status(400).json({ error: 'Invalid transfer amount' });

  const fromUser = await User.findById(req.userId);
  const toUser = await User.findOne({ username: toUsername });

  if (!toUser || toUser.isDeleted) return res.status(404).json({ error: 'Recipient not found' });
  if (fromUser.balance < amount) return res.status(400).json({ error: 'Insufficient funds' });

  fromUser.balance -= amount;
  toUser.balance += amount;
  await fromUser.save();
  await toUser.save();

  await new Transaction({ from: fromUser.username, to: toUser.username, amount, type: 'transfer' }).save();
  res.json({ message: 'Transfer successful' });
});

router.get('/history', async (req, res) => {
  const user = await User.findById(req.userId);
  const history = await Transaction.find({ $or: [{ from: user.username }, { to: user.username }] });
  res.json(history);
});

module.exports = router;
