const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const Guest = require('./models/Guest');
require('dotenv').config();

async function syncGuests() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bss_residency');
    console.log('Connected to MongoDB...');

    // 1. Clear old demo data
    await Guest.deleteMany({});
    console.log('Cleared old guest data.');

    // 2. Get all real bookings
    const bookings = await Booking.find({});
    console.log(`Found ${bookings.length} bookings to process.`);

    for (const b of bookings) {
      let guest = await Guest.findOne({ phone: b.phone });
      if (guest) {
        guest.totalStays += 1;
        if (guest.totalStays >= 10) guest.loyaltyLevel = 'VIP';
        else if (guest.totalStays >= 3) guest.loyaltyLevel = 'Regular';
        await guest.save();
      } else {
        guest = new Guest({
          name: b.name,
          phone: b.phone,
          email: b.email,
          totalStays: 1,
          loyaltyLevel: 'New'
        });
        await guest.save();
      }
    }

    console.log('Guest list synchronized successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error syncing guests:', err);
    process.exit(1);
  }
}

syncGuests();
