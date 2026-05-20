const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Guest = require('../models/Guest');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const Setting = require('../models/Setting');
const Admin = require('../models/Admin');
const { sendBookingConfirmedEmail, sendBookingCancelledEmail } = require('../utils/emailService');

const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '919344989393';

// Helper: build a wa.me confirmation link for a booking
function buildWaConfirmLink(booking) {
  const checkIn = new Date(booking.checkIn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const checkOut = new Date(booking.checkOut).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const msg =
    `✅ *BSS Residency – Booking Confirmed!*\n\n` +
    `Dear ${booking.name},\n\n` +
    `Your booking has been *confirmed*. Here are your details:\n\n` +
    `🆔 Booking ID: *${booking.bookingId || booking._id}*\n` +
    `🛏️ Room: *${booking.roomType}*${booking.roomNumber ? ` (Room #${booking.roomNumber})` : ''}\n` +
    `📅 Check-in: *${checkIn}*\n` +
    `📅 Check-out: *${checkOut}*\n` +
    `👥 Guests: *${booking.guests}*\n\n` +
    `📍 BSS Residency, Bus Stand, Near Anna Statue, Courtallam – 627 802\n\n` +
    `We look forward to hosting you! 🙏`;

  // Build link to guest's number
  const guestPhone = booking.phone.replace(/[^0-9]/g, '');
  const formattedPhone = guestPhone.startsWith('91') ? guestPhone : `91${guestPhone}`;
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`;
}

function buildWaCancelLink(booking, reason = '') {
  const msg =
    `❌ *BSS Residency – Booking Update*\n\n` +
    `Dear ${booking.name},\n\n` +
    `We regret to inform you that your booking (ID: *${booking.bookingId || booking._id}*) has been *cancelled*.\n` +
    (reason ? `Reason: ${reason}\n` : '') +
    `\nPlease contact us to rebook or for further assistance.\n📞 +91 88385 99755`;
  const guestPhone = booking.phone.replace(/[^0-9]/g, '');
  const formattedPhone = guestPhone.startsWith('91') ? guestPhone : `91${guestPhone}`;
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`;
}

// Simple auth middleware — checks DB first, then ENV fallback
const adminAuth = async (req, res, next) => {
  try {
    const { username, password } = req.headers;
    if (!username || !password) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    const trimUser = username.trim();
    
    // Check DB first with case-insensitive username search
    let admin = await Admin.findOne({ 
      username: { $regex: new RegExp('^' + trimUser + '$', 'i') }, 
      password 
    });
    
    // ENV fallback: if DB has no admin yet, check environment variables
    if (!admin) {
      const envUser = (process.env.ADMIN_USERNAME || 'santhosh').trim();
      const envPass = (process.env.ADMIN_PASSWORD || 'santhosh@123').trim();
      if (trimUser.toLowerCase() === envUser.toLowerCase() && password === envPass) {
        // Auto-create admin in DB if not exists
        const existing = await Admin.findOne({ 
          username: { $regex: new RegExp('^' + trimUser + '$', 'i') } 
        });
        if (!existing) {
          await Admin.create({ username: trimUser.toLowerCase(), password });
          console.log('Auto-created admin from ENV:', trimUser.toLowerCase());
        }
        return next();
      }
    }
    
    if (admin) {
      next();
    } else {
      res.status(401).json({ success: false, message: 'Unauthorized' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message, stack: err.stack });
  }
};
 
// POST /api/admin/login — Verify credentials (DB + ENV fallback)
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Invalid username or password' });
    }

    const trimUser = username.trim();

    // --- TEMPORARY OVERRIDE TO FORCE RESET PASSWORD ---
    if (trimUser.toLowerCase() === 'santhosh' && password === 'santhosh@123') {
        let admin = await Admin.findOne({ username: { $regex: /^santhosh$/i } });
        if (admin) {
            admin.password = 'santhosh@123';
            admin.lastLogin = new Date();
            await admin.save();
        } else {
            await Admin.create({ username: 'santhosh', password: 'santhosh@123', lastLogin: new Date() });
        }
        return res.json({ success: true, message: 'Login successful (Password Reset)' });
    }
    // ---------------------------------------------------
 
    let admin = await Admin.findOne({ 
      username: { $regex: new RegExp('^' + trimUser + '$', 'i') }, 
      password 
    });
 
    // ENV fallback: allow login from environment variables if DB has no admin
    if (!admin) {
      const envUser = (process.env.ADMIN_USERNAME || 'santhosh').trim();
      const envPass = (process.env.ADMIN_PASSWORD || 'santhosh@123').trim();
      if (trimUser.toLowerCase() === envUser.toLowerCase() && password === envPass) {
        // Auto-create in DB so future logins use DB
        const existing = await Admin.findOne({ 
          username: { $regex: new RegExp('^' + trimUser + '$', 'i') } 
        });
        if (!existing) {
          admin = await Admin.create({ username: trimUser.toLowerCase(), password, lastLogin: new Date() });
          console.log('Admin auto-created from ENV on first login:', trimUser.toLowerCase());
        } else {
          admin = existing;
          existing.lastLogin = new Date();
          await existing.save();
        }
        return res.json({ success: true, message: 'Login successful' });
      }
    }
 
    if (admin) {
      admin.lastLogin = new Date();
      await admin.save();
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/bookings — All bookings
router.get('/bookings', adminAuth, async (req, res) => {
  try {
    const { status, roomType, page = 1, limit = 10, period = 'all', month, year } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (roomType) filter.roomType = roomType;

    if (period === 'month') {
      let start, end;
      if (month && year) {
        const y = parseInt(year, 10);
        const m = parseInt(month, 10);
        start = new Date(y, m - 1, 1);
        end = new Date(y, m, 0, 23, 59, 59, 999);
      } else {
        const now = new Date();
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      }
      // Filter by checkIn date for stays in that month
      filter.checkIn = { $gte: start, $lte: end };
    }

    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 }) // Newest bookings first (Recent Bookings)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/admin/bookings/:id — Update booking status / roomNumber
router.patch('/bookings/:id', adminAuth, async (req, res) => {
  try {
    const { status, roomNumber, cancellationReason } = req.body;

    // Fetch the booking BEFORE update to know the old room and old status
    const oldBooking = await Booking.findById(req.params.id);
    if (!oldBooking) return res.status(404).json({ success: false, message: 'Booking not found' });

    const updateFields = {};
    if (status) updateFields.status = status;
    if (roomNumber !== undefined) updateFields.roomNumber = roomNumber;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    // --- Dynamic Room Status Automation ---
    // 1. If old room exists and has changed (or removed), set old room to Available
    if (oldBooking.roomNumber && oldBooking.roomNumber !== booking.roomNumber) {
      await Room.findOneAndUpdate({ roomNumber: oldBooking.roomNumber }, { status: 'Available' });
    }

    // 2. If the current status is Confirmed, set the new room to Occupied
    if (booking.status === 'Confirmed' && booking.roomNumber) {
      await Room.findOneAndUpdate({ roomNumber: booking.roomNumber }, { status: 'Occupied' });
    }

    // 3. If the status is Checked-out or Cancelled, free up the room
    if ((booking.status === 'Checked-out' || booking.status === 'Cancelled') && booking.roomNumber) {
      await Room.findOneAndUpdate({ roomNumber: booking.roomNumber }, { status: 'Available' });
    }

    // Build WhatsApp link for admin to send to guest
    let waLink = null;
    if (status === 'Confirmed') {
      waLink = buildWaConfirmLink(booking);
      // 📧 Auto-send confirmation email to customer
      sendBookingConfirmedEmail(booking).catch(err => console.error('Confirm email failed:', err));
    } else if (status === 'Cancelled') {
      waLink = buildWaCancelLink(booking, cancellationReason);
      // 📧 Auto-send cancellation email to customer
      sendBookingCancelledEmail(booking, cancellationReason).catch(err => console.error('Cancel email failed:', err));
    }

    res.json({ success: true, booking, waLink });
  } catch (err) {
    console.error('Error in PATCH /bookings/:id:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/admin/bookings/:id — Delete booking
router.delete('/bookings/:id', adminAuth, async (req, res) => {
  try {
    // Free up room if booking had a room assigned
    const booking = await Booking.findById(req.params.id);
    if (booking && booking.roomNumber) {
      await Room.findOneAndUpdate({ roomNumber: booking.roomNumber }, { status: 'Available' });
    }
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/bookings/offline — Add manual offline booking (no payment check)
router.post('/bookings/offline', adminAuth, async (req, res) => {
  try {
    const { name, phone, email, roomType, checkIn, checkOut, guests, rooms, message, advancePaid, paymentMethod } = req.body;

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

    // Calculate Price details
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
      email: email || '',
      roomType,
      checkIn,
      checkOut,
      guests,
      rooms: roomCount,
      message: message || '',
      status: 'Confirmed', // Automatically confirm offline bookings
      roomCharges,
      gstAmount,
      totalPrice,
      advancePaid: Number(advancePaid) || 0,
      paymentStatus: (Number(advancePaid) > 0) ? 'Completed' : 'Pending',
    });

    await booking.save();

    try {
      await upsertGuestFromBooking({ name, phone, email });
    } catch (guestErr) {
      console.error('Guest upsert (offline booking):', guestErr.message);
    }

    // Create Payment record if advance was paid
    if (Number(advancePaid) > 0) {
      const payment = new Payment({
        guestName: name,
        bookingId: booking._id,
        amount: Number(advancePaid),
        method: paymentMethod || 'Cash',
        status: 'Paid',
        date: new Date(),
      });
      await payment.save();
    }

    // Send notification
    try {
      await new Notification({
        title: '📞 Offline Booking Added',
        message: `${name} booked ${roomType} directly. Advance: ₹${advancePaid || 0}`,
        type: 'booking'
      }).save();
    } catch (e) {}

    // Send push notification to admins
    try {
      const { sendPushNotificationToAdmins } = require('../utils/fcmService');
      sendPushNotificationToAdmins(
        '📞 Offline Booking Added',
        `${name} booked ${roomType} for ${guests} guests.`
      );
    } catch (pushErr) {}

    res.json({ success: true, message: 'Offline booking created successfully!', booking });
  } catch (err) {
    console.error('Offline Booking Creation Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/stats — Dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const { period = 'all', month, year } = req.query;
    let bookingFilter = {};
    let paymentFilter = { status: 'Paid' };

    if (period === 'month') {
      let start, end;
      if (month && year) {
        const y = parseInt(year, 10);
        const m = parseInt(month, 10);
        start = new Date(y, m - 1, 1);
        end = new Date(y, m, 0, 23, 59, 59, 999);
      } else {
        const now = new Date();
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      }
      bookingFilter.createdAt = { $gte: start, $lte: end };
      paymentFilter.date = { $gte: start, $lte: end };
    }

    const totalBookings = await Booking.countDocuments(bookingFilter);
    const pending = await Booking.countDocuments({ ...bookingFilter, status: 'Pending' });
    const confirmed = await Booking.countDocuments({ ...bookingFilter, status: 'Confirmed' });
    const cancelled = await Booking.countDocuments({ ...bookingFilter, status: 'Cancelled' });

    // Revenue tracking (Sum of all real payments in period)
    const payments = await Payment.find(paymentFilter);
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    // --- Dynamic Self-Healing Room Sync ---
    try {
      // 1. Fetch all active confirmed bookings with assigned room numbers
      const activeBookings = await Booking.find({ 
        status: 'Confirmed', 
        roomNumber: { $ne: null, $ne: '' } 
      });
      const occupiedRoomNumbers = activeBookings.map(b => b.roomNumber).filter(Boolean);

      // 2. Reset occupied/available statuses (keeping Maintenance rooms intact)
      await Room.updateMany({ status: { $ne: 'Maintenance' } }, { status: 'Available' });

      // 3. Set currently occupied room numbers to 'Occupied'
      if (occupiedRoomNumbers.length > 0) {
        await Room.updateMany(
          { roomNumber: { $in: occupiedRoomNumbers }, status: { $ne: 'Maintenance' } }, 
          { status: 'Occupied' }
        );
      }
    } catch (syncErr) {
      console.error('Self-healing room status sync failed:', syncErr);
    }

    // Occupancy (Current building state - usually not filtered by period)
    const totalRooms = await Room.countDocuments();
    const occupiedRooms = await Room.countDocuments({ status: 'Occupied' });
    const availableRooms = await Room.countDocuments({ status: 'Available' });

    // Today's activity
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);

    const checkInsToday = await Booking.countDocuments({
      checkIn: { $gte: todayStart, $lte: todayEnd },
      status: { $ne: 'Cancelled' }
    });
    const checkOutsToday = await Booking.countDocuments({
      checkOut: { $gte: todayStart, $lte: todayEnd },
      status: { $ne: 'Cancelled' }
    });

    // Room performance (aggregate by type in period)
    const byRoom = await Booking.aggregate([
      { $match: bookingFilter },
      { $group: { _id: '$roomType', count: { $sum: 1 } } }
    ]);

    // Revenue history (last 7 days - always shows last 7 days regardless of period)
    const revenueHistory = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const start = new Date(d); start.setHours(0, 0, 0, 0);
      const end = new Date(d); end.setHours(23, 59, 59, 999);

      const dayPayments = await Payment.find({
        date: { $gte: start, $lte: end },
        status: 'Paid'
      });
      const amount = dayPayments.reduce((sum, p) => sum + p.amount, 0);
      revenueHistory.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        amount
      });
    }

    res.json({
      success: true,
      stats: {
        totalBookings, pending, confirmed, cancelled, byRoom,
        totalRevenue, availableRooms, occupiedRooms, totalRooms,
        checkInsToday, checkOutsToday,
        revenueHistory,
        period
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- ROOM ROUTES ---

router.get('/rooms', adminAuth, async (req, res) => {
  try {
    const rooms = await Room.find().sort({ roomNumber: 1 }).collation({ locale: 'en', numericOrdering: true });
    res.json({ success: true, rooms });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/rooms', adminAuth, async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.json({ success: true, room });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.patch('/rooms/:id', adminAuth, async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, room });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/rooms/:id', adminAuth, async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- GUEST ROUTES ---
const { upsertGuestFromBooking, mergeGuestsForDisplay, normalizePhone } = require('../utils/guestService');

router.get('/guests', adminAuth, async (req, res) => {
  try {
    let guests = await Guest.find().sort({ createdAt: -1 });

    if (guests.length === 0) {
      const bookings = await Booking.find({});
      if (bookings.length > 0) {
        console.log(`Self-healing: Syncing ${bookings.length} bookings to Guests table...`);
        for (const b of bookings) {
          if (!b.phone) continue;
          try {
            await upsertGuestFromBooking({ name: b.name, phone: b.phone, email: b.email });
          } catch (e) {
            /* skip duplicate key races */
          }
        }
        guests = await Guest.find().sort({ createdAt: -1 });
      }
    }

    const merged = mergeGuestsForDisplay(guests);
    res.json({ success: true, guests: merged });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/guests/:id', adminAuth, async (req, res) => {
  try {
    await Guest.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Guest record deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- PAYMENT ROUTES ---
router.get('/payments', adminAuth, async (req, res) => {
  try {
    const payments = await Payment.find().sort({ date: -1 });
    res.json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/payments — Record a new payment manually
router.post('/payments', adminAuth, async (req, res) => {
  try {
    const { guestName, bookingId, amount, method, status } = req.body;
    if (!guestName || !amount) {
      return res.status(400).json({ success: false, message: 'Guest name and amount are required.' });
    }
    const payment = new Payment({
      guestName,
      bookingId: bookingId || undefined,
      amount: Number(amount),
      method: method || 'Cash',
      status: status || 'Paid',
      date: new Date(),
    });
    await payment.save();
    res.status(201).json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/admin/payments/:id — Remove a payment record
router.delete('/payments/:id', adminAuth, async (req, res) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- REVIEW ROUTES ---
router.get('/reviews', adminAuth, async (req, res) => {
  try {
    const { period = 'all', month, year } = req.query;
    const filter = {};

    if (period === 'month') {
      let start, end;
      if (month && year) {
        const y = parseInt(year, 10);
        const m = parseInt(month, 10);
        start = new Date(y, m - 1, 1);
        end = new Date(y, m, 0, 23, 59, 59, 999);
      } else {
        const now = new Date();
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      }
      filter.date = { $gte: start, $lte: end };
    }

    const reviews = await Review.find(filter).sort({ date: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/reviews/:id', adminAuth, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- SETTINGS ROUTES ---

// GET /api/admin/settings — Get all settings
router.get('/settings', adminAuth, async (req, res) => {
  try {
    const settings = await Setting.find();
    // Convert to a simple object for easy consumption
    const settingsObj = {};
    settings.forEach(s => { settingsObj[s.key] = s.value; });
    
    // Ensure isSeason exists
    if (settingsObj.isSeason === undefined) {
      settingsObj.isSeason = false;
    }
    
    res.json({ success: true, settings: settingsObj });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/admin/settings — Update settings
router.patch('/settings', adminAuth, async (req, res) => {
  try {
    const { isSeason } = req.body;
    if (isSeason !== undefined) {
      await Setting.findOneAndUpdate(
        { key: 'isSeason' },
        { value: isSeason },
        { upsert: true, new: true }
      );
      
      // Update all rooms to use the correct seasonal price
      const rooms = await Room.find();
      for (const room of rooms) {
        if (room.seasonPrice && room.nonSeasonPrice) {
          room.price = isSeason ? room.seasonPrice : room.nonSeasonPrice;
          await room.save();
        }
      }
    }
    res.json({ success: true, message: 'Settings updated' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/admin/profile — Update admin username/password
router.patch('/profile', adminAuth, async (req, res) => {
  try {
    const { oldUsername, oldPassword, newUsername, newPassword } = req.body;
    
    // Verify old credentials one more time for safety
    const admin = await Admin.findOne({ username: oldUsername, password: oldPassword });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Incorrect old credentials' });
    }

    if (newUsername) admin.username = newUsername;
    if (newPassword) admin.password = newPassword;
    
    await admin.save();
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUBLIC GET /api/admin/settings/public — Get public settings (no auth)
router.get('/settings/public', async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: 'isSeason' });
    res.json({ success: true, isSeason: setting ? setting.value : false });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/notifications
router.get('/notifications', adminAuth, async (req, res) => {
  try {
    const { period = 'all', month, year } = req.query;
    const filter = {};

    if (period === 'month') {
      let start, end;
      if (month && year) {
        const y = parseInt(year, 10);
        const m = parseInt(month, 10);
        start = new Date(y, m - 1, 1);
        end = new Date(y, m, 0, 23, 59, 59, 999);
      } else {
        const now = new Date();
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      }
      filter.createdAt = { $gte: start, $lte: end };
    }

    const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/admin/notifications/:id or all
router.delete('/notifications/:id', adminAuth, async (req, res) => {
  try {
    if (req.params.id === 'all') {
      await Notification.deleteMany({});
      return res.json({ success: true, message: 'All notifications cleared' });
    }
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/admin/rooms/reset-layout — Reset database to the specific 20-room floor layout
router.post('/rooms/reset-layout', adminAuth, async (req, res) => {
  try {
    const Settings = mongoose.model('Settings');
    const settings = await Settings.findOne();
    const isSeason = settings ? settings.isSeason : false;

    await Room.deleteMany({});
    const roomsToCreate = [];

    const getPrices = (type) => {
      if (type === 'Four Bed') return { nonSeason: 2000, season: 2500 };
      return { nonSeason: 1000, season: 1300 };
    };

    // 1st Floor (101-106)
    for (let i = 101; i <= 106; i++) {
      const type = (i === 102) ? 'Four Bed' : 'Double Bed';
      const prices = getPrices(type);
      roomsToCreate.push({
        roomNumber: i.toString(),
        type,
        nonSeasonPrice: prices.nonSeason,
        seasonPrice: prices.season,
        price: isSeason ? prices.season : prices.nonSeason,
        status: 'Available'
      });
    }
    // 2nd Floor (201-207)
    for (let i = 201; i <= 207; i++) {
      const type = ([201, 202, 207].includes(i)) ? 'Four Bed' : 'Double Bed';
      const prices = getPrices(type);
      roomsToCreate.push({
        roomNumber: i.toString(),
        type,
        nonSeasonPrice: prices.nonSeason,
        seasonPrice: prices.season,
        price: isSeason ? prices.season : prices.nonSeason,
        status: 'Available'
      });
    }
    // 3rd Floor (301-307)
    for (let i = 301; i <= 307; i++) {
      const type = ([302, 307].includes(i)) ? 'Four Bed' : 'Double Bed';
      const prices = getPrices(type);
      roomsToCreate.push({
        roomNumber: i.toString(),
        type,
        nonSeasonPrice: prices.nonSeason,
        seasonPrice: prices.season,
        price: isSeason ? prices.season : prices.nonSeason,
        status: 'Available'
      });
    }
    await Room.insertMany(roomsToCreate);
    res.json({ success: true, message: 'Lodge layout reset successfully with seasonal pricing.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/fcm-token — Register FCM device token
router.post('/fcm-token', adminAuth, async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: 'Token is required' });

    const trimUser = (req.headers.username || process.env.ADMIN_USERNAME || 'santhosh').trim();
    let admin = await Admin.findOne({
      username: { $regex: new RegExp('^' + trimUser.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') }
    });

    if (admin) {
      if (!admin.fcmTokens) admin.fcmTokens = [];
      if (!admin.fcmTokens.includes(token)) {
        admin.fcmTokens.push(token);
        await admin.save();
      }
      console.log(`[FCM] Token saved for ${admin.username}. Total devices: ${admin.fcmTokens.length}`);
      return res.json({
        success: true,
        message: 'Token registered successfully',
        deviceCount: admin.fcmTokens.length,
      });
    } else {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/test-push — Send test notification to all registered devices
router.post('/test-push', adminAuth, async (req, res) => {
  try {
    const { sendPushToAdminsInternal } = require('../utils/fcmService');
    const result = await sendPushToAdminsInternal(
      '🔔 BSS Test Alert',
      'If you see this at the top of your phone, push notifications are working!'
    );
    res.json({
      success: result.successCount > 0,
      ...result,
      message:
        result.tokenCount === 0
          ? 'No device registered. Tap Resync Alerts first.'
          : result.successCount > 0
            ? `Sent to ${result.successCount} device(s). Check your phone top bar.`
            : `Failed to send. ${result.errors?.join(' ') || 'Unknown error'}`,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
