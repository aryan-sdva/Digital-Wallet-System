const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  from: String,
  to: String,
  amount: Number,
  type: String,
  timestamp: { type: Date, default: Date.now },
  isFlagged: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Transaction', transactionSchema);
