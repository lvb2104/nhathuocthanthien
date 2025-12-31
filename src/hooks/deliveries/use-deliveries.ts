import { getAllDeliveries } from '@/services';
import { GetAllDeliveriesResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useDeliveries(initialData?: GetAllDeliveriesResponse) {
	return useQuery({
		queryKey: ['deliveries'],
		queryFn: () => getAllDeliveries(),
		staleTime: 1000 * 60 * 5,
		initialData,
	});
}
