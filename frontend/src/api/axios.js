import axios from 'axios';

// In development, leave REACT_APP_API_URL empty so requests go through the
// CRA proxy (configured in package.json) to http://localhost:5000.
// In production, set REACT_APP_API_URL to the deployed backend origin
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const baseURL = process.env.REACT_APP_API_URL || (isLocal ? '' : 'https://bss-residency-2.onrender.com');

const api = axios.create({ 
  baseURL,
  timeout: 10000 // 10 seconds timeout
});

// Auto-retry on network errors
api.interceptors.response.use(
  response => response,
  async (error) => {
    const { config, message } = error;
    if (!config || !config.retry) {
      if (message === 'Network Error') {
        config.retry = true;
        return api(config); // retry once
      }
    }
    return Promise.reject(error);
  }
);

export default api;
