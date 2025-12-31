import { handleAxiosError } from '@/lib/utils';
import { deleteOrder } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteOrder() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteOrder,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
