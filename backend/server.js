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
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB Error:', err);
    process.exit(1);
  });
