const mongoose = require('mongoose');
require('dotenv').config();
const Room = require('./models/Room');

async function checkDB() {
  try {
    if (!process.env.MONGO_URI) {
       console.error('MONGO_URI missing from .env');
       process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const rooms = await Room.find();
    console.log('ROOMS COUNT:', rooms.length);
    console.log('ROOMS SAMPLE:', JSON.stringify(rooms.slice(0, 5), null, 2));
    
    const types = await Room.distinct('type');
    console.log('DISTINCT TYPES:', types);
    
    process.exit(0);
  } catch (err) {
    console.error('DB ERROR:', err);
    process.exit(1);
  }
}

checkDB();
