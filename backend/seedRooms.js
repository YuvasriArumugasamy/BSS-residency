const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Room = require('./models/Room');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected for Seeding'))
  .catch(err => console.log(err));

const seedRooms = async () => {
  try {
    // Delete existing rooms
    await Room.deleteMany({});
    console.log('Existing rooms cleared.');

    const newRooms = [
      // First Floor
      { roomNumber: '101', type: 'Double Bed', price: 1000, nonSeasonPrice: 1000, seasonPrice: 1300, status: 'Available' },
      { roomNumber: '102', type: 'Four Bed A/C', price: 2500, nonSeasonPrice: 2500, seasonPrice: 2800, status: 'Available' },
      { roomNumber: '103', type: 'Double Bed', price: 1000, nonSeasonPrice: 1000, seasonPrice: 1300, status: 'Available' },
      { roomNumber: '104', type: 'Double Bed', price: 1000, nonSeasonPrice: 1000, seasonPrice: 1300, status: 'Available' },
      { roomNumber: '105', type: 'Double Bed A/C', price: 1300, nonSeasonPrice: 1300, seasonPrice: 1600, status: 'Available' },
      { roomNumber: '106', type: 'Double Bed', price: 1000, nonSeasonPrice: 1000, seasonPrice: 1300, status: 'Available' },

      // Second Floor
      { roomNumber: '201', type: 'Four Bed A/C', price: 2500, nonSeasonPrice: 2500, seasonPrice: 2800, status: 'Available' },
      { roomNumber: '202', type: 'Four Bed A/C', price: 2500, nonSeasonPrice: 2500, seasonPrice: 2800, status: 'Available' },
      { roomNumber: '203', type: 'Double Bed', price: 1000, nonSeasonPrice: 1000, seasonPrice: 1300, status: 'Available' },
      { roomNumber: '204', type: 'Double Bed', price: 1000, nonSeasonPrice: 1000, seasonPrice: 1300, status: 'Available' },
      { roomNumber: '205', type: 'Double Bed', price: 1000, nonSeasonPrice: 1000, seasonPrice: 1300, status: 'Available' },
      { roomNumber: '206', type: 'Double Bed', price: 1000, nonSeasonPrice: 1000, seasonPrice: 1300, status: 'Available' },
      { roomNumber: '207', type: 'Four Bed A/C', price: 2500, nonSeasonPrice: 2500, seasonPrice: 2800, status: 'Available' },

      // Third Floor
      { roomNumber: '301', type: 'Three Bed', price: 1500, nonSeasonPrice: 1500, seasonPrice: 1800, status: 'Available' },
      { roomNumber: '302', type: 'Four Bed A/C', price: 2500, nonSeasonPrice: 2500, seasonPrice: 2800, status: 'Available' },
      { roomNumber: '303', type: 'Double Bed', price: 1000, nonSeasonPrice: 1000, seasonPrice: 1300, status: 'Available' },
      { roomNumber: '304', type: 'Double Bed', price: 1000, nonSeasonPrice: 1000, seasonPrice: 1300, status: 'Available' },
      { roomNumber: '305', type: 'Double Bed', price: 1000, nonSeasonPrice: 1000, seasonPrice: 1300, status: 'Available' },
      { roomNumber: '306', type: 'Double Bed', price: 1000, nonSeasonPrice: 1000, seasonPrice: 1300, status: 'Available' },
      { roomNumber: '307', type: 'Four Bed A/C', price: 2500, nonSeasonPrice: 2500, seasonPrice: 2800, status: 'Available' },
    ];

    await Room.insertMany(newRooms);
    console.log('20 Rooms seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding rooms:', error);
    process.exit(1);
  }
};

seedRooms();
