// src/hooks/useOnboarding.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getRestaurantOnboardingList,
  getSingleRestaurantOnboarding,
  updateRestaurantOnboarding,
  createRestaurant
} from '../../services';

export const ONBOARDING_KEY = 'onboarding';

/* ─────────────────────────────────────────────
   useOnboardingList – fetch paginated list with search
   ───────────────────────────────────────────── */
export const useOnboardingList = (params) => {
  return useQuery({
    queryKey: [ONBOARDING_KEY, params],
    queryFn: () => getRestaurantOnboardingList(params),
    keepPreviousData: true,
  });
};

/* ─────────────────────────────────────────────
   useSingleOnboarding – fetch one record
   ───────────────────────────────────────────── */
export const useSingleOnboarding = (id) => {
  return useQuery({
    queryKey: [ONBOARDING_KEY, 'single', id],
    queryFn: () => getSingleRestaurantOnboarding(id),
    enabled: !!id,
  });
};

/* ─────────────────────────────────────────────
   useOnboardRestaurant – POST /api/restaurants
   ───────────────────────────────────────────── */
export const useCreateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRestaurant,

    onSuccess: (data, variables) => {
      // 🔄 Refresh restaurant list
      queryClient.invalidateQueries({ queryKey: ['restaurant'] });

      // Optional: if you still want to refresh onboarding list
      queryClient.invalidateQueries({ queryKey: ['onboarding'] });
    },

    onError: (error) => {
      console.error(
        'Create restaurant failed:',
        error?.response?.data?.message || error.message
      );
    },
  });
};

/* ─────────────────────────────────────────────
   useUpdateOnboardingStatus – PUT status
   ───────────────────────────────────────────── */
export const useUpdateOnboardingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRestaurantOnboarding,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ONBOARDING_KEY] });
    },

    onError: (error) => {
      console.error('Update status failed:', error?.response?.data?.message || error.message);
    },
  });
};