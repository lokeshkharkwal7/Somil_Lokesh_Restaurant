/**
 * restaurantService.js
 */

import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/* ─────────────────────────────────────────────
   AXIOS INSTANCE
   ───────────────────────────────────────────── */
const createApi = (token) =>
  axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
    //   ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

/* ─────────────────────────────────────────────
   1. GET LIST
   ───────────────────────────────────────────── */
export const getRestaurantList = async ({
  token,
  page = 1,
  limit = 10,
  city,
  isActive,
  startDate,
  endDate,
  pagination = true,
} = {}) => {
  const api = createApi(token);

  const response = await api.get("/restaurants/list", {
    params: {
      pagination: String(pagination),
      page,
      limit,
      ...(city && { city }),
      ...(typeof isActive !== "undefined" && { isActive }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    },
  });

  return response.data;
};

/* ─────────────────────────────────────────────
   2. GET SINGLE
   ───────────────────────────────────────────── */
export const getRestaurant = async ({
  token,
  _id,
  contactNumber,
}) => {
  const api = createApi(token);

  const response = await api.get("/restaurants", {
    params: {
      ...(_id && { _id }),
      ...(contactNumber && { contactNumber }),
    },
  });

  return response.data;
};

/* ─────────────────────────────────────────────
   3. CREATE
   ───────────────────────────────────────────── */
export const createRestaurant = async ({
  token,
  ...body
}) => {
  const api = createApi(token);

  const response = await api.post("/restaurants", body);

  return response.data;
};

/* ─────────────────────────────────────────────
   4. UPDATE
   ───────────────────────────────────────────── */
export const updateRestaurant = async ({
  token,
  ...body
}) => {
  const api = createApi(token);

  const response = await api.put("/restaurants", body);

  return response.data;
};

/* ─────────────────────────────────────────────
   5. DELETE
   ───────────────────────────────────────────── */
export const deleteRestaurant = async ({
  token,
  id,
}) => {
  const api = createApi(token);

  const response = await api.delete("/restaurants", {
    params: { _id: id },
  });

  return response.data;
};