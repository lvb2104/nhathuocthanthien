import { getShippingAddressById } from '@/services';
import { useQuery } from '@tanstack/react-query';

export function useShippingAddress(id: number) {
	return useQuery({
		queryKey: ['user', 'shipping-address', id],
		queryFn: () => getShippingAddressById(id),
		staleTime: 1000 * 60 * 5, // 5 minutes
		enabled: !!id, // Only run query if id is provided
	});
}
