const mongoose = require('mongoose');
require('dotenv').config();
const Room = require('./models/Room');

async function setupClientRooms() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // 1. Delete ALL existing rooms to start fresh for the client
    await Room.deleteMany({});
    console.log('Cleared existing rooms.');

    const roomsToCreate = [];

    // --- First Floor (101-106) ---
    for (let i = 101; i <= 106; i++) {
      let type = 'Double Bed';
      if (i === 102) type = 'Four Bed A/C';
      if (i === 105) type = 'Double Bed A/C';
      
      const pricing = {
        'Double Bed': { non: 2000, sea: 2000 },
        'Double Bed A/C': { non: 2500, sea: 2500 },
        'Four Bed A/C': { non: 4500, sea: 4500 }
      }[type];

      roomsToCreate.push({
        roomNumber: i.toString(),
        type,
        price: pricing.non,
        nonSeasonPrice: pricing.non,
        seasonPrice: pricing.sea,
        status: 'Available'
      });
    }

    // --- Second Floor (201-207) ---
    for (let i = 201; i <= 207; i++) {
      let type = 'Double Bed';
      if ([201, 202, 207].includes(i)) type = 'Four Bed A/C';

      
      const pricing = {
        'Double Bed': { non: 2000, sea: 2000 },
        'Double Bed A/C': { non: 2500, sea: 2500 },
        'Four Bed A/C': { non: 4500, sea: 4500 }
      }[type];

      roomsToCreate.push({
        roomNumber: i.toString(),
        type,
        price: pricing.non,
        nonSeasonPrice: pricing.non,
        seasonPrice: pricing.sea,
        status: 'Available'
      });
    }

    // --- Third Floor (301-307) ---
    for (let i = 301; i <= 307; i++) {
      let type = 'Double Bed';
      if (i === 301) type = 'Three Bed';
      if ([302, 307].includes(i)) type = 'Four Bed A/C';

      
      const pricing = {
        'Double Bed': { non: 2000, sea: 2000 },
        'Double Bed A/C': { non: 2500, sea: 2500 },
        'Three Bed': { non: 2500, sea: 2500 },
        'Four Bed A/C': { non: 4500, sea: 4500 }
      }[type];

      roomsToCreate.push({
        roomNumber: i.toString(),
        type,
        price: pricing.non,
        nonSeasonPrice: pricing.non,
        seasonPrice: pricing.sea,
        status: 'Available'
      });
    }

    await Room.insertMany(roomsToCreate);
    console.log('Successfully configured 20 rooms as per client requirements!');
    process.exit(0);
  } catch (err) {
    console.error('Setup error:', err);
    process.exit(1);
  }
}

setupClientRooms();
