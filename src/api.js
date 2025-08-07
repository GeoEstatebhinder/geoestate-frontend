// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-render-backend-url.onrender.com/api', // update this
  withCredentials: true,
});

export default api;
