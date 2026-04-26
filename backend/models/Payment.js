const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    guestName: { type: String, required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['Cash', 'UPI', 'Card', 'Net Banking'], default: 'Cash' },
    status: { type: String, enum: ['Paid', 'Pending', 'Refunded'], default: 'Paid' },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
