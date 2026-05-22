const axios = require('axios');
axios.get('https://bss-residency.onrender.com/api/admin/rooms', {
  headers: { username: 'santhosh', password: 'santhosh@123' }
}).then(res => console.log(JSON.stringify(res.data.rooms, null, 2)))
  .catch(err => console.error(err.message));
