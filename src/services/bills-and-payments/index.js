// src/services/orderService.js
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* ─────────────────────────────────────────────
   AXIOS INSTANCE WITH GLOBAL TOKEN
   ───────────────────────────────────────────── */
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

/* ─────────────────────────────────────────────
   ORDER SERVICE
   ───────────────────────────────────────────── */
export const orderService = {
  getOrders: async (filters = {}) => {
    const params = {
      pagination: "true",
      ...filters,
    };

    try {
      const response = await api.get("/orders/list", {
        params,
      });

      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch orders");
    }
  },

  updateOrderStatus: async ({ _id, orderStatus }) => {
    try {
      const response = await api.put("/orders", {
        _id,
        orderStatus,
      });

      return response.data;
    } catch (error) {
      throw new Error("Failed to update order status");
    }
  },
};