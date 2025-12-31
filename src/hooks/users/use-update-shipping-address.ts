import { handleAxiosError } from '@/lib/utils';
import { updateShippingAddress } from '@/services';
import { UpdateShippingAddressRequest } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateShippingAddress() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: number;
			data: UpdateShippingAddressRequest;
		}) => updateShippingAddress(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['user', 'shipping-addresses'],
			});
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
