// src/services/menuService.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const menuService = {
  // Get menu by restaurant ID
  getMenuByRestaurant: async (rest_id, type) => {
    try {
      const response = await axios.get(`${BASE_URL}/menus?rest_id=${rest_id}${type ? `&type=${type}` : ''}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new menu
  createMenu: async (menuData) => {
    try {
      const response = await axios.post(`${BASE_URL}/menus`, menuData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update existing menu
  updateMenu: async (menuData) => {
    try {
      const response = await axios.put(`${BASE_URL}/menus`, menuData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default menuService;