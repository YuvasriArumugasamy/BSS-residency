const axios = require('axios');

async function testAdmin() {
  const adminHeaders = {
    username: 'santhosh',
    password: 'santhosh@123'
  };

  try {
    const newRes = await axios.get('https://bss-residency-1.onrender.com/api/admin/bookings', { headers: adminHeaders });
    console.log('Bookings:', newRes.data);
  } catch (e) {
    console.log('Response Error Data:', e.response?.data);
  }
}

testAdmin();
