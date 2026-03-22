// src/hooks/useMenu.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import menuService from '../../services/menu-publish';

// Hook to fetch menu data
export const useMenu = (rest_id, type, options = {}) => {
  return useQuery({
    queryKey: ['menu', rest_id],
    queryFn: () => menuService.getMenuByRestaurant(rest_id, type),
    enabled: !!rest_id,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    ...options // Allow overriding options
  });
};

// Hook to create menu
export const useCreateMenu = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (menuData) => menuService.createMenu(menuData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['menu', variables.rest_id]);
    },
  });
};

// Hook to update menu
export const useUpdateMenu = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (menuData) => menuService.updateMenu(menuData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['menu', variables.rest_id]);
    },
  });
};