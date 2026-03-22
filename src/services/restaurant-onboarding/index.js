/**
 * restaurantOnboardingService.js
 */

import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* ─────────────────────────────────────────────
   FACTORY FUNCTION FOR AXIOS INSTANCE
   ───────────────────────────────────────────── */
const createApi = (token) =>
  axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${token}`,
    },
  });

/* ─────────────────────────────────────────────
   1. GET LIST
   ───────────────────────────────────────────── */
export const getRestaurantOnboardingList = async ({
  token,
  page = 1,
  limit = 10,
  search = "",
  status = "",
} = {}) => {
  const api = createApi(token);

  const response = await api.get("/restaurant-onboarding/list", {
    params: {
      pagination: "true",
      page,
      limit,
      ...(search && { search }),
      ...(status && { status }),
    },
  });

  return response.data;
};

/* ─────────────────────────────────────────────
   2. GET SINGLE
   ───────────────────────────────────────────── */
export const getSingleRestaurantOnboarding = async ({ token, ...params }) => {
  const api = createApi(token);

  const response = await api.get("/restaurant-onboarding", {
    params,
  });

  return response.data;
};

/* ─────────────────────────────────────────────
   3. CREATE
   ───────────────────────────────────────────── */
export const createRestaurantOnboarding = async ({ token, ...body }) => {
  const api = createApi(token);

  const response = await api.post("/restaurant-onboarding", body);

  return response.data;
};

/* ─────────────────────────────────────────────
   4. UPDATE
   ───────────────────────────────────────────── */
export const updateRestaurantOnboarding = async ({ token, ...body }) => {
  const api = createApi(token);

  const response = await api.put("/restaurant-onboarding", body);

  return response.data;
};

/* ─────────────────────────────────────────────
   5. DELETE
   ───────────────────────────────────────────── */
export const deleteRestaurantOnboarding = async ({ token, id }) => {
  const api = createApi(token);

  const response = await api.delete("/restaurant-onboarding", {
    params: { _id: id },
  });

  return response.data;
};