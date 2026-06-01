const axios = require('axios');

async function testLogin(url) {
  console.log(`Testing login at ${url}...`);
  try {
    const res = await axios.post(`${url}/api/admin/login`, {
      username: 'santhosh',
      password: 'santhosh@123'
    });
    console.log(`Success at ${url}:`, res.data);
  } catch (err) {
    if (err.response) {
      console.log(`Error at ${url}: Status ${err.response.status}`, err.response.data);
    } else {
      console.log(`Error at ${url}: Network Error`, err.message);
    }
  }
}

async function run() {
  await testLogin('https://bss-residency.onrender.com');
  await testLogin('https://bss-residency-1.onrender.com');
  await testLogin('https://bss-residency-2.onrender.com');
}
run();
