import { getDeliveriesByEmployee } from '@/services';
import { GetDeliveriesByEmployeeResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useEmployeeDeliveries(
	initialData?: GetDeliveriesByEmployeeResponse,
) {
	return useQuery({
		queryKey: ['deliveries', 'employee'],
		queryFn: () => getDeliveriesByEmployee(),
		staleTime: 1000 * 60 * 5,
		initialData,
	});
}
