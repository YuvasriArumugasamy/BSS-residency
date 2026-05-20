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
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// --- NEW RAZORPAY ROUTES ---

// 1. Create Razorpay Order
router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    console.log(`[Razorpay] Creating order for amount: ${amount}`);
    
    const options = {
      amount: 20 * 100, // Temporarily set to 20 for testing
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

    console.log('[Verify Payment] Received request:', { razorpay_order_id, razorpay_payment_id, bookingData: bookingData?.name });

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      console.error('[Verify Payment] Invalid signature!');
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    console.log('[Verify Payment] Signature valid ✅');

    // Check if this payment was already processed (duplicate request protection)
    const existingBooking = await Booking.findOne({ razorpayPaymentId: razorpay_payment_id });
    if (existingBooking) {
      console.log('[Verify Payment] Duplicate payment detected, returning existing booking');
      return res.json({ success: true, bookingId: existingBooking.bookingId, booking: existingBooking });
    }

    // Payment is valid, now save the booking
    const { name, phone, email, roomType, checkIn, checkOut, guests, rooms, message } = bookingData;
    const roomCount = Number(rooms) || 1;

    // --- Availability Check ---
    const totalRoomsCount = await Room.countDocuments({ type: roomType });
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    
    const overlappingBookings = await Booking.find({
      roomType,
      status: { $in: ['Confirmed', 'Pending'] },
      $or: [
        { checkIn: { $lt: end }, checkOut: { $gt: start } }
      ]
    });

    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const occupiedOnDay = overlappingBookings.reduce((acc, b) => {
        if (d >= new Date(b.checkIn) && d < new Date(b.checkOut)) {
          return acc + (b.rooms || 1);
        }
        return acc;
      }, 0);
      
      if (occupiedOnDay + roomCount > totalRoomsCount) {
        console.warn('[Verify Payment] Room not available for selected dates');
        return res.status(400).json({ 
          success: false, 
          message: `Sorry, rooms of type '${roomType}' are fully booked for some of your selected dates. Payment received — please contact us for a refund or alternate dates.` 
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

    // Calculate Price
    const settings = await Setting.findOne({ key: 'isSeason' });
    const isSeason = settings ? settings.value === true : false;
    const ROOM_DATA = {
      'Double Bed': { season: 1300, nonSeason: 1000 },
      'Double Bed A/C': { season: 1600, nonSeason: 1300 },
      'Four Bed': { season: 2500, nonSeason: 2000 },
      'Four Bed A/C': { season: 2800, nonSeason: 2300 },
    };
    const roomPriceInfo = ROOM_DATA[roomType] || { season: 1000, nonSeason: 1000 };
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
      status: 'Confirmed', // Set to confirmed since payment is done
      roomCharges,
      gstAmount,
      totalPrice,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      advancePaid: 20, // Temporarily set to 20 for testing
      paymentStatus: 'Completed'
    });

    await booking.save();
    console.log(`[Verify Payment] Booking saved successfully: ${bookingId}`);

    // Create Notification
    try {
      await new Notification({
        title: '💰 New Paid Booking',
        message: `${name} paid ₹510 advance for ${roomType}.`,
        type: 'booking'
      }).save();
    } catch (e) {}

    // Send Emails & Push Notifications
    sendBookingReceivedEmail(booking).catch(e => console.error(e));
    sendNewBookingAdminAlert(booking).catch(e => console.error(e));
    const { sendPushNotificationToAdmins } = require('../utils/fcmService');
    sendPushNotificationToAdmins(
      '💰 New Paid Booking!',
      `${name} booked ${roomType} for ${guests} guests.`
    );

    // Update Guest database (loyalty tracking)
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
    } catch (guestErr) {
      console.error('Error updating guest record:', guestErr);
    }

    res.json({ success: true, bookingId: booking.bookingId, booking });
  } catch (err) {
    console.error('Payment Verification Error:', err);
    res.status(500).json({ success: false, message: 'Internal server error during verification' });
  }
});

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

    // --- Price Calculation ---
    const settings = await Setting.findOne({ key: 'isSeason' });
    const isSeason = settings ? settings.value === true : false;
    
    const ROOM_DATA = {
      'Double Bed': { season: 1300, nonSeason: 1000 },
      'Double Bed A/C': { season: 1600, nonSeason: 1300 },
      'Four Bed': { season: 2500, nonSeason: 2000 },
      'Four Bed A/C': { season: 2800, nonSeason: 2300 },
    };

    const roomPriceInfo = ROOM_DATA[roomType] || { season: 1000, nonSeason: 1000 };
    const unitPrice = isSeason ? roomPriceInfo.season : roomPriceInfo.nonSeason;
    const nights = Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)));
    
    const roomCharges = unitPrice * nights * roomCount;
    const gstAmount = Math.round(roomCharges * 0.12);
    const totalPrice = roomCharges + gstAmount;
    // --- End Price Calculation ---

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
      const notif = new Notification({
        title: 'New Booking Request',
        message: `${name} requested a ${roomType} for ${guests} guest(s).`,
        type: 'booking'
      });
      await notif.save();
    } catch (notifErr) {
      console.error('Error creating notification:', notifErr);
    }

    // 📧 Send Email Notifications (non-blocking) & Push Notifications
    sendBookingReceivedEmail(booking).catch(err => console.error('Email to customer failed:', err));
    sendNewBookingAdminAlert(booking).catch(err => console.error('Email to admin failed:', err));
    const { sendPushNotificationToAdmins } = require('../utils/fcmService');
    sendPushNotificationToAdmins(
      '🔔 New Booking Request',
      `${name} requested ${roomType} for ${guests} guests.`
    );

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
    console.error('CRITICAL BOOKING ERROR:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again or contact us directly.', 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
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
        roomCharges: booking.roomCharges,
        gstAmount: booking.gstAmount,
        totalPrice: booking.totalPrice,
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
