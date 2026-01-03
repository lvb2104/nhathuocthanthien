import { getAllDeliveries } from '@/services';
import { DeliveryFilterParams, GetAllDeliveriesResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useDeliveries(
	params?: DeliveryFilterParams,
	placeholderData?: GetAllDeliveriesResponse,
) {
	return useQuery({
		queryKey: ['deliveries', params],
		queryFn: () => getAllDeliveries(params),
		staleTime: 1000 * 60 * 5,
		placeholderData,
	});
}
