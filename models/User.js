const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: String,
  password: String,
  balance: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
