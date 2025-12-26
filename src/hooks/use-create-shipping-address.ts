import { handleAxiosError } from '@/lib/utils';
import { createShippingAddress } from '@/services';
import { CreateShippingAddressRequest } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateShippingAddress() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (request: CreateShippingAddressRequest) =>
			createShippingAddress(request),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['user', 'shipping-addresses'],
			});
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
