const axios = require('axios');

async function testAdmin() {
  const adminHeaders = {
    username: 'santhosh',
    password: 'santhosh@123'
  };

  try {
    // Check old backend
    console.log('--- OLD BACKEND ---');
    const oldRes = await axios.get('https://bss-residency.onrender.com/api/admin/bookings', { headers: adminHeaders });
    console.log('Old Backend Bookings count:', oldRes.data.total);
    console.log('Latest booking date:', oldRes.data.bookings[oldRes.data.bookings.length - 1]?.createdAt);
  } catch (e) {
    console.log('Old Backend Error:', e.message);
  }

  try {
    // Check new backend
    console.log('\n--- NEW BACKEND ---');
    const newRes = await axios.get('https://bss-residency-1.onrender.com/api/admin/bookings', { headers: adminHeaders });
    console.log('New Backend Bookings count:', newRes.data.total);
    console.log('Latest booking date:', newRes.data.bookings[newRes.data.bookings.length - 1]?.createdAt);
  } catch (e) {
    console.log('New Backend Error:', e.message);
  }
}

testAdmin();
