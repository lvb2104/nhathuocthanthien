import { getShippingAddresses } from '@/services';
import { GetShippingAddressesResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useShippingAddresses(
	initialData?: GetShippingAddressesResponse,
) {
	return useQuery({
		queryKey: ['user', 'shipping-addresses'],
		queryFn: () => getShippingAddresses(),
		staleTime: 1000 * 60 * 5, // 5 minutes
		initialData,
	});
}
