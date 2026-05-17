const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  lastLogin: {
    type: Date
  },
  fcmTokens: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model('Admin', AdminSchema);
