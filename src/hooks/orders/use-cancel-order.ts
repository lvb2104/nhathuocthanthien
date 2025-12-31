import { handleAxiosError } from '@/lib/utils';
import { cancelOrder } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCancelOrder() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: cancelOrder,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
