import { handleAxiosError } from '@/lib/utils';
import { deleteShippingAddress } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteShippingAddress() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => deleteShippingAddress(id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['user', 'shipping-addresses'],
			});
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
