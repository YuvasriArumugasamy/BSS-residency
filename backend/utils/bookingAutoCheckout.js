const Booking = require('../models/Booking');
const Room = require('../models/Room');

/**
 * Parses and returns the exact checkout date-time by combining checkout Date and time String.
 * Handles both 12-hour format (e.g. "11:00 AM", "04:00 PM") and 24-hour format (e.g. "04:00", "16:30").
 */
function getCheckOutDateTime(checkOutDate, checkOutTimeStr) {
  const date = new Date(checkOutDate);
  if (isNaN(date.getTime())) return null;

  let hours = 11; // Default check-out time is 11:00 AM
  let minutes = 0;

  if (checkOutTimeStr) {
    const cleanTime = checkOutTimeStr.trim().toUpperCase();
    
    // 12-hour format check: e.g. "11:00 AM" or "04:30 PM"
    const ampmMatch = cleanTime.match(/^(\d+):(\d+)\s*(AM|PM)$/);
    if (ampmMatch) {
      let h = parseInt(ampmMatch[1], 10);
      const m = parseInt(ampmMatch[2], 10);
      const ampm = ampmMatch[3];
      if (ampm === 'PM' && h < 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      hours = h;
      minutes = m;
    } else {
      // 24-hour format check: e.g. "04:00" or "16:00"
      const match24 = cleanTime.match(/^(\d+):(\d+)$/);
      if (match24) {
        hours = parseInt(match24[1], 10);
        minutes = parseInt(match24[2], 10);
      }
    }
  }

  date.setHours(hours, minutes, 0, 0);
  return date;
}

/**
 * Automatically checks out all Confirmed bookings whose checkout date and time have passed.
 * Also updates their assigned rooms to 'Available'.
 */
async function autoCheckOutPassedBookings() {
  try {
    const now = new Date();
    
    // Find all Confirmed bookings
    const confirmedBookings = await Booking.find({ status: 'Confirmed' });
    
    let updatedCount = 0;
    const roomsToFree = [];

    for (const booking of confirmedBookings) {
      const checkOutDateTime = getCheckOutDateTime(booking.checkOut, booking.checkOutTime);
      if (!checkOutDateTime) continue;

      // If check-out date/time is in the past compared to the current server time
      if (checkOutDateTime < now) {
        booking.status = 'Checked-out';
        await booking.save();
        updatedCount++;

        if (booking.roomNumber) {
          roomsToFree.push(booking.roomNumber);
        }
      }
    }

    if (roomsToFree.length > 0) {
      // Update all those room numbers to 'Available' (avoiding rooms in Maintenance)
      await Room.updateMany(
        { roomNumber: { $in: roomsToFree }, status: { $ne: 'Maintenance' } },
        { status: 'Available' }
      );
      console.log(`[Auto-Checkout] Freed up room(s): ${roomsToFree.join(', ')}`);
    }

    if (updatedCount > 0) {
      console.log(`[Auto-Checkout] Automatically checked out ${updatedCount} booking(s) whose checkout time had passed.`);
    }
  } catch (err) {
    console.error('[Auto-Checkout] Error running auto-checkout process:', err);
  }
}

module.exports = {
  getCheckOutDateTime,
  autoCheckOutPassedBookings
};
