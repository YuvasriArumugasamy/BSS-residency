const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });
const Room = require('./backend/models/Room');

async function checkDB() {
  try {
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
