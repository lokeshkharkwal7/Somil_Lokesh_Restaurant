// services/authService.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
});

/* ─────────────────────────────────────────────
   LOGIN  –  POST /auth/login
   ───────────────────────────────────────────── */
export const loginMerchant = async ({ email, password }) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data; // { success, message, token }
};