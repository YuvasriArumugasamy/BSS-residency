const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Guest = require('../models/Guest');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const Setting = require('../models/Setting');
const { sendBookingReceivedEmail, sendNewBookingAdminAlert } = require('../utils/emailService');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_SptqBPCmbCGB7n',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dbuYegX0jlZctWtfmMz6MhWy',
});

// --- RAZORPAY ROUTES ---

// 1. Create Razorpay Order
router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    console.log(`[Razorpay] Creating order for amount: ${amount}`);
    
    const options = {
      amount: 20 * 100, // Fixed ₹20 for easy live/sandbox testing
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    console.log(`[Razorpay] Order created successfully: ${order.id}`);
    
    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
    });
  } catch (err) {
    console.error('Razorpay Order Error Details:', err);
    res.status(500).json({ success: false, message: 'Failed to create payment order', error: err.message });
  }
});

// 2. Verify Payment and Save Booking
router.post('/verify-payment', async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      bookingData 
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'dbuYegX0jlZctWtfmMz6MhWy')
      .update(body.toString())
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    const { name, phone, email, roomType, checkIn, checkOut, guests, rooms, message } = bookingData;

    // Generate unique 6-digit booking ID
    let bookingId;
    let isUnique = false;
    while (!isUnique) {
      bookingId = Math.floor(100000 + Math.random() * 900000).toString();
      const existing = await Booking.findOne({ bookingId });
      if (!existing) isUnique = true;
    }

    // Calculate Price
    const settings = await Setting.findOne({ key: 'isSeason' });
    const isSeason = settings ? settings.value === true : false;
    const ROOM_DATA = {
      'non-ac': { season: 2000, nonSeason: 1500 },
      'ac': { season: 2500, nonSeason: 2000 },
      'suite': { season: 12000, nonSeason: 10000 },
    };
    const roomPriceInfo = ROOM_DATA[roomType] || { season: 1500, nonSeason: 1500 };
    const unitPrice = isSeason ? roomPriceInfo.season : roomPriceInfo.nonSeason;
    const nights = Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)));
    const roomCount = Number(rooms) || 1;
    const roomCharges = unitPrice * nights * roomCount;
    const gstAmount = Math.round(roomCharges * 0.12);
    const totalPrice = roomCharges + gstAmount;

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
      status: 'Confirmed', 
      roomCharges,
      gstAmount,
      totalPrice,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      advancePaid: 20, 
      paymentStatus: 'Completed'
    });

    await booking.save();

    // Create Notification
    try {
      await new Notification({
        title: '💰 New Paid Booking',
        message: `${name} paid ₹20 advance for ${roomType.toUpperCase()}.`,
        type: 'booking'
      }).save();
    } catch (e) {}

    // Send Emails & SMS non-blocking
    sendBookingReceivedEmail(booking).catch(e => console.error(e));
    sendNewBookingAdminAlert(booking).catch(e => console.error(e));

    // Update guest profile loyalty
    try {
      let guest = await Guest.findOne({ phone });
      if (guest) {
        guest.totalStays += 1;
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
    } catch (guestErr) {}

    res.json({ success: true, bookingId: booking.bookingId, booking });
  } catch (err) {
    console.error('Payment Verification Error:', err);
    res.status(500).json({ success: false, message: 'Internal server error during verification' });
  }
});

// POST /api/booking — Create new standard booking (Pending status)
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

    // Check each day of stay
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const occupiedOnDay = existingBookings.reduce((acc, b) => {
        if (d >= new Date(b.checkIn) && d < new Date(b.checkOut)) {
          return acc + (b.rooms || 1);
        }
        return acc;
      }, 0);
      
      if (totalRoomsCount > 0 && occupiedOnDay + roomCount > totalRoomsCount) {
        return res.status(400).json({ 
          success: false, 
          message: `Sorry, only ${totalRoomsCount - occupiedOnDay} rooms of type '${roomType.toUpperCase()}' are available for some of your selected dates.` 
        });
      }
    }

    // Generate unique 6-digit booking ID
    let bookingId;
    let isUnique = false;
    while (!isUnique) {
      bookingId = Math.floor(100000 + Math.random() * 900000).toString();
      const existing = await Booking.findOne({ bookingId });
      if (!existing) isUnique = true;
    }

    // --- Price Calculation ---
    const settings = await Setting.findOne({ key: 'isSeason' });
    const isSeason = settings ? settings.value === true : false;
    
    const ROOM_DATA = {
      'non-ac': { season: 2000, nonSeason: 1500 },
      'ac': { season: 2500, nonSeason: 2000 },
      'suite': { season: 12000, nonSeason: 10000 },
    };

    const roomPriceInfo = ROOM_DATA[roomType] || { season: 1500, nonSeason: 1500 };
    const unitPrice = isSeason ? roomPriceInfo.season : roomPriceInfo.nonSeason;
    const nights = Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)));
    
    const roomCharges = unitPrice * nights * roomCount;
    const gstAmount = Math.round(roomCharges * 0.12);
    const totalPrice = roomCharges + gstAmount;

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
      roomCharges,
      gstAmount,
      totalPrice
    });
    await booking.save();

    // Create Notification
    try {
      await new Notification({
        title: 'New Booking Request',
        message: `${name} requested a ${roomType.toUpperCase()} for ${guests} guest(s).`,
        type: 'booking'
      }).save();
    } catch (notifErr) {}

    // Send notifications non-blocking
    sendBookingReceivedEmail(booking).catch(err => console.error(err));
    sendNewBookingAdminAlert(booking).catch(err => console.error(err));

    // Update Guest database
    try {
      let guest = await Guest.findOne({ phone });
      if (guest) {
        guest.totalStays += 1;
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
    } catch (guestErr) {}

    res.status(201).json({
      success: true,
      message: 'Booking received! We will confirm your booking via WhatsApp shortly.',
      booking,
    });
  } catch (err) {
    console.error('CRITICAL BOOKING ERROR:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again.', 
      error: err.message,
    });
  }
});

// GET /api/booking/availability — Get dynamic availability
router.get('/availability', async (req, res) => {
  try {
    const { roomType, month, year } = req.query;

    if (!roomType || !month || !year) {
      const rooms = await Room.find({ status: 'Available' });
      const simpleAvailability = {};
      rooms.forEach(r => {
        simpleAvailability[r.type] = (simpleAvailability[r.type] || 0) + 1;
      });
      return res.json({ success: true, availability: simpleAvailability });
    }

    const totalRoomsCount = await Room.countDocuments({ type: roomType });
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const bookings = await Booking.find({
      roomType,
      status: { $in: ['Confirmed', 'Pending'] },
      $or: [
        { checkIn: { $gte: startOfMonth, $lte: endOfMonth } },
        { checkOut: { $gte: startOfMonth, $lte: endOfMonth } },
        { checkIn: { $lte: startOfMonth }, checkOut: { $gte: endOfMonth } }
      ]
    });

    const availability = {};
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(year, month - 1, day);
      const occupiedCount = bookings.reduce((count, b) => {
        const ci = new Date(b.checkIn);
        const co = new Date(b.checkOut);
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

// GET /api/booking/public/reviews — Reviews
router.get('/public/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ date: -1 }).limit(15);
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/booking/public/reviews
router.post('/public/reviews', async (req, res) => {
  try {
    const { guestName, rating, comment } = req.body;
    if (!guestName || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    const review = new Review({ guestName, rating, comment });
    await review.save();

    try {
      await new Notification({
        title: 'New Guest Review',
        message: `${guestName} left a ${rating}-star review.`,
        type: 'system'
      }).save();
    } catch (e) {}

    res.status(201).json({ success: true, message: 'Review submitted successfully!', review });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/booking/:id — Status tracking
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    let booking = await Booking.findOne({ bookingId: id });
    
    if (!booking && mongoose.Types.ObjectId.isValid(id)) {
      booking = await Booking.findById(id);
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found. Please check your Booking ID.' });
    }
    
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
        roomCharges: booking.roomCharges,
        gstAmount: booking.gstAmount,
        totalPrice: booking.totalPrice,
        checkedInOnline: booking.checkedInOnline
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/booking/:id/checkin — Online check-in
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

    try {
      await new Notification({
        title: '🧾 Online Check-in Completed',
        message: `${booking.name} completed online check-in for ${booking.roomType.toUpperCase()}.`,
        type: 'booking',
      }).save();
    } catch (e) {}

    res.json({ success: true, message: 'Online check-in completed successfully!', booking });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
