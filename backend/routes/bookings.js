const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Guest = require('../models/Guest');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const { sendBookingReceivedEmail, sendNewBookingAdminAlert } = require('../utils/emailService');

// POST /api/bookings — Create new booking
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, roomType, checkIn, checkOut, guests, rooms, message } = req.body;

    if (!name || !phone || !roomType || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      return res.status(400).json({ success: false, message: 'Check-out must be after check-in.' });
    }

    const roomCount = Math.max(1, Number(rooms) || 1);

    // --- Availability Check ---
    const totalRoomsCount = await Room.countDocuments({ type: roomType });
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    
    const existingBookings = await Booking.find({
      roomType,
      status: { $in: ['Confirmed', 'Pending'] },
      $or: [
        { checkIn: { $lt: end }, checkOut: { $gt: start } }
      ]
    });

    // Check each day of the stay
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const occupiedOnDay = existingBookings.reduce((acc, b) => {
        if (d >= new Date(b.checkIn) && d < new Date(b.checkOut)) {
          return acc + (b.rooms || 1);
        }
        return acc;
      }, 0);
      
      if (occupiedOnDay + roomCount > totalRoomsCount) {
        return res.status(400).json({ 
          success: false, 
          message: `Sorry, only ${totalRoomsCount - occupiedOnDay} rooms of type '${roomType}' are available for some of your selected dates.` 
        });
      }
    }
    // --- End Availability Check ---

    // Generate unique 6-digit booking ID
    let bookingId;
    let isUnique = false;
    while (!isUnique) {
      bookingId = Math.floor(100000 + Math.random() * 900000).toString();
      const existing = await Booking.findOne({ bookingId });
      if (!existing) isUnique = true;
    }

    const booking = new Booking({
      bookingId,
      name,
      phone,
      email,
      roomType,
      checkIn,
      checkOut,
      guests,
      rooms: roomCount,
      message,
      status: 'Pending',
    });
    await booking.save();

    // Create Notification
    try {
      const notif = new Notification({
        title: 'New Booking Request',
        message: `${name} requested a ${roomType} for ${guests} guest(s).`,
        type: 'booking'
      });
      await notif.save();
    } catch (notifErr) {
      console.error('Error creating notification:', notifErr);
    }

    // 📧 Send Email Notifications (non-blocking)
    sendBookingReceivedEmail(booking).catch(err => console.error('Email to customer failed:', err));
    sendNewBookingAdminAlert(booking).catch(err => console.error('Email to admin failed:', err));

    // Automation: Update Guest database
    try {
      let guest = await Guest.findOne({ phone });
      if (guest) {
        guest.totalStays += 1;
        // Simple loyalty logic
        if (guest.totalStays >= 10) guest.loyaltyLevel = 'VIP';
        else if (guest.totalStays >= 3) guest.loyaltyLevel = 'Regular';
        await guest.save();
      } else {
        guest = new Guest({
          name,
          phone,
          email,
          totalStays: 1,
          loyaltyLevel: 'New'
        });
        await guest.save();
      }
    } catch (guestErr) {
      console.error('Error updating guest record:', guestErr);
      // Don't fail the booking if guest update fails
    }

    res.status(201).json({
      success: true,
      message: 'Booking received! We will confirm your booking via WhatsApp shortly.',
      booking,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
});

// GET /api/bookings/availability — Get availability by room type and month
router.get('/availability', async (req, res) => {
  try {
    const { roomType, month, year } = req.query;

    if (!roomType || !month || !year) {
      // Backwards compatibility for initial load or legacy calls
      const rooms = await Room.find({ status: 'Available' });
      const simpleAvailability = {};
      rooms.forEach(r => {
        simpleAvailability[r.type] = (simpleAvailability[r.type] || 0) + 1;
      });
      return res.json({ success: true, availability: simpleAvailability });
    }

    // 1. Get total rooms of this type
    const totalRoomsCount = await Room.countDocuments({ type: roomType });

    // 2. Define month range
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    // 3. Get bookings that overlap with this month
    const bookings = await Booking.find({
      roomType,
      status: { $in: ['Confirmed', 'Pending'] },
      $or: [
        { checkIn: { $gte: startOfMonth, $lte: endOfMonth } },
        { checkOut: { $gte: startOfMonth, $lte: endOfMonth } },
        { checkIn: { $lte: startOfMonth }, checkOut: { $gte: endOfMonth } }
      ]
    });

    // 4. Calculate availability for each day
    const availability = {};
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(year, month - 1, day);
      const occupiedCount = bookings.reduce((count, b) => {
        const ci = new Date(b.checkIn);
        const co = new Date(b.checkOut);
        // Occupied from checkIn up to (but not including) checkOut
        if (currentDay >= ci && currentDay < co) {
          return count + (b.rooms || 1);
        }
        return count;
      }, 0);

      availability[day] = Math.max(0, totalRoomsCount - occupiedCount);
    }

    res.json({ success: true, availability, totalRooms: totalRoomsCount });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/bookings/:id — Get booking status by ID (for guests)
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // Search by custom bookingId first, then by MongoDB _id
    let booking = await Booking.findOne({ bookingId: id });
    
    if (!booking && mongoose.Types.ObjectId.isValid(id)) {
      booking = await Booking.findById(id);
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found. Please check your Booking ID.' });
    }
    // Return only safe fields to the guest
    res.json({
      success: true,
      booking: {
        _id: booking._id,
        bookingId: booking.bookingId,
        name: booking.name,
        phone: booking.phone,
        email: booking.email,
        roomType: booking.roomType,
        roomNumber: booking.roomNumber,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        rooms: booking.rooms,
        status: booking.status,
        message: booking.message,
        createdAt: booking.createdAt,
      },
    });
  } catch (err) {
    // Handle invalid ObjectId format
    if (err.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Invalid Booking ID format.' });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/bookings/availability — Get availability by room type and month
router.get('/availability', async (req, res) => {
  try {
    const { roomType, month, year } = req.query;

    if (!roomType || !month || !year) {
      // Backwards compatibility for initial load or legacy calls
      const rooms = await Room.find({ status: 'Available' });
      const simpleAvailability = {};
      rooms.forEach(r => {
        simpleAvailability[r.type] = (simpleAvailability[r.type] || 0) + 1;
      });
      return res.json({ success: true, availability: simpleAvailability });
    }

    // 1. Get total rooms of this type
    const totalRoomsCount = await Room.countDocuments({ type: roomType });

    // 2. Define month range
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    // 3. Get bookings that overlap with this month
    const bookings = await Booking.find({
      roomType,
      status: { $in: ['Confirmed', 'Pending'] },
      $or: [
        { checkIn: { $gte: startOfMonth, $lte: endOfMonth } },
        { checkOut: { $gte: startOfMonth, $lte: endOfMonth } },
        { checkIn: { $lte: startOfMonth }, checkOut: { $gte: endOfMonth } }
      ]
    });

    // 4. Calculate availability for each day
    const availability = {};
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(year, month - 1, day);
      const occupiedCount = bookings.reduce((count, b) => {
        const ci = new Date(b.checkIn);
        const co = new Date(b.checkOut);
        // Occupied from checkIn up to (but not including) checkOut
        if (currentDay >= ci && currentDay < co) {
          return count + (b.rooms || 1);
        }
        return count;
      }, 0);

      availability[day] = Math.max(0, totalRoomsCount - occupiedCount);
    }

    res.json({ success: true, availability, totalRooms: totalRoomsCount });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/bookings/reviews — Get all public reviews
router.get('/public/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ date: -1 }).limit(10);
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/bookings/reviews — Submit a new review
router.post('/public/reviews', async (req, res) => {
  try {
    const { guestName, rating, comment } = req.body;
    if (!guestName || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    const review = new Review({ guestName, rating, comment });
    await review.save();

    // Create Notification
    try {
      const notif = new Notification({
        title: 'New Guest Review',
        message: `${guestName} left a ${rating}-star review.`,
        type: 'system'
      });
      await notif.save();
    } catch (notifErr) {
      console.error('Error creating review notification:', notifErr);
    }

    res.status(201).json({ success: true, message: 'Review submitted! Thank you.', review });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/bookings/:id/checkin — Online Check-in submission
router.post('/:id/checkin', async (req, res) => {
  try {
    const id = req.params.id;
    let booking = await Booking.findOne({ bookingId: id });
    if (!booking && mongoose.Types.ObjectId.isValid(id)) {
      booking = await Booking.findById(id);
    }
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }
    if (booking.checkedInOnline) {
      return res.status(400).json({ success: false, message: 'You have already completed online check-in.' });
    }

    const {
      fullName, age, gender, address, city, state, pincode,
      idType, idNumber, idProofImage,
      numberOfGuests, guestNames, vehicleNumber, specialRequests
    } = req.body;

    if (!fullName || !idType || !idNumber) {
      return res.status(400).json({ success: false, message: 'Name, ID type and ID number are required.' });
    }

    booking.checkedInOnline = true;
    booking.checkinData = {
      fullName, age, gender, address, city, state, pincode,
      idType, idNumber, idProofImage: idProofImage || '',
      numberOfGuests: numberOfGuests || booking.guests,
      guestNames: guestNames || [],
      vehicleNumber: vehicleNumber || '',
      specialRequests: specialRequests || '',
      checkinTime: new Date(),
    };

    await booking.save();

    // Create Notification for admin
    try {
      await new Notification({
        title: '🧾 Online Check-in Completed',
        message: `${booking.name} has completed online check-in for ${booking.roomType}.`,
        type: 'booking',
      }).save();
    } catch (e) { /* silent */ }

    res.json({ success: true, message: 'Online check-in completed successfully!', booking });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
