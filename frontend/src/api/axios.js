import axios from 'axios';

// In development, leave REACT_APP_API_URL empty so requests go through the
// CRA proxy (configured in package.json) to http://localhost:5000.
// In production, set REACT_APP_API_URL to the deployed backend origin
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
export const API_BASE_URL = isLocal ? '' : (process.env.REACT_APP_API_URL || 'https://bss-residency.onrender.com');

const api = axios.create({ 
  baseURL: API_BASE_URL,
  timeout: 60000 // 60 seconds timeout to handle Render cold starts
});

// Automatically attach authentication headers
api.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('bss_admin') || sessionStorage.getItem('bss_admin');
    if (stored) {
      try {
        const auth = JSON.parse(stored);
        if (auth.token) {
          config.headers['Authorization'] = `Bearer ${auth.token}`;
        } else if (auth.username && auth.password) {
          config.headers['username'] = auth.username;
          config.headers['password'] = auth.password;
        }
      } catch (err) {
        console.error('Error parsing auth in request interceptor:', err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
