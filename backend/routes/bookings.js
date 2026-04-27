const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Guest = require('../models/Guest');
const Review = require('../models/Review');
const Notification = require('../models/Notification');

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

// GET /api/bookings/availability — Get availability by room type
router.get('/availability', async (req, res) => {
  try {
    const rooms = await Room.find({ status: 'Available' });
    const availability = {};

    // Group available counts by type — matches constants.js ROOMS[].name
    rooms.forEach(r => {
      const key = r.type; // e.g. "Double Bed", "Double Bed A/C"
      availability[key] = (availability[key] || 0) + 1;
    });

    res.json({ success: true, availability });
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

module.exports = router;
