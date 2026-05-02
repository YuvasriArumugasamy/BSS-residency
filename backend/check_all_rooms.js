const mongoose = require('mongoose');
require('dotenv').config();
const Room = require('./models/Room');

async function checkDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const rooms = await Room.find().sort({ type: 1, roomNumber: 1 });
    console.log('ALL ROOMS:');
    rooms.forEach(r => console.log(`${r.roomNumber} - ${r.type}`));
    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
}

checkDB();
