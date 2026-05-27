import axios from 'axios';

// Base URL can be set via environment variable REACT_APP_API_URL, fallback to localhost.
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 10000,
});

// Request interceptor to add admin credentials from localStorage if present.
apiClient.interceptors.request.use((config) => {
  const username = localStorage.getItem('sm_admin_user');
  const password = localStorage.getItem('sm_admin_pass');
  if (username && password) {
    config.headers = {
      ...config.headers,
      username,
      password,
    };
  }
  return config;
}, (error) => Promise.reject(error));

export default apiClient;
