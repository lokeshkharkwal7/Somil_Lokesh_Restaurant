/**
 * restaurantService.js
 *
 * Handles all restaurant-related API calls:
 * - Create restaurant
 * - Get restaurants list
 * - Get single restaurant
 * - Update restaurant
 * - Delete restaurant
 */

import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* ─────────────────────────────────────────────
   AXIOS INSTANCE WITH GLOBAL TOKEN
   ───────────────────────────────────────────── */
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

/* ─────────────────────────────────────────────
   1. CREATE RESTAURANT  –  POST /restaurants
   ───────────────────────────────────────────── */
export const createRestaurant = async (restaurantData) => {
  const response = await api.post("/restaurants", restaurantData);
  return response.data;
};

/* ─────────────────────────────────────────────
   2. GET ALL RESTAURANTS  –  GET /restaurants/list
   ───────────────────────────────────────────── */
export const getRestaurants = async ({
  page = 1,
  limit = 10,
  search = "",
  city = "",
  state = "",
}) => {
  const response = await api.get("/restaurants/list", {
    params: {
      pagination: "true",
      page,
      limit,
      ...(search && { search }),
      ...(city && { city }),
      ...(state && { state }),
    },
  });

  return response.data;
};

/* ─────────────────────────────────────────────
   3. GET SINGLE RESTAURANT  –  GET /restaurants?_id=ID
   ───────────────────────────────────────────── */
export const getSingleRestaurant = async (params) => {
  const response = await api.get("/restaurants", { params });
  return response.data;
};

/* ─────────────────────────────────────────────
   4. UPDATE RESTAURANT  –  PUT /restaurants
   ───────────────────────────────────────────── */
export const updateRestaurant = async (body) => {
  const response = await api.put("/restaurants", body);
  return response.data;
};

/* ─────────────────────────────────────────────
   5. DELETE RESTAURANT  –  DELETE /restaurants?_id=ID
   ───────────────────────────────────────────── */
export const deleteRestaurant = async (id) => {
  const response = await api.delete("/restaurants", {
    params: { _id: id },
  });

  return response.data;
};

/* ─────────────────────────────────────────────
   6. GET RESTAURANTS BY OWNER  –  GET /restaurants/owner
   ───────────────────────────────────────────── */
export const getRestaurantsByOwner = async ({
  ownerName,
  page = 1,
  limit = 10,
}) => {
  const response = await api.get("/restaurants/owner", {
    params: {
      ownerName,
      pagination: "true",
      page,
      limit,
    },
  });

  return response.data;
};

/* ─────────────────────────────────────────────
   7. SEARCH RESTAURANTS BY CITY  –  GET /restaurants/city
   ───────────────────────────────────────────── */
export const searchRestaurantsByCity = async ({
  city,
  page = 1,
  limit = 10,
}) => {
  const response = await api.get("/restaurants/city", {
    params: {
      city,
      pagination: "true",
      page,
      limit,
    },
  });

  return response.data;
};