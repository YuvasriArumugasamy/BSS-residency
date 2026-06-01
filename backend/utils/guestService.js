const Guest = require('../models/Guest');
const { normalizePhone } = require('./phone');

async function findGuestByPhone(phone) {
  const norm = normalizePhone(phone);
  if (!norm) return null;
  const guests = await Guest.find({});
  return guests.find((g) => normalizePhone(g.phone) === norm) || null;
}

async function upsertGuestFromBooking({ name, phone, email }) {
  const norm = normalizePhone(phone);
  if (!norm) return null;

  let guest = await findGuestByPhone(phone);
  if (guest) {
    if (name && guest.name !== name) guest.name = name;
    if (email) guest.email = email;
    guest.phone = norm;
    guest.totalStays += 1;
    if (guest.totalStays >= 10) guest.loyaltyLevel = 'VIP';
    else if (guest.totalStays >= 3) guest.loyaltyLevel = 'Regular';
    await guest.save();
    return guest;
  }

  guest = new Guest({
    name: name || 'Guest',
    phone: norm,
    email: email || '',
    totalStays: 1,
    loyaltyLevel: 'New',
  });
  await guest.save();
  return guest;
}

/** Merge duplicate guest rows (same number, different formatting) for API response */
function mergeGuestsForDisplay(guests) {
  const map = new Map();
  for (const g of guests) {
    const norm = normalizePhone(g.phone);
    if (!norm) continue;
    const obj = g.toObject ? g.toObject() : { ...g };
    if (map.has(norm)) {
      const ex = map.get(norm);
      ex.totalStays += obj.totalStays || 0;
      ex.totalSpent = (ex.totalSpent || 0) + (obj.totalSpent || 0);
      if (obj.totalStays >= 10) ex.loyaltyLevel = 'VIP';
      else if (obj.totalStays >= 3 && ex.loyaltyLevel !== 'VIP') ex.loyaltyLevel = 'Regular';
    } else {
      map.set(norm, { ...obj, phone: norm });
    }
  }
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
  );
}

module.exports = { findGuestByPhone, upsertGuestFromBooking, mergeGuestsForDisplay, normalizePhone };
