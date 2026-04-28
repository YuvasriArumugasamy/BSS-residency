const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');

// Models (Pre-load for consistency)
require('./models/Room');
require('./models/Guest');
require('./models/Booking');
require('./models/Payment');

const app = express();

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://bss-residency.vercel.app',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/', (req, res) =>
  res.json({ message: 'BSS Residency API running', status: 'ok' })
);

// Connect MongoDB and start server
const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not set. Please configure the environment.');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    
    // Auto-seed if database is empty
    try {
      const Room = require('./models/Room');
      const Guest = require('./models/Guest');
      const Booking = require('./models/Booking');
      const Payment = require('./models/Payment');
      const Notification = require('./models/Notification');
      const Review = require('./models/Review');
      
      const bookingCount = await Booking.countDocuments();
      if (bookingCount === 0) {
        console.log('Bookings empty, seeding full initial data...');
        
        // ... (existing Room seeding)
        const roomCount = await Room.countDocuments();
        let seededRooms = [];
        if (roomCount === 0) {
            const rooms = [];
            let roomNum = 1;
            for (let i = 0; i < 13; i++) {
                rooms.push({ roomNumber: (roomNum++).toString(), type: 'AC Double Bed', price: 1500, status: 'Available', amenities: ['TV', 'Hot Water', 'WiFi'] });
            }
            rooms.push({ roomNumber: (roomNum++).toString(), type: 'Four Bed A/C', price: 2000, status: 'Available', amenities: ['TV', 'Hot Water', 'WiFi'] });
            for (let i = 0; i < 6; i++) {
                rooms.push({ roomNumber: (roomNum++).toString(), type: 'Four Bed', price: 2500, status: 'Available', amenities: ['TV', 'Hot Water', 'WiFi'] });
            }
            seededRooms = await Room.insertMany(rooms);
        } else {
            seededRooms = await Room.find();
        }

        // 2. Create Guests
        const guests = await Guest.insertMany([
            { name: 'Suresh Kumar', phone: '9876543210', email: 'suresh@example.com', loyaltyLevel: 'Regular', totalStays: 5 },
            { name: 'Anand Raj', phone: '9876543211', email: 'anand@example.com', loyaltyLevel: 'New', totalStays: 1 },
            { name: 'Divya Patel', phone: '9876543212', email: 'divya@example.com', loyaltyLevel: 'VIP', totalStays: 12 },
            { name: 'Nisha Verma', phone: '9876543213', email: 'nisha@example.com', loyaltyLevel: 'Regular', totalStays: 3 }
        ]);

        // 3. Create Bookings
        const today = new Date();
        const seededBookings = await Booking.insertMany([
            {
                bookingId: 'BSS-1001', name: 'Suresh Kumar', phone: '9876543210', roomType: 'AC Double Bed',
                checkIn: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                checkOut: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
                guests: 2, status: 'Confirmed', roomNumber: '1', createdAt: new Date(Date.now() - 86400000)
            },
            {
                bookingId: 'BSS-1002', name: 'Anand Raj', phone: '9876543211', roomType: 'Four Bed',
                checkIn: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
                checkOut: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
                guests: 1, status: 'Pending'
            }
        ]);

        // 4. Create Payments
        await Payment.insertMany([
            { guestName: 'Suresh Kumar', bookingId: seededBookings[0]._id, amount: 3000, method: 'UPI', status: 'Paid' }
        ]);

        // 5. Create Notifications
        await Notification.insertMany([
            { title: 'New Booking', message: 'Suresh Kumar booked a room', type: 'booking', date: new Date() },
            { title: 'Payment Received', message: 'Received ₹3000 from Suresh Kumar', type: 'system', date: new Date() },
            { title: 'System Alert', message: 'Database backup completed', type: 'system', date: new Date() }
        ]);

        // 6. Create Reviews
        await Review.insertMany([
            { guestName: 'Divya Patel', rating: 5, comment: 'Excellent service and very clean rooms!', date: new Date() },
            { guestName: 'Suresh Kumar', rating: 4, comment: 'Good stay, friendly staff.', date: new Date() }
        ]);

        // Update room status
        await Room.findOneAndUpdate({ roomNumber: '1' }, { status: 'Occupied' });

        console.log('Auto-seed complete: Notifications and Reviews added.');
      }
    } catch (seedErr) {
      console.error('Auto-seed error:', seedErr);
    }

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB Error:', err);
    process.exit(1);
  });
