const mongoose = require('mongoose');

const blockedDateSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, default: 'Admin blocked' },
}, { timestamps: true });

module.exports = mongoose.model('BlockedDate', blockedDateSchema);
