import { getAllOrders } from '@/services';
import { GetAllOrdersResponse, OrderFilterParams } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useOrders(
	params?: OrderFilterParams,
	initialData?: GetAllOrdersResponse,
) {
	return useQuery({
		queryKey: ['orders', params],
		queryFn: () => getAllOrders(params),
		staleTime: 1000 * 60 * 5, // 5 minutes
		initialData,
	});
}
