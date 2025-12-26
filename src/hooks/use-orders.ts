import { getAllOrders } from '@/services';
import { GetAllOrdersResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useOrders(initialData?: GetAllOrdersResponse) {
	return useQuery({
		queryKey: ['orders'],
		queryFn: () => getAllOrders(),
		staleTime: 1000 * 60 * 5, // 5 minutes
		initialData,
	});
}
