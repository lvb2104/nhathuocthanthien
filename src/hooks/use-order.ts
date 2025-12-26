import { getOrderById } from '@/services';
import { GetOrderByIdResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useOrder(id: number, initialData?: GetOrderByIdResponse) {
	return useQuery({
		queryKey: ['orders', id],
		queryFn: () => getOrderById(id),
		staleTime: 1000 * 60 * 5, // 5 minutes
		initialData,
		enabled: !!id,
	});
}
