const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/admin');
const Admin = require('./models/Admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy required for express-rate-limit when using X-Forwarded-For headers
app.set('trust proxy', true);

// Security and Performance Optimization
app.use(helmet({
  contentSecurityPolicy: false, // Turn off CSP for ease of local development / third-party fonts
}));
app.use(compression());
app.use(cors({
  origin: '*', // Allow all origins for development and API access
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'username', 'password']
}));

// Rate Limiter to protect endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

app.use(bodyParser.json({ limit: '10mb' })); // Increase body size limit for base64 ID uploads
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Mount Routes
app.use('/api/booking', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.send('SM Golden Resorts API is running perfectly...');
});

// Database Connection & Admin Seeding
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sm-golden-resorts')
  .then(async () => {
    console.log('Connected to MongoDB Database: sm-golden-resorts');
    
    // Seed default admin if none exists
    try {
      const adminCount = await Admin.countDocuments();
      if (adminCount === 0) {
        const defaultUser = (process.env.ADMIN_USERNAME || 'santhosh').trim();
        const defaultPass = (process.env.ADMIN_PASSWORD || 'santhosh@123').trim();
        await Admin.create({
          username: defaultUser,
          password: defaultPass,
          lastLogin: null
        });
        console.log(`✨ Default admin user auto-seeded successfully! Username: ${defaultUser}`);
      }
    } catch (seedErr) {
      console.error('Error seeding default admin:', seedErr.message);
    }
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
