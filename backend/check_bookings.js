const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const Booking = require('./models/Booking');
  const total = await Booking.countDocuments();
  console.log('=== Total Bookings in DB:', total, '===\n');

  const bookings = await Booking.find().sort({ createdAt: -1 }).limit(10).lean();
  
  if (bookings.length === 0) {
    console.log('NO BOOKINGS FOUND IN DATABASE!');
  }

  bookings.forEach((b, i) => {
    console.log('--- Booking', i + 1, '---');
    console.log('Booking ID:', b.bookingId);
    console.log('Name:', b.name);
    console.log('Phone:', b.phone);
    console.log('Room:', b.roomType);
    console.log('Check-in:', b.checkIn);
    console.log('Check-out:', b.checkOut);
    console.log('Status:', b.status);
    console.log('Payment Status:', b.paymentStatus || 'N/A');
    console.log('Razorpay Payment ID:', b.razorpayPaymentId || 'NONE');
    console.log('Advance Paid:', b.advancePaid || 0);
    console.log('Created:', b.createdAt);
    console.log('');
  });

  await mongoose.disconnect();
  process.exit(0);
}).catch(err => {
  console.error('DB Error:', err.message);
  process.exit(1);
});
