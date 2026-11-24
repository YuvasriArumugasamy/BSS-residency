const Room = require('../models/Room');

// Restore the known 20-room inventory only when the collection is completely empty.
// Never overwrite or delete inventory that an administrator has already configured.
const DEFAULT_ROOMS = [
  ['101', 'Double Bed'], ['102', 'Four Bed A/C'], ['103', 'Double Bed'],
  ['104', 'Double Bed'], ['105', 'Double Bed A/C'], ['106', 'Double Bed'],
  ['201', 'Four Bed A/C'], ['202', 'Four Bed A/C'], ['203', 'Double Bed'],
  ['204', 'Double Bed'], ['205', 'Double Bed'], ['206', 'Double Bed'],
  ['207', 'Four Bed A/C'], ['301', 'Three Bed'], ['302', 'Four Bed A/C'],
  ['303', 'Double Bed'], ['304', 'Double Bed'], ['305', 'Double Bed A/C'],
  ['306', 'Double Bed A/C'], ['307', 'Four Bed A/C'],
];

const PRICES = {
  'Double Bed': { regular: 1000, season: 1300 },
  'Double Bed A/C': { regular: 1300, season: 1600 },
  'Three Bed': { regular: 1500, season: 1800 },
  'Four Bed A/C': { regular: 2500, season: 2800 },
};

async function ensureDefaultRooms() {
  const existingCount = await Room.countDocuments();
  if (existingCount > 0) return;

  const seasonSetting = await require('../models/Setting').findOne({ key: 'isSeason' });
  const isSeason = seasonSetting?.value === true;
  const rooms = DEFAULT_ROOMS.map(([roomNumber, type]) => {
    const price = PRICES[type];
    return {
      roomNumber,
      type,
      price: isSeason ? price.season : price.regular,
      nonSeasonPrice: price.regular,
      seasonPrice: price.season,
      status: 'Available',
    };
  });

  try {
    await Room.insertMany(rooms, { ordered: false });
    console.log('[Rooms] Restored default inventory (20 rooms) because the collection was empty.');
  } catch (error) {
    // A second server instance may have seeded the unique room numbers concurrently.
    if (error.code !== 11000 && !error.writeErrors?.every((item) => item.code === 11000)) throw error;
  }
}

module.exports = ensureDefaultRooms;
