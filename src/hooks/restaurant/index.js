/**
 * useRestaurants.js
 *
 * React Query hooks for restaurant management
 * Handles all CRUD operations with automatic cache invalidation
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createRestaurant,
  getRestaurants,
  getSingleRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantsByOwner,
  searchRestaurantsByCity,
} from '../../services/restaurant';

// Stable key used to identify the restaurant list in React Query's cache
export const RESTAURANTS_KEY = 'restaurants';

/* ─────────────────────────────────────────────
   useRestaurants  –  fetch paginated list
   ───────────────────────────────────────────── */
/**
 * Fetches the restaurants list with pagination and filters
 *
 * @param {Object} params - Query parameters
 *   - page     {number}  default 1
 *   - limit    {number}  default 10
 *   - search   {string}  search by name/owner
 *   - city     {string}  filter by city
 *   - state    {string}  filter by state
 */
export const useRestaurants = (params = {}) => {
  return useQuery({
    queryKey: [RESTAURANTS_KEY, params],
    queryFn: () => getRestaurants(params),
    keepPreviousData: true,
  });
};

/* ─────────────────────────────────────────────
   useSingleRestaurant  –  fetch one restaurant
   ───────────────────────────────────────────── */
/**
 * @param {string|Object} identifier - Restaurant ID or query params
 */
export const useSingleRestaurant = (identifier) => {
  const params = typeof identifier === 'string' 
    ? { _id: identifier } 
    : identifier;

  return useQuery({
    queryKey: ['restaurant', params],
    queryFn: () => getSingleRestaurant(params),
    enabled: !!(params?._id),
  });
};

/* ─────────────────────────────────────────────
   useRestaurantsByOwner  –  fetch restaurants by owner
   ───────────────────────────────────────────── */
export const useRestaurantsByOwner = (ownerName, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['restaurants', 'owner', ownerName, page, limit],
    queryFn: () => getRestaurantsByOwner({ ownerName, page, limit }),
    enabled: !!ownerName,
    keepPreviousData: true,
  });
};

/* ─────────────────────────────────────────────
   useRestaurantsByCity  –  search restaurants by city
   ───────────────────────────────────────────── */
export const useRestaurantsByCity = (city, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['restaurants', 'city', city, page, limit],
    queryFn: () => searchRestaurantsByCity({ city, page, limit }),
    enabled: !!city,
    keepPreviousData: true,
  });
};

/* ─────────────────────────────────────────────
   useCreateRestaurant  –  POST /restaurants
   ───────────────────────────────────────────── */
export const useCreateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRestaurant,

    onSuccess: (data) => {
      // Invalidate all restaurant lists to refresh data
      queryClient.invalidateQueries({ queryKey: [RESTAURANTS_KEY] });
      
      // Optionally set the newly created restaurant in cache
      queryClient.setQueryData(['restaurant', { _id: data._id }], data);
      
      console.log('Restaurant created successfully:', data);
    },

    onError: (error) => {
      console.error('Create restaurant failed:', 
        error?.response?.data?.message || error.message
      );
    },
  });
};

/* ─────────────────────────────────────────────
   useUpdateRestaurant  –  PUT /restaurants
   ───────────────────────────────────────────── */
export const useUpdateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRestaurant,

    onSuccess: (data, variables) => {
      // Invalidate all restaurant lists
      queryClient.invalidateQueries({ queryKey: [RESTAURANTS_KEY] });
      
      // Update the single restaurant cache
      queryClient.setQueryData(['restaurant', { _id: variables._id }], data);
      
      console.log('Restaurant updated successfully:', data);
    },

    onError: (error) => {
      console.error('Update restaurant failed:', 
        error?.response?.data?.message || error.message
      );
    },
  });
};

/* ─────────────────────────────────────────────
   useDeleteRestaurant  –  DELETE /restaurants
   ───────────────────────────────────────────── */
export const useDeleteRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRestaurant,

    onSuccess: (data, deletedId) => {
      // Invalidate all restaurant lists
      queryClient.invalidateQueries({ queryKey: [RESTAURANTS_KEY] });
      
      // Remove the single restaurant from cache
      queryClient.removeQueries({ 
        queryKey: ['restaurant', { _id: deletedId }] 
      });
      
      console.log('Restaurant deleted successfully');
    },

    onError: (error) => {
      console.error('Delete restaurant failed:', 
        error?.response?.data?.message || error.message
      );
    },
  });
};