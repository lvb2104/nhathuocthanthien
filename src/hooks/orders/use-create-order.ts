import { handleAxiosError } from '@/lib/utils';
import { createOrder } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateOrder() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createOrder,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
			queryClient.invalidateQueries({ queryKey: ['cart'] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
