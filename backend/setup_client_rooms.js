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
      if (i === 102) type = 'Four Bed';
      if (i === 105 || i === 106) type = 'Double Bed A/C';
      
      const pricing = {
        'Double Bed': { non: 1000, sea: 1300 },
        'Double Bed A/C': { non: 1300, sea: 1600 },
        'Four Bed': { non: 2000, sea: 2500 },
        'Four Bed A/C': { non: 2300, sea: 2800 }
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
      if ([201, 202].includes(i)) type = 'Four Bed';
      if (i === 207) type = 'Four Bed A/C';
      if ([205, 206].includes(i)) type = 'Double Bed A/C';
      
      const pricing = {
        'Double Bed': { non: 1000, sea: 1300 },
        'Double Bed A/C': { non: 1300, sea: 1600 },
        'Four Bed': { non: 2000, sea: 2500 },
        'Four Bed A/C': { non: 2300, sea: 2800 }
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
      if ([302, 307].includes(i)) type = 'Four Bed';
      if (i === 305 || i === 306) type = 'Double Bed A/C';
      
      const pricing = {
        'Double Bed': { non: 1000, sea: 1300 },
        'Double Bed A/C': { non: 1300, sea: 1600 },
        'Four Bed': { non: 2000, sea: 2500 },
        'Four Bed A/C': { non: 2300, sea: 2800 }
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
