import { getPromotions } from '@/services';
import { GetPromotionsResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function usePromotions(initialData?: GetPromotionsResponse) {
	return useQuery({
		queryKey: ['promotions'],
		queryFn: () => getPromotions(),
		staleTime: 1000 * 60 * 5, // 5 minutes
		initialData,
	});
}
