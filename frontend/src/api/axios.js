import axios from 'axios';

// In development, leave REACT_APP_API_URL empty so requests go through the
// CRA proxy (configured in package.json) to http://localhost:5000.
// In production, set REACT_APP_API_URL to the deployed backend origin
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({ baseURL });

export default api;
