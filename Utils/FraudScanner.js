const Transaction = require('../models/Transaction');

module.exports.runDailyScan = async () => {
  const all = await Transaction.find({});
  const now = new Date();

  all.forEach(tx => {
    const timeDiff = (now - new Date(tx.timestamp)) / 1000; // in seconds
    if ((tx.amount > 1000 || timeDiff < 60) && tx.type !== 'deposit') {
      tx.isFlagged = true;
      tx.save();
    }
  });
};
