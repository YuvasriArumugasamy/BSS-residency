const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (
      allowedOrigins.indexOf(origin) !== -1 || 
      process.env.NODE_ENV === 'development' ||
      origin.includes('localhost') || 
      origin.includes('127.0.0.1')
    ) {
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
      
      const count = await Room.countDocuments();
      if (count === 0) {
        console.log('Database empty, seeding initial data...');
        
        // 1. Create Rooms
        const rooms = [];
        let roomNum = 1;
        for (let i = 0; i < 13; i++) {
            rooms.push({
                roomNumber: (roomNum++).toString(),
                type: 'AC Double Bed',
                price: 1500,
                status: 'Available',
                amenities: ['TV', 'Hot Water', 'WiFi']
            });
        }
        rooms.push({ roomNumber: (roomNum++).toString(), type: 'Three Bed', price: 2000, status: 'Available', amenities: ['TV', 'Hot Water', 'WiFi'] });
        for (let i = 0; i < 6; i++) {
            rooms.push({
                roomNumber: (roomNum++).toString(),
                type: 'Four Bed',
                price: 2500,
                status: 'Available',
                amenities: ['TV', 'Hot Water', 'WiFi']
            });
        }
        await Room.insertMany(rooms);

        // 2. Create Guests
        const guestData = [
            { name: 'Suresh Kumar', phone: '9876543210', email: 'suresh@example.com', loyaltyLevel: 'Regular', totalStays: 5 },
            { name: 'Anand Raj', phone: '9876543211', email: 'anand@example.com', loyaltyLevel: 'New', totalStays: 1 },
            { name: 'Divya Patel', phone: '9876543212', email: 'divya@example.com', loyaltyLevel: 'VIP', totalStays: 12 }
        ];
        await Guest.insertMany(guestData);

        // 3. Create Bookings
        const today = new Date();
        const bookings = [
            {
                name: 'Suresh Kumar', phone: '9876543210', roomType: 'AC Double Bed',
                checkIn: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                checkOut: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
                guests: 2, status: 'Confirmed', createdAt: new Date(Date.now() - 86400000)
            },
            {
                name: 'Anand Raj', phone: '9876543211', roomType: 'Three Bed',
                checkIn: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
                checkOut: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
                guests: 1, status: 'Pending'
            }
        ];
        await Booking.insertMany(bookings);

        console.log('Auto-seed complete: Database populated.');
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
