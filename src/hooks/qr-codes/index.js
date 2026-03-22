/**
 * useQrTables.js
 *
 * WHY REACT QUERY?
 * React Query handles the entire data-fetching lifecycle for us:
 *   • Caches responses so the UI doesn't re-fetch unnecessarily.
 *   • Gives us isLoading / isError states for free.
 *   • After a mutation (create / update / delete) we call
 *     queryClient.invalidateQueries() so the list automatically refreshes.
 *
 * Without React Query you'd need useState + useEffect + manual refetch
 * logic spread across every component.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import {
//   getQrTables,
//   getSingleQrTable,
//   createQrTable,
//   updateQrTable,
//   deleteQrTable,
// } from '../services/qrService';

import {
  getQrTables,
  getSingleQrTable,
  createQrTable,
  updateQrTable,
  deleteQrTable,
  getQrTablesWithOrderStatus
} from '../../services';

// Stable key used to identify the QR-table list in React Query's cache.
export const QR_TABLES_KEY = 'qrTables';

/* ─────────────────────────────────────────────
   useQrTables  –  fetch paginated list
   ───────────────────────────────────────────── */
/**
 * Fetches the QR table list for the given restaurant.
 *
 * @param {Object} params - Passed directly to getQrTables()
 *   - rest_id  {string}  required
 *   - page     {number}  default 1
 *   - limit    {number}  default 10
 *   - search   {string}
 *   - status   {string}
 *   - qrNumber {string}
 */
export const useQrTables = (params) => {
  return useQuery({
    // Include params in the key so the cache is per-page / per-filter.
    queryKey: [QR_TABLES_KEY, params],

    // Only run when rest_id is available (page may not have loaded params yet).
    queryFn: () => getQrTables(params),
    enabled: !!params?.rest_id,

    // Keep previous data visible while the next page loads.
    keepPreviousData: true,
  });
};

/* ─────────────────────────────────────────────
   useSingleQrTable  –  fetch one record
   ───────────────────────────────────────────── */
/**
 * @param {Object} params – { _id } or { qrNumber } or { tableNumber }
 */
export const useSingleQrTable = (params) => {
  return useQuery({
    queryKey: ['qrTable', params],
    queryFn: () => getSingleQrTable(params),
    // Only fetch when at least one identifier is provided.
    enabled: !!(params?._id || params?.qrNumber || params?.tableNumber),
  });
};

/* ─────────────────────────────────────────────
   useCreateQrTable  –  POST /qr-table
   ───────────────────────────────────────────── */
export const useCreateQrTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQrTable,

    onSuccess: () => {
      // Invalidate every cached variant of the list so it re-fetches.
      queryClient.invalidateQueries({ queryKey: [QR_TABLES_KEY] });
    },

    onError: (error) => {
      console.error('Create QR table failed:', error?.response?.data?.message || error.message);
    },
  });
};

/* ─────────────────────────────────────────────
   useUpdateQrTable  –  PUT /qr-table
   ───────────────────────────────────────────── */
export const useUpdateQrTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateQrTable,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QR_TABLES_KEY] });
    },

    onError: (error) => {
      console.error('Update QR table failed:', error?.response?.data?.message || error.message);
    },
  });
};

/* ─────────────────────────────────────────────
   useDeleteQrTable  –  DELETE /qr-table
   ───────────────────────────────────────────── */
export const useDeleteQrTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteQrTable, // receives the _id string

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QR_TABLES_KEY] });
    },

    onError: (error) => {
      console.error('Delete QR table failed:', error?.response?.data?.message || error.message);
    },
  });
};

export const useQrTablesWithOrderStatus = (params) => {
  return useQuery({
    // Include params in the key so the cache is per-page / per-filter.
    queryKey: [QR_TABLES_KEY, params],

    // Only run when rest_id is available (page may not have loaded params yet).
    queryFn: () => getQrTablesWithOrderStatus(params),
    enabled: !!params?.rest_id,

    // Keep previous data visible while the next page loads.
    keepPreviousData: true,
  });
};