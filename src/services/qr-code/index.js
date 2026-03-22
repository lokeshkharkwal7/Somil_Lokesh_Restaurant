/**
 * qrService.js
 *
 * POST body (url is NOT sent):
 *   { tableNumber, qrNumber, rest_id }
 *
 * After POST succeeds, the returned _id is used to build:
 *   url = http://localhost:3000/{rest_id}/{_id}
 * and patched in via PUT { _id, url }
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
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

/* ─────────────────────────────────────────────
   1. GET LIST  –  GET /qr-tables/list
   ───────────────────────────────────────────── */
export const getQrTables = async ({
  rest_id,
  page = 1,
  limit = 10,
  search = "",
  status = "",
  qrNumber = "",
}) => {
  const response = await api.get("/qr-tables/list", {
    params: {
      rest_id,
      pagination: "true",
      page,
      limit,
      ...(search && { search }),
      ...(status && { status }),
      ...(qrNumber && { qrNumber }),
    },
  });

  return response.data;
};

/* ─────────────────────────────────────────────
   2. GET SINGLE  –  GET /qr-tables?_id=ID
   ───────────────────────────────────────────── */
export const getSingleQrTable = async (params) => {
  const response = await api.get("/qr-tables", { params });
  return response.data;
};

/* ─────────────────────────────────────────────
   3. CREATE  –  POST /qr-tables
   ───────────────────────────────────────────── */
export const createQrTable = async (body) => {
  const response = await api.post("/qr-tables", body);
  return response.data;
};

/* ─────────────────────────────────────────────
   4. UPDATE  –  PUT /qr-tables
   ───────────────────────────────────────────── */
export const updateQrTable = async (body) => {
  const response = await api.put("/qr-tables", body);
  return response.data;
};

/* ─────────────────────────────────────────────
   5. DELETE  –  DELETE /qr-tables?_id=ID
   ───────────────────────────────────────────── */
export const deleteQrTable = async (id) => {
  const response = await api.delete("/qr-tables", {
    params: { _id: id },
  });

  return response.data;
};

export const getQrTablesWithOrderStatus = async ({
  rest_id,
  page = 1,
  limit = 10,
  search = "",
  status = "",
  qrNumber = "",
}) => {
  const response = await api.get("/qr-tables/seat-order-status/list", {
    params: {
      rest_id,
      pagination: "true",
      page,
      limit,
      ...(search && { search }),
      ...(status && { status }),
      ...(qrNumber && { qrNumber }),
    },
  });

  return response.data;
};
