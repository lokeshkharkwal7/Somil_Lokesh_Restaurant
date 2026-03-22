// src/hooks/useOrders.js
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { orderService } from '../../services/bills-and-payments';

export const useOrders = (filters = {}, options = {}) => {
  // Create a stable query key by stringifying the filters
  const queryKey = ['orders', JSON.stringify(filters)];
  
  return useQuery({
    queryKey: queryKey,
    queryFn: () => orderService.getOrders(filters),
    staleTime: 30000,
    keepPreviousData: true,
    ...options, // This allows passing enabled, etc.
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderService.updateOrderStatus,
    onSuccess: (data, variables) => {
      // Invalidate all orders queries to refresh data
      queryClient.invalidateQueries({ 
        queryKey: ['orders'],
        refetchType: 'all' 
      });
    },
  });
};

// hooks/useInfiniteOrders.js

export const useInfiniteOrders = (filters = {}) => {
  return useInfiniteQuery({
    queryKey: ['orders', 'infinite', JSON.stringify(filters)],
    queryFn: ({ pageParam = 1 }) => 
      orderService.getOrders({
        ...filters,
        pagination: true,
        page: pageParam,
        limit: 10,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 30000,
  });
};